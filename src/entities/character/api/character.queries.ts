import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        image
        species
        status
        gender
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      image
      species
      status
      gender
    }
  }
`;

export const GET_CHARACTERS_BY_IDS = gql`
  query GetCharactersByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      image
      species
      status
      gender
    }
  }
`;

export const CHARACTER_FRAGMENT = gql`
  fragment CharacterFragment on Character {
    id
    name
    image
    species
    status
    gender
  }
`;
