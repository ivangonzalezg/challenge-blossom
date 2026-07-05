# Challenge Blossom

A React Native mobile app built for the **Blossom technical assessment**, using the [Rick and Morty GraphQL API](https://rickandmortyapi.com/documentation/#graphql).

Users can browse and search characters, sort them by name, view character details, mark favorites, add comments, and hide ("soft-delete") characters — all with data persisted locally on-device.

## Demo

https://github.com/user-attachments/assets/9c78b8f2-1887-4a69-a7c6-80fd5a9b5500

## Tech Stack

- **React Native 0.86** (bare CLI, not Expo) + **TypeScript**
- **GraphQL** via `@apollo/client` (`HttpLink` + `InMemoryCache`)
- **React Navigation** (native stack)
- **NativeWind v4** (Tailwind CSS) for styling
- **`react-native-nitro-sqlite`** for local persistence
- **`react-native-reanimated`** + **`react-native-bootsplash`** for the animated splash screen
- **Jest** + **`@testing-library/react-native`** for unit tests
- ESLint, Prettier, and Steiger (Feature-Sliced Design linting)

## Features

**Required**

- Character listing (paginated, infinite scroll, search by name)
- Character cards with name, image, and species
- Sort by name A-Z / Z-A
- Character detail screen (name, image, species, status, gender)
- Favorite characters (mark/unmark)
- Comments (add and view)
- NativeWind styling throughout
- GraphQL integration via Apollo Client

**Bonus**

- TypeScript across the codebase
- Soft-delete / hide characters, with restore
- Filters by status, species, gender, and visibility (visible/hidden/all)
- Unit tests (Jest)

**Extras**

- Animated splash screen gated on data readiness
- Debounced search (400ms)
- Retry with backoff on HTTP 429 responses
- Light/dark theme, following the system color scheme

## App Flow

1. **Splash** — animated splash while favorites/hidden data loads and an initial fetch warms up.
2. **Character list** — "Starred Characters" (favorites) + paginated "Characters" sections, with search and a filters sheet (status, species, gender, visibility).
3. **Sort** — toggle A-Z / Z-A from the "Starred Characters" header.
4. **Detail** — tap a card to view full character info.
5. **Favorites** — toggle via heart icon; persisted locally.
6. **Comments** — add and view comments from the detail screen.
7. **Hide / restore** — hide a character from its detail screen (soft-delete); find it again via the "hidden" filter and restore it from there.

## API

- **Source**: public [Rick and Morty GraphQL API](https://rickandmortyapi.com/documentation/#graphql) — `https://rickandmortyapi.com/graphql`
- **Client**: `src/shared/api/graphql-client.ts` (Apollo Client, `InMemoryCache`)
- **Queries**: `src/entities/character/api/character.queries.ts`
- **Service layer** (fetch orchestration, retry-on-429): `src/entities/character/api/character.service.ts`

Main queries:

```graphql
query GetCharacters($page: Int, $filter: FilterCharacter) {
  characters(page: $page, filter: $filter) {
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
```

`GetCharacters` powers the list and accepts an optional `filter` (`name`, `species`, `status`, `gender`). A third query, `GetCharactersByIds`, re-fetches full character data for stored favorite/hidden IDs. Loading and error states are handled per-screen via Apollo query hooks and shared components (`error-message`, `section-footer-spinner`).

## Local Persistence

Favorites, comments, and hidden characters are stored on-device with **SQLite** (`react-native-nitro-sqlite`), configured in `src/shared/api/sqlite-client.ts`:

| Table               | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `favorites`         | IDs of favorited characters               |
| `comments`          | Comments per character, with timestamps   |
| `hidden_characters` | IDs of hidden ("soft-deleted") characters |

Only IDs are stored locally; full character data is re-fetched from the API when needed. Hiding a character is a local-only operation — it never affects the remote API — and can be reversed at any time from the character's detail screen.

## Project Structure

Follows **Feature-Sliced Design** (see `AGENTS.md`), linted with Steiger. Path alias `@/` maps to `src/`.

```
src/
├── app/            # Entry point, navigation, splash screen
├── entities/
│   └── character/  # Domain logic: api (queries/services), lib (hooks/contexts), model (types), ui
├── screens/        # Screen-level compositions
└── shared/
    ├── api/        # Apollo + SQLite clients
    └── ui/         # Shared UI components
```

## Prerequisites

- Node.js >= 22.11.0, Yarn
- [React Native environment](https://reactnative.dev/docs/set-up-your-environment) set up for your target platform (Xcode/CocoaPods for iOS, Android Studio/JDK for Android)

## Installation

```bash
yarn install
npx pod-install
```

## Running the App

```bash
yarn start

# in a separate terminal
yarn android
# or
yarn ios
```

## Running Tests

```bash
yarn test
```

Covers the splash readiness hook, visibility filter logic, favorites/hidden SQLite services, character service (including 429 retry/backoff), and an app render smoke test.

## Other Scripts

```bash
yarn lint          # ESLint
yarn typecheck     # TypeScript
yarn format        # Prettier check (yarn format:write to auto-fix)
yarn steiger       # Feature-Sliced Design linting
yarn validate      # lint + typecheck + format + steiger
```

## Assessment Coverage

| Requirement                              | Status | Notes                                    |
| ---------------------------------------- | ------ | ---------------------------------------- |
| React Native                             | ✅     | Bare CLI, 0.86                           |
| GraphQL                                  | ✅     | Apollo Client, public Rick and Morty API |
| React Navigation                         | ✅     | Native stack, 3 screens                  |
| TailwindCSS styling                      | ✅     | NativeWind v4                            |
| State management                         | ✅     | React Context + Apollo cache             |
| TypeScript types                         | ✅     | `Character`, `Comment`, filters, etc.    |
| Character list                           | ✅     | Paginated, search                        |
| Character cards (name, image, species)   | ✅     |                                          |
| Sort A-Z / Z-A                           | ✅     |                                          |
| Character details                        | ✅     |                                          |
| Favorites                                | ✅     | Persisted in SQLite                      |
| Comments                                 | ✅     | Persisted in SQLite                      |
| Unit tests                               | ✅     | Jest + React Native Testing Library      |
| TypeScript (bonus)                       | ✅     |                                          |
| Soft-delete / restore (bonus)            | ✅     | Local-only, no remote data affected      |
| Filters by status/species/gender (bonus) | ✅     |                                          |

## Notes for Reviewers

- Favorites, comments, and hidden characters are local-only concepts, so they're persisted with SQLite rather than sent to any backend.
- Screen compositions live under `src/screens/` rather than FSD's standard `pages/` layer — an intentional deviation for this project.
- `yarn validate` runs lint/typecheck/format/steiger but not tests; run `yarn test` separately.
