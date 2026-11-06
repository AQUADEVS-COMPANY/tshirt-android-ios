---
name: new-feature
description: Use when the user asks to add a new screen, tab, section or feature to the app. Applies the project's feature-first architecture so no extra exploration is needed.
---

# Add a feature (follow ARCHITECTURE.md, do not re-explore the repo)

1. Create `src/features/<name>/<Name>Screen.tsx` (+ `components/`, `hooks/`, `lib/`, `constants.ts`, `types.ts` only as needed).
2. Create the route `src/app/(tabs)/<route>.tsx`: two lines, `import { XScreen } ...; export default XScreen;`.
3. Register the tab in `src/app/(tabs)/_layout.tsx` (`Tabs.Screen` + Ionicons icon, Spanish title).
4. Use tokens from `src/shared/theme.ts`; never import from another feature.
5. Conventions: names/identifiers in English, comments in Spanish, UI text in Spanish.
6. Verify with `npx tsc --noEmit` and `npx expo lint`.
