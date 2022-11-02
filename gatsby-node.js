const { generateOgImages } = require("./src/generator");
const { config } = require("./src/config");

exports.onPostBuild = async () => {
  const currentConfig = config.getConfig();
  await generateOgImages(currentConfig);
};
