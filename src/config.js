exports.config = (() => {
  const defaultConfig = {
    size: {
      width: 1200,
      height: 520,
    },
    outputDir: "__og-image",
  };

  let currentConfig = {};

  return {
    init: (config) => {
      currentConfig = {
        size: config.size ?? defaultConfig.size,
        outputDir: config.outputDir ?? defaultConfig.outputDir,
      };
    },
    getConfig: () => {
      return currentConfig;
    },
  };
})();
