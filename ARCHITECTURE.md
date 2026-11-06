# Arquitectura

App Expo (React Native) con Expo Router. Organización **por funcionalidad** (feature-first):
las rutas son delgadas y la lógica vive en `src/features/<feature>/`.

```
src/
├─ app/                      # SOLO rutas (Expo Router). Cada archivo exporta una pantalla.
│  ├─ _layout.tsx            #   Stack raíz
│  └─ (tabs)/
│     ├─ _layout.tsx         #   Barra superior (header) + barra inferior (tabs)
│     ├─ index.tsx           #   Inicio  -> features/home
│     └─ design.tsx          #   Diseño  -> features/design
├─ features/
│  ├─ home/
│  │  └─ HomeScreen.tsx
│  └─ design/                # Editor 3D del polo
│     ├─ DesignScreen.tsx    #   Une estado + componentes (la "pantalla")
│     ├─ constants.ts        #   Modelo, límites de medidas, colores y diseños de tela
│     ├─ types.ts            #   Tipos compartidos de la feature
│     ├─ components/         #   UI (ShirtCanvas, ShirtModel, FabricPanel, MeasurementsPanel, LightToggle)
│     ├─ hooks/              #   Lógica con estado (useMeasurements, useOrbitGestures, useCanvasLifecycle)
│     └─ lib/                #   Funciones puras, sin React (geometría, texturas, materiales, validación)
└─ shared/
   └─ theme.ts               # Colores/valores visuales usados por todas las features
assets/models/tshirt.glb     # Modelo 3D optimizado (~65k triángulos, sin Draco/cuantización)
```

## Reglas

1. **`app/` no tiene lógica**: solo importa una pantalla de `features/` y la exporta.
2. **Una feature no importa de otra**. Lo compartido va en `shared/`.
3. **Dependencias en un solo sentido**: `components` -> `hooks` -> `lib` -> `constants/types`.
   `lib/` no importa React ni React Native.
4. **Constantes y tipos en un solo lugar** (`constants.ts`, `types.ts`): límites, colores y
   opciones se cambian ahí, no dentro de los componentes.
5. Los estilos usan los tokens de `shared/theme.ts`.

## Flujo del editor de diseño

`DesignScreen` (estado: tela, luz) + `useMeasurements` (medidas) -> `ShirtCanvas`
(Canvas, luces, gestos, loading) -> `ShirtModel` (carga el .glb, aplica tela con `lib/materials`
y medidas con `lib/shirt-geometry`).

- Los gestos (`useOrbitGestures`) y las medidas válidas (`target`) viven en **refs**: el
  Canvas los lee en cada frame sin re-renderizar React.
- `useCanvasLifecycle` recrea el Canvas al volver a la pestaña (Android pierde el contexto GL).

## Cómo agregar algo

- **Nueva pantalla/pestaña**: crear `features/<nombre>/<Nombre>Screen.tsx`, agregar
  `app/(tabs)/<ruta>.tsx` que la exporte y registrar la pestaña en `app/(tabs)/_layout.tsx`.
- **Nuevo diseño o color de tela**: `FABRIC_DESIGNS` / `FABRIC_COLORS` en `design/constants.ts`
  (un diseño nuevo también necesita su caso en `lib/fabric-textures.ts`).
- **Nueva medida**: agregar la clave en `types.ts`, `constants.ts` (campo y máximo) y su
  deformación en `lib/shirt-geometry.ts`.
- **Cambiar el modelo**: reemplazar `assets/models/tshirt.glb` (idealmente < 100k triángulos).

## Comandos

```
npx expo start -c   # ejecutar (escanear el QR con Expo Go)
npx tsc --noEmit    # tipos
npx expo lint       # lint
```
