import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, prune, dedup } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
const target = Number(process.argv[2]); // ratio
const out = process.argv[3];
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read('original-heavy.glb');
const root = doc.getRoot();
// sin animaciones
root.listAnimations().forEach(a => a.dispose());
// quitar tangentes (no se usan)
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) { const t = p.getAttribute('TANGENT'); if (t) { p.setAttribute('TANGENT', null); } }
await doc.transform(
  weld({ tolerance: 0.0001 }),
  simplify({ simplifier: MeshoptSimplifier, ratio: target, error: 0.01, lockBorder: false }),
  prune(), dedup()
);
await io.write(out, doc);
const m = root.listMeshes()[0].listPrimitives()[0];
console.log(out, 'verts', m.getAttribute('POSITION').getCount(), 'tris', m.getIndices().getCount()/3);
