const fs = require("fs/promises");
const path = require("path");
const http = require("http");
const puppeteer = require("puppeteer");
const express = require("express");

exports.generateOgImages = async (config) => {
  const { size, outputDir } = config;
  const rootDir = `public/${outputDir}`

  const servingUrl = await getServingUrl(rootDir);
  const componentPaths = await getComponentPaths(rootDir);

  const browser = await puppeteer.launch({})
  const page = await browser.newPage();

  for (const path of componentPaths) {
    await page.setViewport(size);
    await page.goto(`${servingUrl}/${rootDir}/${path}`, {
      waitUntil: "networkidle0",
      timeout: 60000
    });

    const imageDiv = await page.$$("div.default-og-image.d-flex.align-items-center.justify-content-center.flex-column")

    for (const div of imageDiv) {
      await page.evaluate((el) => el.querySelector('.og-img').setAttribute("src", `/og.jpg`), div);
    }

    await page.screenshot({
      path: `${rootDir}/${path}.png`,
      clip: { x: 0, y: 0, ...size },
      printBackground: true,
      type: "png",
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

  app.get(`/og.jpg`, async (req, res) => {
    const file = path.join(__dirname, "og.jpg");
    res.sendFile(file);
  });

  const server = http.createServer(app);
  await server.listen(0);

  return `http://localhost:${server.address().port}`;
};

const getComponentPaths = async (dir) => {
  const items = await fs.readdir(`${path.resolve("./")}/${dir}`, { withFileTypes: true });
  return items.reduce((paths, item) => {
    if (item.isDirectory()) {
      paths.push(item.name);
    }
    return paths;
  }, []);
};