import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.CAP_URL ?? "https://flow-x-website-main.vercel.app/";
mkdirSync("coins", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
});

await page.goto(URL, { waitUntil: "networkidle" });
// Hide DOM overlays (nav + hero copy + scrims) so only the WebGL scene shows.
await page.addStyleTag({
  content: `
    nav, header, .ch-nav, [class*="HeroContent"], [class*="hero-content"],
    .ch-intro, .ch-info, .ch-scrim, .ch-grain { opacity: 0 !important; }
  `,
});
await page.waitForTimeout(4500); // let coins erupt / settle

async function shot(name) {
  await page.screenshot({ path: `coins/${name}-full.png` });
  const canvas = page.locator("canvas").first();
  if (await canvas.count()) {
    await canvas.screenshot({ path: `coins/${name}-canvas.png`, omitBackground: true });
  }
}

await shot("a");
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.55));
await page.waitForTimeout(3000);
await shot("b");
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.15));
await page.waitForTimeout(3000);
await shot("c");

await browser.close();
console.log("captured coins/ frames");
