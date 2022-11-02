const { join } = require("path");
const { config } = require("./src/config");

exports.createOpenGraphImage = (createPage, options) => {
  config.init(options);

  const { size, componentGenerationDir } = config.getConfig();
  const { component, context } = options;

  const componentPath = `${componentGenerationDir}/${context.id}`;
  const imagePath = join("public", componentGenerationDir, `${context.id}.png`);

  const ogImageMetadata = { componentPath, imagePath, size };

  createPage({
    path: componentPath,
    component,
    context: {
      ...context,
      ogImage: ogImageMetadata,
    },
  });

  return ogImageMetadata;
};
