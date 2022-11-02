exports.config = (() => {
  const defaultConfig = {
    size: {
      width: 1200,
      height: 630,
    },
    waitCondition: "networkidle2",
    componentGenerationDir: "__og-image",
  };

  let currentConfig = {};

  return {
    init: (config) => {
      currentConfig = {
        size: config.size ?? defaultConfig.size,
        waitCondition: config.waitCondition ?? defaultConfig.waitCondition,
        componentGenerationDir: config.componentGenerationDir ?? defaultConfig.componentGenerationDir,
      };
    },
    getConfig: () => {
      return currentConfig;
    },
  };
})();
