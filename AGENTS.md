This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Project conventions

- **Language:** file names, identifiers, types, route names and enum/string keys in **English**. Code **comments and docs in Spanish**. User-facing UI text stays in Spanish.
- **Architecture:** feature-first, see `ARCHITECTURE.md`. `src/app/` holds only thin routes; logic lives in `src/features/<feature>/{components,hooks,lib}`; shared tokens in `src/shared/`. A feature must not import from another feature; `lib/` must not import React.
- **Verify before finishing:** `npx tsc --noEmit` and `npx expo lint` (both must exit 0).
- **3D model:** `assets/models/tshirt.glb` is optimized (~65k triangles) and must NOT use Draco or mesh quantization (the measurement code reads raw Float32 positions). Positions arrive interleaved with normals; `analyzeShirt` flattens them.
- **Formatting:** a hook runs Prettier after every Edit/Write (`.claude/hooks/format.js`).

## Auto-routing (use without being asked, keep tokens low)

- New screen/tab/feature -> skill `new-feature`. Heavy/slow `.glb` -> skill `optimize-glb`.
- Know the layout from `ARCHITECTURE.md`; open only the file you will change (Grep first, then Read with offset/limit).
- Edit with small diffs; do not re-read files you just wrote; run `tsc` + `lint` once at the end.
- No subagents for tasks in a single feature; only for broad searches across many files.

## Quick map (so you don't need to open ARCHITECTURE.md)

All paths under `src/features/design/`: `DesignScreen.tsx` (screen state) · `constants.ts` (limits, colors, fabric options, model) · `types.ts` · `components/` ShirtCanvas (lights, Canvas, loading) · ShirtModel (3D mesh) · FabricPanel · MeasurementsPanel · LightToggle · `hooks/` useMeasurements · useOrbitGestures · useCanvasLifecycle · `lib/` shirt-geometry (measure deformation) · fabric-textures · materials · measurements (validation). Routes: `src/app/(tabs)/{index,design}.tsx`, tabs in `(tabs)/_layout.tsx`. Theme: `src/shared/theme.ts`.
