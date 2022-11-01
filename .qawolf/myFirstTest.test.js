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
  await page.goto("http://localhost:4200/", { waitUntil: "domcontentloaded" });
  await page.click('text="CLI Documentation"');
  await page.click(".material-icons");
  await qawolf.scroll(page, "html", { x: 0, y: 124 });
  await page.click("button:nth-of-type(2)");
  await page.click('text="New Component"');
  await page.click('text="Run and Watch Tests"');
  await page.click('text="Add Dependency"');
});