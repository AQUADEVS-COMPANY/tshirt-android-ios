const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');

// three.cjs llama a process.emitWarning (no existe en React Native).
// Forzamos el build ESM de three, que no lo usa.
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules/three/build/three.module.js'),
    };
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
