const { config } = require("./src/config");

exports.createOpenGraphImage = (createPage, options) => {
  config.init(options);

  const { size, outputDir } = config.getConfig();
  const { component, context } = options;

  const componentPath = `${outputDir}/${context.id}`;
  const imagePath = `${outputDir}/${context.id}.png`;

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
