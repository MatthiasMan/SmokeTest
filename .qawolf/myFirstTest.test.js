const qawolf = require("qawolf");

let browser;
let context;

beforeAll(async () => {
  browser = await qawolf.launch();
  context = await browser.newContext();
  await qawolf.register(context);
});

afterAll(async () => {
  await qawolf.stopVideos();
  await browser.close();
});

test("myFirstTest", async () => {
  const page = await context.newPage();
  await page.goto("https://matthiasman.github.io/SmokeTest/GameOfLife/dest_Build/html/index.html", { waitUntil: "domcontentloaded" });
  await page.click("#rowInput");
  await page.fill("#rowInput", "30");
  await page.click("#colInput");
  await page.fill("#colInput", "50");
  await page.click("#setSizeButton");
  await qawolf.scroll(page, "html", { x: 0, y: 672 });
  await page.click("#randomButton");
  await page.click("#runButton");
  await page.click("#pauseButton");
  await page.click("#clearButton");
  await qawolf.scroll(page, "html", { x: 0, y: 0 });
});