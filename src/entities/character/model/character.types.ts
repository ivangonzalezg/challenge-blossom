export type Character = {
  id: string;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
};

export type CharactersPageInfo = {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
};

export type GetCharactersResponse = {
  characters: {
    info: CharactersPageInfo;
    results: Character[];
  };
};

export type GetCharactersVariables = {
  page?: number;
  filter?: {
    name?: string;
    species?: string;
    status?: string;
    gender?: string;
  };
};

export type GetCharacterResponse = {
  character: Character;
};

export type GetCharacterVariables = {
  id: string;
};

export type GetCharactersByIdsResponse = {
  charactersByIds: Character[];
};

export type GetCharactersByIdsVariables = {
  ids: string[];
};

export type CharactersFilter = 'all' | 'starred' | 'others';
export type SpecieFilter = 'all' | 'human' | 'alien';
export type StatusFilter = 'all' | 'alive' | 'dead' | 'unknown';
export type GenderFilter = 'all' | 'female' | 'male' | 'genderless' | 'unknown';
export type VisibilityFilter = 'all' | 'visible' | 'hidden';
