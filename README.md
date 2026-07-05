# Challenge Blossom

## Description

A React Native mobile application. This project is being scaffolded to follow Feature
Sliced Design (FSD) conventions and connects to an external API (backend gateway/client
to be designed separately — this app does not use Supabase).

## Tech Stack

- React Native CLI (0.86) + TypeScript
- React Navigation (`@react-navigation/native` + `@react-navigation/native-stack`)
- Yarn
- Steiger (FSD architecture linting)

## Architecture

- Frontend organization: Feature Sliced Design in `/src` (see `AGENTS.md` for the full
  layer breakdown and conventions).
- Navigation: React Navigation, Native Stack navigator (not yet wired to real screens).
- Backend: external API, integration approach to be defined (see `AGENTS.md`
  "Deferred / Not Yet Decided").

## Prerequisites

- Node.js (LTS recommended, currently developed against Node 24)
- Yarn
- Ruby + Bundler (for CocoaPods, iOS only)
- CocoaPods (iOS only, installed via `bundle exec pod install`)
- Xcode (iOS) / Android Studio (Android) set up per the
  [React Native environment guide](https://reactnative.dev/docs/set-up-your-environment)

## Installation

```bash
yarn
```

### iOS additional setup

```bash
bundle install
bundle exec pod install --project-directory=ios
```

## Running the app

Start Metro (the JS bundler) first:

```bash
yarn start
```

Then, in a separate terminal, run the platform of your choice:

```bash
yarn android
# or
yarn ios
```

## Quality Scripts

Run these before pushing changes:

```bash
yarn lint         # ESLint
yarn typecheck     # TypeScript, no emit
yarn format        # Prettier check (yarn format:write to auto-fix)
yarn steiger       # FSD architecture/layer-boundary linting
yarn validate   # Runs all of the above in sequence
```

## Project Structure

See `AGENTS.md` for the full Feature Sliced Design layer breakdown, path alias
conventions, and a list of decisions still pending (styling solution, API/data layer).

## Contributing

- Follow Feature Sliced Design conventions documented in `AGENTS.md`.
- Run `yarn validate` before considering a change complete.
- This project uses a single centralized `AGENTS.md` — do not create per-layer or
  per-slice `AGENTS.md` files.

## License

No license specified yet.
