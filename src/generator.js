const fs = require("fs/promises");
const path = require("path");
const http = require("http");
const puppeteer = require("puppeteer");
const express = require("express");

exports.generateOgImages = async (config) => {
  const { size, outputDir } = config;
  const rootDir = path.join("public", outputDir);

  const servingUrl = await getServingUrl(rootDir);
  const componentPaths = await getComponentPaths(rootDir);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const path of componentPaths) {
    await page.setViewport(size);
    await page.goto(`${servingUrl}/${rootDir}/${path}`, {
      waitUntil: "networkidle2",
    });
    await page.screenshot({
      path: `${rootDir}/${path}.png`,
      clip: { x: 0, y: 0, ...size },
    });

    console.log(`🖼 Created image at ${rootDir}/${path}.png`);
  }

  await browser.close();
};

const getServingUrl = async (dir) => {
  const app = express();

  app.get(`/${dir}/:id`, async (req, res) => {
    const file = path.join(`${path.resolve("./")}/${dir}`, req.params.id, "index.html");
    res.sendFile(file);
  });

  const server = http.createServer(app);
  await server.listen(0);

  return `http://0.0.0.0:${server.address().port}`;
};

const getComponentPaths = async (dir) => {
  const items = await fs.readdir(`${path.resolve("./")}/${dir}`, { withFileTypes: true });
  return items.filter((item) => item.isDirectory()).map(item => item.name);
};
