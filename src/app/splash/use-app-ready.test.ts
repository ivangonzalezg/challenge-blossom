import { act, renderHook } from '@testing-library/react-native';
import { useAppReady } from '@/app/splash/use-app-ready';
import {
  fetchCharacters,
  useFavoriteCharacters,
  useHiddenCharacters,
} from '@/entities/character';

jest.mock('@/entities/character', () => ({
  fetchCharacters: jest.fn(),
  useFavoriteCharacters: jest.fn(),
  useHiddenCharacters: jest.fn(),
}));

const mockedFetchCharacters = fetchCharacters as jest.Mock;
const mockedUseFavoriteCharacters = useFavoriteCharacters as jest.Mock;
const mockedUseHiddenCharacters = useHiddenCharacters as jest.Mock;

const MIN_DURATION_MS = 1800;

describe('useAppReady', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedFetchCharacters.mockReset();
    mockedUseFavoriteCharacters.mockReset();
    mockedUseHiddenCharacters.mockReset();
    mockedUseFavoriteCharacters.mockReturnValue({ isLoading: false });
    mockedUseHiddenCharacters.mockReturnValue({ isLoading: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('is not ready before the minimum duration elapses, even if data resolves instantly', async () => {
    mockedFetchCharacters.mockResolvedValueOnce({ results: [], info: null });

    const { result } = await renderHook(() => useAppReady());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isReady).toBe(false);
  });

  it('becomes ready once the minimum duration elapses and data has resolved', async () => {
    mockedFetchCharacters.mockResolvedValueOnce({ results: [], info: null });

    const { result } = await renderHook(() => useAppReady());

    await act(async () => {
      await Promise.resolve();
      jest.advanceTimersByTime(MIN_DURATION_MS);
      await Promise.resolve();
    });

    expect(result.current.isReady).toBe(true);
  });

  it('does not become ready before favorites finish loading, even after the timer elapses', async () => {
    mockedFetchCharacters.mockResolvedValueOnce({ results: [], info: null });
    mockedUseFavoriteCharacters.mockReturnValue({ isLoading: true });

    const { result } = await renderHook(() => useAppReady());

    await act(async () => {
      await Promise.resolve();
      jest.advanceTimersByTime(MIN_DURATION_MS);
      await Promise.resolve();
    });

    expect(result.current.isReady).toBe(false);
  });

  it('does not become ready before hidden-characters finish loading', async () => {
    mockedFetchCharacters.mockResolvedValueOnce({ results: [], info: null });
    mockedUseHiddenCharacters.mockReturnValue({ isLoading: true });

    const { result } = await renderHook(() => useAppReady());

    await act(async () => {
      await Promise.resolve();
      jest.advanceTimersByTime(MIN_DURATION_MS);
      await Promise.resolve();
    });

    expect(result.current.isReady).toBe(false);
  });

  it('still becomes ready after the minimum duration when the warm-up query fails', async () => {
    mockedFetchCharacters.mockRejectedValueOnce(new Error('network error'));

    const { result } = await renderHook(() => useAppReady());

    await act(async () => {
      await Promise.resolve();
      jest.advanceTimersByTime(MIN_DURATION_MS);
      await Promise.resolve();
    });

    expect(result.current.isReady).toBe(true);
  });
});
