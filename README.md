# Challenge Blossom

A React Native mobile application built for the **Blossom technical assessment**, using the [Rick and Morty GraphQL API](https://rickandmortyapi.com/documentation/#graphql).

The app lets users browse and search Rick and Morty characters, sort them by name, open a character's detail screen, mark characters as favorites, leave comments on a character, and hide ("soft-delete") characters they don't want to see — all with data persisted locally on-device.

## Demo

A short screen recording showing the full flow — app launch, browsing the character list, marking a favorite, adding a comment, and hiding (soft-deleting) a character:

https://github.com/user-attachments/assets/9c78b8f2-1887-4a69-a7c6-80fd5a9b5500

## Tech Stack

- **React Native 0.86** (bare CLI project, not Expo) + **TypeScript**
- **GraphQL** via `@apollo/client` (`HttpLink` + `InMemoryCache`)
- **React Navigation** (`@react-navigation/native` + `@react-navigation/native-stack`)
- **NativeWind v4** (Tailwind CSS for React Native) for styling
- **`react-native-nitro-sqlite`** for local persistence (favorites, comments, hidden characters)
- **`react-native-reanimated`** + **`react-native-bootsplash`** for the animated splash screen
- **`react-native-gesture-handler`**, **`react-native-screens`**, **`react-native-safe-area-context`**, **`react-native-svg`** — React Navigation/UI runtime dependencies
- **`lucide-react-native`** for icons
- **`javascript-time-ago`** / **`react-time-ago`** for relative comment timestamps
- **Jest** + **`@testing-library/react-native`** for unit tests
- **ESLint**, **Prettier** (with `prettier-plugin-tailwindcss`), and **Steiger** (Feature-Sliced Design architecture linting)

## Features

### Required (assessment) features implemented

- Character listing (paginated, infinite scroll) — `src/screens/characters-list/characters-list.screen.tsx`
- Character cards showing name, image, and species — `src/entities/character/ui/character-list-item.tsx`
- Sorting by name A-Z / Z-A (toggle on the "Starred Characters" section) — `src/entities/character/lib/sort-characters-by-name.ts`
- Character detail screen (name, image, species, status, gender) — `src/screens/character-detail/character-detail.screen.tsx`
- Favorite characters (mark/unmark) — `src/entities/character/lib/favorites-context.tsx`
- Character comments (add and view) — `src/entities/character/lib/use-comments.ts`
- Styling with NativeWind (Tailwind CSS) throughout the app
- GraphQL API integration via Apollo Client against the public Rick and Morty API

### Bonus features implemented

- **TypeScript** across the entire codebase
- **Soft-delete / hidden characters** — characters can be hidden from the list without deleting any remote data
- **Restore hidden characters** — a hidden character can be un-hidden from its detail screen
- **Filters/search by status, species, and gender**, plus a visibility filter (visible / hidden / all) — `src/screens/characters-list/character-filters-sheet-content.tsx` and `src/screens/advanced-search-results/advanced-search-results.screen.tsx`
- **Unit tests** with Jest — see [Running tests](#running-tests)

### Additional UX/polish

- Animated splash screen (logo pulse, wordmark fade, progress bar) gated on data being ready, built with `react-native-reanimated` and `react-native-bootsplash` — `src/app/splash/`
- Debounced text search (400ms) on the main character list
- Automatic retry with backoff on HTTP 429 responses from the API (respects `Retry-After` header)
- Light/dark theme support via React Navigation's `DarkTheme`/`DefaultTheme`, following the system color scheme

## App Flow

1. **Splash screen** — an animated splash is shown while the app warms up (loads favorites/hidden data from SQLite and performs an initial characters fetch), then fades into the main app.
2. **Character list** — shows a "Starred Characters" section (favorites) and a paginated "Characters" section. Users can type in the search bar to filter by name, or open the filters sheet to filter by status, species, gender, and visibility (visible/hidden/all).
3. **Sort** — tapping the sort control on the "Starred Characters" header toggles name sort order between A-Z and Z-A.
4. **Character detail** — tapping a card opens the detail screen with the character's image, name, species, status, and gender.
5. **Favorites** — tapping the heart icon (on a card or the detail screen) adds/removes the character from favorites; the change is persisted locally and reflected immediately in the "Starred Characters" section.
6. **Comments** — from the detail screen, users can add a comment and see the full comment history for that character, ordered by creation time.
7. **Hide / soft-delete** — from the detail screen, users can hide a character via the eye icon; hidden characters disappear from the default list but remain accessible through the "hidden" visibility filter.
8. **Restore** — a hidden character can be restored (un-hidden) from its own detail screen, or by finding it via the "hidden" visibility filter and reopening its detail screen.

## API Documentation

- **API**: Public [Rick and Morty GraphQL API](https://rickandmortyapi.com/documentation/#graphql)
- **Base URL**: `https://rickandmortyapi.com/graphql`
- **Client setup**: `src/shared/api/graphql-client.ts` — Apollo Client configured with `HttpLink` pointing at the base URL above and an `InMemoryCache`.
- **Queries**: `src/entities/character/api/character.queries.ts`
- **Service layer** (query orchestration, retry logic): `src/entities/character/api/character.service.ts`

### Queries used

```graphql
fragment CharacterFragment on Character {
  id
  name
  image
  species
  status
  gender
}

query GetCharacters($page: Int, $filter: FilterCharacter) {
  characters(page: $page, filter: $filter) {
    info {
      count
      pages
      next
      prev
    }
    results {
      ...CharacterFragment
    }
  }
}

query GetCharacter($id: ID!) {
  character(id: $id) {
    ...CharacterFragment
  }
}

query GetCharactersByIds($ids: [ID!]!) {
  charactersByIds(ids: $ids) {
    ...CharacterFragment
  }
}
```

- `GetCharacters` powers the paginated list and accepts an optional `filter` object (`name`, `species`, `status`, `gender`) — the filter is only included in the request when at least one value is set.
- `GetCharacter` powers the character detail screen.
- `GetCharactersByIds` is used to re-fetch full character records for favorites/hidden characters from their stored IDs.

### Error / loading handling

- `fetchCharacters` in `character.service.ts` wraps the GraphQL call with a retry helper (`withRetryOn429`) that retries up to 3 times on HTTP 429 responses, honoring the `Retry-After` header when present (defaulting to a 2-second backoff).
- Screens expose loading and error states from Apollo's query hooks / the custom `use-characters-list` and `use-character` hooks, rendered via shared UI components such as `src/shared/ui/error-message.tsx` and `src/shared/ui/section-footer-spinner.tsx`.

## Local Persistence / Offline Data

The app uses **`react-native-nitro-sqlite`** for all local persistence. The database client is configured in `src/shared/api/sqlite-client.ts` (database file `challenge-blossom.db`), which creates three tables on startup:

| Table               | Purpose                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| `favorites`         | Stores the IDs of characters marked as favorite                                   |
| `comments`          | Stores comments (`character_id`, `text`, `created_at`), indexed by `character_id` |
| `hidden_characters` | Stores the IDs of characters that have been hidden ("soft-deleted")               |

- **Favorites** — read/write in `src/entities/character/api/favorite.service.ts`, exposed to the UI through `src/entities/character/lib/favorites-context.tsx`.
- **Comments** — read/write in `src/entities/character/api/comment.service.ts`, exposed through `src/entities/character/lib/use-comments.ts`.
- **Hidden characters** — read/write in `src/entities/character/api/hidden.service.ts`, exposed through `src/entities/character/lib/hidden-context.tsx`.

Favorite and hidden character IDs are stored locally and the corresponding full `Character` data is re-fetched from the GraphQL API on demand (via `GetCharactersByIds`) — no character data is duplicated permanently in SQLite beyond the ID reference.

**Soft-delete note**: hiding a character is purely a local operation. It only removes the character's ID from the app's local view (via the `hidden_characters` table) — it never deletes or mutates any data on the remote Rick and Morty API. Restoring a hidden character simply removes its row from `hidden_characters`, making it visible again immediately.

## Project Structure

The codebase follows **Feature-Sliced Design (FSD)**, linted with Steiger (see `steiger.config.ts` and `AGENTS.md` for the full convention). The path alias `@/` maps to `src/`.

```
src/
├── app/                 # App entry, navigation, splash screen
│   ├── App.tsx
│   ├── navigation/      # root-navigator.tsx (native stack: CharactersList, CharacterDetail, AdvancedSearchResults)
│   └── splash/          # animated-splash-screen.tsx, use-app-ready.ts
├── entities/
│   └── character/       # Character domain: api (queries/services), lib (hooks/contexts), model (types), ui
├── screens/             # Screen-level compositions (characters-list, character-detail, advanced-search-results)
├── shared/
│   ├── api/             # graphql-client.ts (Apollo), sqlite-client.ts (SQLite)
│   └── ui/              # Shared UI: avatar-image, bottom-sheet-modal, section-header, error-message, etc.
├── features/            # (reserved FSD layer, currently empty)
├── pages/               # (reserved FSD layer, currently empty)
└── widgets/             # (reserved FSD layer, currently empty)
```

> **Note**: `AGENTS.md` documents FSD's `pages` layer as the intended home for screen compositions. In practice, screens currently live under `src/screens/` rather than `src/pages/`, which is still an empty placeholder layer. This is a known deviation from the documented convention.

## Prerequisites

- **Node.js >= 22.11.0** (as declared in `package.json` `engines`)
- **Yarn**
- A working [React Native environment](https://reactnative.dev/docs/set-up-your-environment) for the platform(s) you want to run:
  - **iOS**: Xcode + CocoaPods
  - **Android**: Android Studio + JDK

## Installation

```bash
yarn install
```

For iOS, install native pods:

```bash
npx pod-install
```

## Running the App

Start Metro:

```bash
yarn start
```

In a separate terminal, run the app on your platform of choice:

```bash
yarn android
# or
yarn ios
```

## Running Tests

```bash
yarn test
```

Unit tests (Jest + `@testing-library/react-native`) cover:

- Splash screen readiness gating (`src/app/splash/use-app-ready.test.ts`)
- Visibility filter logic (`src/entities/character/lib/visibility-filter.test.ts`)
- Hidden characters SQLite service (`src/entities/character/api/hidden.service.test.ts`)
- Favorites SQLite service (`src/entities/character/api/favorite.service.test.ts`)
- Character GraphQL service, including filter construction and 429 retry/backoff behavior (`src/entities/character/api/character.service.test.ts`)
- App rendering smoke test (`__tests__/App.test.tsx`)

## Other Scripts

```bash
yarn lint          # ESLint
yarn typecheck     # TypeScript, no emit
yarn format        # Prettier check (yarn format:write to auto-fix)
yarn steiger       # Feature-Sliced Design architecture/layer-boundary linting
yarn validate      # Runs lint, typecheck, format:write, format, and steiger in sequence
```

## Environment Variables

No environment variables are required. The app talks directly to the public Rick and Morty GraphQL API at a hardcoded base URL (`src/shared/api/graphql-client.ts`); there are no `.env` files or secrets in this project.

## Assessment Coverage

| Requirement                            | Status | Notes                                                                   |
| -------------------------------------- | ------ | ----------------------------------------------------------------------- |
| React Native mobile app                | ✅     | Bare React Native CLI 0.86                                              |
| GraphQL                                | ✅     | Apollo Client against the public Rick and Morty GraphQL API             |
| React Navigation                       | ✅     | Native stack navigator with 3 screens                                   |
| TailwindCSS-based styling              | ✅     | NativeWind v4                                                           |
| State management                       | ✅     | React Context (favorites, hidden characters) + Apollo `InMemoryCache`   |
| Interfaces/types                       | ✅     | TypeScript `type` definitions for `Character`, `Comment`, filters, etc. |
| Character list                         | ✅     | Paginated, infinite scroll, with search                                 |
| Character cards (name, image, species) | ✅     |                                                                         |
| Sort A-Z / Z-A                         | ✅     |                                                                         |
| Character details                      | ✅     |                                                                         |
| Favorite characters                    | ✅     | Persisted in SQLite                                                     |
| Character comments                     | ✅     | Persisted in SQLite                                                     |
| Unit testing                           | ✅     | Jest + React Native Testing Library                                     |
| TypeScript (bonus)                     | ✅     |                                                                         |
| Soft-delete (bonus)                    | ✅     | Local-only hide/restore, no remote data affected                        |
| Filters/search by status (bonus)       | ✅     |                                                                         |
| Filters/search by species (bonus)      | ✅     |                                                                         |
| Filters/search by gender (bonus)       | ✅     |                                                                         |

## Notes for Reviewers

- **Why local persistence**: Favorites, comments, and hidden characters are user-generated/local-only concepts that the public Rick and Morty API has no concept of, so they're persisted on-device with SQLite (`react-native-nitro-sqlite`) rather than sent to any backend.
- **How soft-delete works**: hiding a character only inserts its ID into a local `hidden_characters` table; it is a purely client-side visibility filter. No remote data is ever deleted. Restoring removes the row, immediately making the character visible again.
- **Known limitation**: the `__tests__/App.test.tsx` smoke test can fail in some environments due to a NativeWind/Jest transform issue on an unrelated internal module (`react-native-css-interop`); the other 5 test suites (35 tests covering business logic) pass independently of this.
- **Architecture note**: the project follows Feature-Sliced Design, but screen compositions currently live in `src/screens/` rather than the FSD-standard `src/pages/` layer (still an empty placeholder). This is a known, intentional deviation for this assessment rather than an oversight.
- **Tradeoff**: `yarn validate` runs lint/typecheck/format/steiger but intentionally does not run `yarn test` — run tests separately as shown above.
