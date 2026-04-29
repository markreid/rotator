# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server
- `npm run build` — production build
- `npm test` — run tests (Jest + React Testing Library, interactive watch mode)
- `npm run deploy` — deploy to GitHub Pages (runs build first via `predeploy`)

## Architecture

React 18 app (Create React App) for managing player substitutions during a sports game. Deployed as a PWA to GitHub Pages at `markreid.github.io/rotator`.

### UI Framework
MUI Joy UI (`@mui/joy`) with `react-icons/io5` for icons. No router — navigation is handled via a `route` string in App state (`useState`), rendering different screens conditionally.

### Key Files
- **`App.js`** — Top-level routing. Routes: `GAME`, `PLAYERS`, `GAME SETTINGS`, `SUB SETTINGS`, `SOUNDS`, `RESET`
- **`Game.js`** — Core game screen. Manages clock, player lists (on-field/bench), substitution logic, and sound triggers. Contains `autoSub` (automatic player selection) and `makeSub` (execute substitution)
- **`configs.js`** — All persistent state via `localStorage` (keyed as `rotator.<key>`). Provides `getConfig`/`saveConfig`/`resetConfig`. Default configs for clock, players, game settings, and sub settings
- **`util.js`** — Pure utility functions: clock formatting, sub time calculations (`calcSubTimes`, `calculateSubsPlan`), player time tracking (`calcPlayerTimesFromSubs`), and rotation math (`calcMinChanges`, `calcChanges`)
- **`sound.js`** — Single shared `Audio` element. `playSound(name)` / `stopSound()`. Sound events: `nextSubSoon`, `nextSubReady`, `periodFinished`, `clockStart`
- **`service-worker.js`** — Workbox-based PWA service worker with precaching and app-shell routing

### State Pattern
Config screens (PlayerConfig, GameConfig, SubConfig) follow a consistent pattern: load from localStorage via `getConfig`, hold local state, track `hasChanged`, then `saveConfig` on explicit save. The Game screen reads configs with `useMemo` on mount and manages runtime state (clock, subs, player order) separately.

### Substitution Model
Players are stored as an ordered array. The first `numPlayersOn` are on-field, the rest are on the bench. Subs reorder this array. Each sub is logged with `{ on, off, clockTime, numChanges }`. Sub timing is calculated from game/sub config and compared against clock time with a threshold (`SUB_TIME_THRESHOLD = 30s`).
