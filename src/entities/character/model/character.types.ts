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
  filter?: { name: string };
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
