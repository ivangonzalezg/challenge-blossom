import { ApolloError } from '@apollo/client';
import { fetchCharacters } from '@/entities/character/api/character.service';
import { graphqlClient } from '@/shared/api';

jest.mock('@/shared/api', () => ({
  graphqlClient: {
    query: jest.fn(),
  },
}));

const mockedQuery = graphqlClient.query as jest.Mock;

function make429Error(retryAfterHeader: string | null) {
  const error = new Error('Too Many Requests') as Error & {
    response: Response;
    result: string;
    statusCode: number;
  };
  error.name = 'ServerError';
  error.statusCode = 429;
  error.result = 'error code: 1015';
  error.response = {
    headers: {
      get: (key: string) =>
        key.toLowerCase() === 'retry-after' ? retryAfterHeader : null,
    },
  } as Response;
  return error;
}

const successResponse = {
  data: {
    characters: {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: '1',
          name: 'Rick Sanchez',
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          species: 'Human',
          status: 'Alive',
          gender: 'Male',
        },
      ],
    },
  },
};

describe('fetchCharacters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedQuery.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns data immediately on success without retrying', async () => {
    mockedQuery.mockResolvedValueOnce(successResponse);

    const result = await fetchCharacters(1);

    expect(result).toEqual(successResponse.data.characters);
    expect(mockedQuery).toHaveBeenCalledTimes(1);
  });

  it('retries after a 429, waiting for the retry-after header duration', async () => {
    mockedQuery
      .mockRejectedValueOnce(make429Error('3'))
      .mockResolvedValueOnce(successResponse);

    const promise = fetchCharacters(1);

    await Promise.resolve();
    await Promise.resolve();
    jest.advanceTimersByTime(3000);

    const result = await promise;

    expect(result).toEqual(successResponse.data.characters);
    expect(mockedQuery).toHaveBeenCalledTimes(2);
  });

  it('defaults to a 2s wait when retry-after header is missing', async () => {
    mockedQuery
      .mockRejectedValueOnce(make429Error(null))
      .mockResolvedValueOnce(successResponse);

    const promise = fetchCharacters(1);

    await Promise.resolve();
    await Promise.resolve();
    jest.advanceTimersByTime(2000);

    const result = await promise;

    expect(result).toEqual(successResponse.data.characters);
    expect(mockedQuery).toHaveBeenCalledTimes(2);
  });

  it('gives up after 3 total attempts and rethrows', async () => {
    mockedQuery
      .mockRejectedValueOnce(make429Error('1'))
      .mockRejectedValueOnce(make429Error('1'))
      .mockRejectedValueOnce(make429Error('1'));

    const promise = fetchCharacters(1);
    promise.catch(() => {});

    await Promise.resolve();
    await Promise.resolve();
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    await Promise.resolve();
    jest.advanceTimersByTime(1000);

    await expect(promise).rejects.toThrow('Too Many Requests');
    expect(mockedQuery).toHaveBeenCalledTimes(3);
  });

  it('does not retry on non-429 errors', async () => {
    const networkError = new ApolloError({
      errorMessage: 'Network error',
    });
    mockedQuery.mockRejectedValueOnce(networkError);

    await expect(fetchCharacters(1)).rejects.toThrow('Network error');
    expect(mockedQuery).toHaveBeenCalledTimes(1);
  });
});
