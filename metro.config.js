const { getDefaultConfig } = require('@expo/metro-config');
module.exports = (async () => {
    const {
      resolver: { sourceExts, assetExts }
    } = await getDefaultConfig(__dirname)
    return {
      transformer: {
        defaultConfig: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: false
          }
        })
      },
      resolver: {
        sourceExts,
        assetExts: [...assetExts, 'fcscript']
      }
    }
  })()

  module.exports = {
    resolver: {
      sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
      assetExts: ['glb', 'png', 'jpg', 'svg', 'ttf', 'obj', 'mtl', 'gltf','xpng', 'xjpg', 'xjpeg', 'html', 'fcscript'],
    },
  }