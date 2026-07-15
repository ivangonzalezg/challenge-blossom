# Challenge Blossom (React Native App)

## Tech Stack

- **Framework**: React Native CLI (0.86), TypeScript
- **Navigation**: React Navigation (`@react-navigation/native` + `@react-navigation/native-stack`)
- **Data fetching**: Apollo Client + GraphQL, against the Rick and Morty GraphQL API
  (`src/shared/api/graphql-client.ts`)
- **Local persistence**: SQLite via `react-native-nitro-sqlite`
  (`src/shared/api/sqlite-client.ts`)
- **Styling**: NativeWind (Tailwind classes via `className`)
- **Icons**: `lucide-react-native`
- **Animation**: `react-native-reanimated` + `react-native-worklets`; splash screen via
  `react-native-bootsplash`
- **Testing**: Jest + `@testing-library/react-native`
- **Package Manager**: Yarn

## Project Structure

This project is not a monorepo — a single React Native app at the repo root.

```
/src
  /app        # App-wide setup: providers, root navigation container, splash screen
  /screens    # Screen compositions (FSD "pages" layer)
  /widgets    # Large self-contained UI blocks
  /features   # User interactions and business logic
  /entities   # Business entities (e.g. character)
  /shared     # Reusable utilities, UI kit, api client
/android      # Native Android project
/ios          # Native iOS project
/docs         # Specs and plans (superpowers workflow)
```

`widgets` and `features` layers are still placeholders (`.gitkeep` only). Remove a layer's
`.gitkeep` once it gains its first real slice.

## Architecture: Feature-Sliced Design (FSD)

Layers (top to bottom, each may only import from layers below it):

1. **app** — providers, root navigation container
2. **screens** — screen compositions (FSD "pages" layer)
3. **widgets** — complex UI blocks combining features/entities
4. **features** — user scenarios and interactions
5. **entities** — business domain models and their UI (e.g. `entities/character`)
6. **shared** — infrastructure, UI kit, api clients, utilities (no business logic)

Slices expose a public API via `index.ts` (see `src/entities/character/index.ts`) and use
segments like `ui/`, `model/`, `api/`, `lib/` as needed. Run `yarn steiger` to check layer
boundaries (config: `steiger.config.ts`).

## Where Things Go

- **GraphQL queries and API calls**: `entities/<slice>/api/` (e.g.
  `character.queries.ts`, `character.service.ts`). The Apollo client itself lives in
  `shared/api/graphql-client.ts` — don't instantiate another client elsewhere.
- **SQLite logic**: `entities/<slice>/api/*.service.ts` (see `favorite.service.ts`,
  `hidden.service.ts`, `comment.service.ts`). All queries go through `sqliteClient` from
  `shared/api` — don't open a second database connection.
  Table schema/migrations live in `shared/api/sqlite-client.ts`.
- **Cross-cutting state** (favorites, hidden characters): React context + hooks in
  `entities/<slice>/lib/` (e.g. `favorites-context.tsx`, `hidden-context.tsx`). Reuse
  these providers/hooks instead of adding new global state.
- **Shared UI primitives**: `shared/ui/`, re-exported from `shared/ui/index.ts` (e.g.
  `AvatarImage`, `BottomSheetModal`, `ErrorMessage`, `SectionHeader`). Reuse these before
  building new one-off components.
- **Navigation routes**: `app/navigation/root-navigator.tsx`. Add new stack screens here
  and extend `RootStackParamList`.

## Language Conventions

- UI copy and code (variable names, function names, types, file names, comments) are in
  English.

## Path Alias

- Use `@/` to import from `src` (e.g. `import { colors } from '@/shared/ui'`) instead of
  deep relative paths. Configured in `babel.config.js` (`babel-plugin-module-resolver`) and
  `tsconfig.json` (`compilerOptions.paths`) — keep both in sync if it ever changes.

## Styling

- Use NativeWind (`className="..."`) for styling. `StyleSheet.create` is acceptable only
  where NativeWind can't express the need (e.g. `Animated`/worklet styles in the splash
  screen) — it's not the default approach.
- Support light/dark mode: use Tailwind `dark:` variants for `className`, and
  `useColorScheme()` + `shared/ui/colors.ts` where a raw color value is needed (e.g.
  `underlayColor`).

## Testing

- Co-locate tests next to the code they cover (e.g. `favorite.service.test.ts` next to
  `favorite.service.ts`).
- Mock `sqliteClient`/network boundaries rather than hitting real SQLite or the GraphQL
  API in unit tests (see `favorite.service.test.ts` for the pattern).
- Add or update tests whenever you change service/hook behavior.

## Quality Tooling

Run before considering any change under `src/` complete:

- `yarn lint` — ESLint (`@react-native/eslint-config`)
- `yarn typecheck` — TypeScript, no emit
- `yarn test` — Jest unit tests
- `yarn format` — Prettier check (`yarn format:write` to auto-fix); `.prettierignore`
  excludes `ios/`, `android/`, `vendor/`, `node_modules/`, and `docs/`
- `yarn steiger` — FSD layer-boundary linting
- `yarn validate` — runs lint, typecheck, format, and steiger in sequence; treat this as
  the required pre-completion check

Other useful commands: `yarn install`, `npx pod-install` (iOS), `yarn start`, `yarn android`,
`yarn ios`.

## Coding Rules

- Type everything explicitly at module boundaries (exported functions, hooks, component
  props); avoid `any`.
- Reuse existing services, hooks, and UI primitives before writing new ones.
- Keep business logic out of screen/UI components — put it in `entities`/`features`
  hooks and services.
- Don't bypass `shared/api` clients (Apollo, SQLite) by creating new connections.
- Don't introduce a new state management library — React context (see
  `favorites-context.tsx`, `hidden-context.tsx`) is the established pattern here.

## Documentation Policy

This project uses a single, centralized `AGENTS.md` at the repo root. Do not create
per-layer or per-slice `AGENTS.md` files — keep all conventions here and update this file
as the project grows.

## How to Keep AGENTS.md Updated

- When a new layer gains its first real slice, document the slice's purpose here.
- After any change under `src/`, run `yarn validate` to keep formatting/TS/ESLint/FSD
  structure clean.
