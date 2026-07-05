# Challenge Blossom (React Native App)

## Tech Stack

- **Framework**: React Native CLI (0.86), TypeScript
- **Navigation**: React Navigation (`@react-navigation/native` + `@react-navigation/native-stack`)
- **Package Manager**: Yarn
- **Backend**: External API (not Supabase). A dedicated gateway/client layer will be designed later under `src/shared/api` once the API contract is defined.

## Project Structure

This project is not a monorepo — a single React Native app at the repo root.

```
/src
  /app        # App-wide setup: providers, root navigation container, global config
  /pages      # Page compositions (FSD "pages" layer)
  /widgets    # Large self-contained UI blocks
  /features   # User interactions and business logic
  /entities   # Business entities
  /shared     # Reusable utilities, UI kit, api client (once defined)
/android      # Native Android project
/ios          # Native iOS project
/docs         # Specs and plans (superpowers workflow)
```

Each layer folder currently contains only a `.gitkeep` placeholder — there are no slices
yet. Do not add a layer-root `index.ts`: Steiger's `fsd/no-layer-public-api` rule rejects
it, since in FSD the public API (`index.ts`) belongs at the _slice_ level (e.g.
`entities/user/index.ts`), not the layer root. Remove a layer's `.gitkeep` once it gains
its first real slice.

## Frontend: Feature Sliced Design (FSD)

Layers (top to bottom, can only import from layers below):

1. **app** - Application initialization, providers, root navigation container
2. **pages** - Page compositions (FSD calls this layer "pages", not "screens" — this
   project follows the standard FSD naming; only Next.js App Router projects rename it
   to "screens" to avoid clashing with routing conventions)
3. **widgets** - Complex UI blocks combining features/entities
4. **features** - User scenarios and interactions
5. **entities** - Business domain models and their UI
6. **shared** - Infrastructure, UI kit, utilities (no business logic)

Each layer contains slices (domain folders) as the app grows. Slices have segments such as
`ui/`, `model/`, `api/`, `lib/` — created as needed, not scaffolded in advance.

Import rule: a layer may only import from layers below it in the list above. Steiger
(`steiger.config.ts`, using `@feature-sliced/steiger-plugin`'s `recommended` preset)
enforces this — run `yarn steiger` to check.

## Documentation Policy (deviates from distributed-AGENTS.md pattern)

**This project uses a single, centralized `AGENTS.md` at the repo root.** Unlike
distributed-documentation setups where every layer/slice gets its own `AGENTS.md`, do
**not** create per-layer or per-slice `AGENTS.md` files here. All structural and
development conventions live in this one file. Keep it updated as the project grows
instead of splitting it up.

## Language Conventions

- Both UI copy and code (variable names, function names, types, file names, comments) are
  in **English**. This project does not follow the Spanish-UI-copy convention used by some
  sibling projects.

## Path Alias

- Use `@/` to import from `src` (e.g., `import { Button } from '@/shared/ui/button'`)
  instead of deep relative paths (`../../../shared/ui/button`).
- Configured in `babel.config.js` (via `babel-plugin-module-resolver`) and `tsconfig.json`
  (`compilerOptions.paths`). Keep both in sync if the alias ever changes.

## Quality Tooling

Run these before considering any change under `src/` complete:

- `yarn lint` — ESLint (`@react-native/eslint-config`)
- `yarn typecheck` — TypeScript, no emit
- `yarn format` — Prettier check (`yarn format:write` to auto-fix); `.prettierignore`
  excludes `ios/`, `android/`, `vendor/`, `node_modules/`, and `docs/`
- `yarn steiger` — FSD architecture/layer-boundary linting
- `yarn validate` — runs all four in sequence; treat this as the required
  pre-completion check, equivalent to `validate:next` in sibling Next.js projects

## Deferred / Not Yet Decided

These areas are intentionally unset — do not assume a default or invent one without
checking with the user first:

- **Styling solution**: `tailwind.config.js` and `nativewind-env.d.ts` exist as unused
  placeholders. NativeWind vs. plain `StyleSheet` has not been decided.
- **API/data layer**: This app calls an external API (not Supabase). No HTTP client,
  gateway abstraction, or data-fetching library (e.g., React Query) has been chosen yet.
- **Navigation content**: `@react-navigation/native` + `native-stack` are installed, but no
  actual navigator, stack, or screens have been wired up yet — `src/app` and `src/pages`
  are currently empty placeholders.

## How to Keep AGENTS.md Updated

- When a new layer gains its first real slice, document the slice's purpose here rather
  than creating a new `AGENTS.md` file for it.
- When a deferred decision above gets made (styling, API layer, etc.), replace its bullet
  with the actual decision and remove it from "Deferred / Not Yet Decided".
- After any change under `src/`, run `yarn validate` to keep formatting/TS/ESLint/FSD
  structure clean.
