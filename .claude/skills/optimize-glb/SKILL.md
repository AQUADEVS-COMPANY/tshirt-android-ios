---
name: optimize-glb
description: Use when the user adds, replaces or complains about a heavy/slow 3D model (.glb) in assets/models, or the app lags or crashes loading it. Reduces triangles to ~65k in a way compatible with this project's measurement code.
---

# Optimize a .glb for this app

Constraints (the measurement code in `src/features/design/lib/shirt-geometry.ts` depends on them):
no Draco, no meshopt/quantization (positions must stay Float32), keep NORMAL. Target 50k-100k triangles.

Steps (keep output short):
1. Back up the original OUTSIDE the project (never inside `assets/`).
2. Work in a scratch dir (not the project): `npm i @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions meshoptimizer`.
3. Copy `optimize.mjs` next to the original named `original-heavy.glb` and run
   `node optimize.mjs <ratio> out.glb` (ratio 0.08 turned 822k tris into ~65k). It removes
   animations and tangents, welds and simplifies.
4. Check the result: attributes include POSITION+NORMAL, bbox ~ the original, size < 3 MB.
5. Copy to `assets/models/tshirt.glb`, then run `npx tsc --noEmit`.
Report only: before/after size and triangles.
