import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const URL = process.env.CAP_URL || "https://flow-x-website-main.vercel.app/";
const OUT = path.resolve("website-capture");
fs.mkdirSync(OUT, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function readSections(page) {
  return page.evaluate(() => {
    const secs = Array.from(document.querySelectorAll("main > section"));
    const list = secs.map((s, i) => ({ i, id: s.id || "", top: s.offsetTop, h: s.offsetHeight }));
    const f = document.querySelector("footer");
    const footer = f ? { top: f.offsetTop, h: f.offsetHeight } : null;
    return {
      list,
      footer,
      vh: window.innerHeight,
      docH: document.documentElement.scrollHeight,
    };
  });
}

async function shoot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log("  saved", name);
}

async function run() {
  const browser = await chromium.launch();

  // ---------------- DESKTOP (reduced-motion → Lenis off, content settled) -----
  console.log("DESKTOP");
  const dctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const dp = await dctx.newPage();
  await dp.goto(URL, { waitUntil: "networkidle" });
  // Disable content-visibility so section heights stay stable (no reflow while
  // scrolling) and our precomputed offsets remain accurate.
  await dp.addStyleTag({ content: ".cv-auto{content-visibility:visible !important;}" });
  await wait(3500);

  const d = await readSections(dp);
  console.log(JSON.stringify(d.list));
  const vh = d.vh;
  const maxY = Math.max(0, d.docH - vh);
  const clampY = (y) => Math.min(maxY, Math.max(0, Math.round(y)));
  const center = (s) => clampY(s.top + s.h / 2 - vh / 2);
  const goTo = async (y, ms = 1500) => {
    await dp.evaluate((yy) => window.scrollTo(0, yy), clampY(y));
    await wait(ms);
  };
  const S = Object.fromEntries(d.list.map((s) => [s.id || `idx${s.i}`, s]));
  const byIdx = d.list;

  await goTo(0, 2600);
  await shoot(dp, "01-hero");

  await goTo(byIdx[1].top + (byIdx[1].h - vh) * 0.5);
  await shoot(dp, "02-statement");

  await goTo(center(byIdx[2]));
  await shoot(dp, "03-split");

  await goTo(byIdx[3].top + (byIdx[3].h - vh) * 0.08, 1700);
  await shoot(dp, "04-flow-step1");

  await goTo(byIdx[3].top + (byIdx[3].h - vh) * 0.62, 1700);
  await shoot(dp, "05-flow-step3");

  await goTo(center(byIdx[4]));
  await shoot(dp, "06-stats");

  await goTo(center(byIdx[5]));
  await shoot(dp, "07-why");

  await goTo(center(byIdx[6]));
  await shoot(dp, "08-testimonials");

  await goTo(center(byIdx[7]));
  await shoot(dp, "09-education");

  await goTo(center(byIdx[8]));
  await shoot(dp, "10-finalcta");

  if (d.footer) {
    await goTo(d.footer.top + d.footer.h - vh);
    await shoot(dp, "11-footer");
  }

  await dctx.close();

  // ---------------- MOBILE (touch → Lenis off, animations live) ---------------
  console.log("MOBILE");
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mctx.newPage();
  await mp.goto(URL, { waitUntil: "networkidle" });
  await mp.addStyleTag({ content: ".cv-auto{content-visibility:visible !important;}" });
  await wait(3500);

  const m = await readSections(mp);
  const mvh = m.vh;
  const mMaxY = Math.max(0, m.docH - mvh);
  const mClamp = (y) => Math.min(mMaxY, Math.max(0, Math.round(y)));
  const mCenter = (s) => mClamp(s.top + s.h / 2 - mvh / 2);
  const mGo = async (y, ms = 1600) => {
    await mp.evaluate((yy) => window.scrollTo(0, yy), mClamp(y));
    await wait(ms);
  };
  const mi = m.list;

  await mGo(0, 3000);
  await shoot(mp, "m-01-hero");
  await mGo(mCenter(mi[1]), 1800);
  await shoot(mp, "m-02-statement");
  await mGo(mCenter(mi[2]));
  await shoot(mp, "m-03-split");
  await mGo(mi[3].top + (mi[3].h - mvh) * 0.12, 1800);
  await shoot(mp, "m-04-flow");
  await mGo(mCenter(mi[4]));
  await shoot(mp, "m-05-stats");
  await mGo(mCenter(mi[6]));
  await shoot(mp, "m-06-testimonials");

  await mctx.close();
  await browser.close();
  console.log("DONE →", OUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
