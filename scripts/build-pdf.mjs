import { chromium } from "playwright";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const ROOT = path.resolve(".");
const CAP = path.join(ROOT, "website-capture");
const img = (name) => pathToFileURL(path.join(CAP, `${name}.png`)).href;

const GREEN = "#4dffa0";

const sections = [
  {
    num: "01",
    kicker: "Hero",
    title: "Stop trading in silence",
    img: "01-hero",
    body: "A cinematic opening built in WebGL: a cluster of chrome BTC, ETH and LTC coins erupts from below across a dark, film-grain stage lit with neon-green bloom.",
    points: [
      "React Three Fiber scene with HDRI reflections + bloom",
      "Scroll-driven camera dolly and coin choreography",
      "Headline, subcopy and Join / Explore calls to action",
    ],
  },
  {
    num: "02",
    kicker: "All in one place",
    title: "Every market, mapped",
    img: "02-statement",
    body: "A kinetic statement section that swaps a single word as you scroll - community, signals, execution - landing on one idea: it is all mapped in one place.",
    points: [
      "Large display typography on a clean light surface",
      "Scroll-linked word swap with a drifting backdrop wordmark",
      "Bridges the dark hero into the product story",
    ],
  },
  {
    num: "03",
    kicker: "The problem",
    title: "Most traders still operate alone",
    img: "03-split",
    body: "A split layout pairs a live trading-room UI mock with the core problem: without a live room and shared intelligence, traders guess in isolation.",
    points: [
      "Product mock with live order-flow and watchlist",
      "Reveal-on-scroll image with staggered copy",
      "Sets up ScalpX as the answer",
    ],
  },
  {
    num: "04",
    kicker: "How it works",
    title: "A guided, scroll-pinned flow",
    img: "04-flow-step1",
    body: "A pinned, MetaMask-style sequence walks through the journey step by step, cross-fading panels and visuals as the user scrolls.",
    points: [
      "Imperative scroll engine (rAF) for buttery transitions",
      "Ghost step numbers, staggered bullets, progress rail",
      "No per-frame React re-renders - smooth on every device",
    ],
  },
  {
    num: "05",
    kicker: "How it works",
    title: "Learn the skill behind the setup",
    img: "05-flow-step3",
    body: "Later steps in the same pinned flow shift from access to mastery - showing how members are taught structure, execution and risk.",
    points: [
      "Each step swaps both copy and supporting visual",
      "Clickable progress rail to jump between steps",
      "Subtle parallax and scale for depth",
    ],
  },
  {
    num: "06",
    kicker: "Community momentum",
    title: "A community with real momentum",
    img: "06-stats",
    body: "Animated count-up metrics quantify the community next to a performance dashboard mock - members, VIPs and daily activity.",
    points: [
      "Numbers count up when scrolled into view",
      "2 x 3 stat grid that reflows cleanly on mobile",
      "Paired with a multi-card analytics visual",
    ],
  },
  {
    num: "07",
    kicker: "Why ScalpX",
    title: "Not another signal group",
    img: "07-why",
    body: "A feature grid frames ScalpX as a full trading ecosystem rather than a signal feed: live trading, trader corners, education and more.",
    points: [
      "Cards animate in with a 3D tilt-up, staggered",
      "Live trading, education, profit showcase, community",
      "Positions the platform end to end",
    ],
  },
  {
    num: "08",
    kicker: "Testimonials",
    title: "Built on trust and results",
    img: "08-testimonials",
    body: "Community proof presented as an auto-scrolling marquee of member quotes that glides continuously and pauses on hover.",
    points: [
      "Seamless looping marquee of testimonial cards",
      "Pause-on-hover for readability",
      "Reinforces credibility before the CTA",
    ],
  },
  {
    num: "09",
    kicker: "Education",
    title: "Learn the skill behind the setup",
    img: "09-education",
    body: "Education is positioned as the core value: a set of topic chips covers structure, liquidity, order flow, risk and more.",
    points: [
      "Springy pop-in chips with a de-blur effect",
      "Market structure, VWAP, order flow, risk, journaling",
      "Frames ScalpX as a place to get sharper over time",
    ],
  },
  {
    num: "10",
    kicker: "Final CTA",
    title: "Join the movement",
    img: "10-finalcta",
    body: "A focused closing call to action over a pulsing radial glow drives sign-ups before the footer.",
    points: [
      "Pulsing brand glow behind the headline",
      "Primary and secondary calls to action",
      "Clean footer with wordmark and navigation",
    ],
  },
];

const mobileShots = [
  ["m-01-hero", "Hero"],
  ["m-02-statement", "All in one place"],
  ["m-03-split", "The problem"],
  ["m-04-flow", "How it works"],
  ["m-05-stats", "Momentum"],
  ["m-06-testimonials", "Testimonials"],
];

const css = `
:root{ --bg:#05070d; --panel:#0b0f17; --line:rgba(255,255,255,.09); --green:${GREEN}; --text:#eef2f7; --muted:#9aa4b2; }
*{ margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
@page{ size:A4 landscape; margin:0; }
html,body{ font-family:'Inter',system-ui,Arial,sans-serif; color:var(--text); background:var(--bg); }
.page{ position:relative; width:297mm; height:210mm; overflow:hidden; background:var(--bg); page-break-after:always; }
.page:last-child{ page-break-after:auto; }
.glow{ position:absolute; border-radius:50%; filter:blur(70px); opacity:.5; }

/* COVER */
.cover{ display:flex; flex-direction:column; justify-content:center; padding:0 26mm; background:
  radial-gradient(60% 70% at 78% 18%, rgba(77,255,160,.16), transparent 60%),
  radial-gradient(50% 60% at 12% 96%, rgba(77,255,160,.10), transparent 60%), var(--bg); }
.cover .wm{ font-weight:800; letter-spacing:.06em; font-size:20pt; }
.cover .wm b{ color:var(--green); }
.cover h1{ font-size:58pt; font-weight:800; line-height:1.02; letter-spacing:-.02em; margin-top:18mm; }
.cover h1 .g{ color:var(--green); }
.cover p{ margin-top:8mm; color:var(--muted); font-size:14pt; max-width:170mm; line-height:1.5; }
.cover .meta{ position:absolute; left:26mm; bottom:18mm; display:flex; gap:18mm; color:var(--muted); font-size:10.5pt; }
.cover .meta b{ color:var(--text); display:block; font-weight:600; font-size:11pt; margin-bottom:2mm; }
.scrolltag{ position:absolute; right:26mm; bottom:18mm; font-size:9pt; letter-spacing:.35em; color:var(--green); }

/* OVERVIEW */
.ov{ padding:20mm 26mm; }
.ov h2{ font-size:30pt; font-weight:800; letter-spacing:-.01em; }
.ov .lead{ color:var(--muted); font-size:12.5pt; line-height:1.55; max-width:200mm; margin-top:6mm; }
.cols{ display:flex; gap:14mm; margin-top:12mm; }
.col{ flex:1; }
.col h3{ font-size:10pt; letter-spacing:.2em; text-transform:uppercase; color:var(--green); margin-bottom:5mm; }
.col ul{ list-style:none; }
.col li{ font-size:11pt; color:var(--text); padding:2.6mm 0; border-bottom:1px solid var(--line); display:flex; gap:3mm; }
.col li::before{ content:""; width:6px; height:6px; border-radius:2px; background:var(--green); margin-top:6px; flex:0 0 auto; }
.col li span{ color:var(--muted); }

/* SECTION */
.section{ display:flex; }
.shot{ flex:0 0 60%; padding:16mm 8mm 16mm 18mm; display:flex; align-items:center; }
.frame{ width:100%; border:1px solid var(--line); border-radius:10px; overflow:hidden; box-shadow:0 30px 60px rgba(0,0,0,.5); background:#000; }
.frame img{ width:100%; display:block; }
.meta2{ flex:1; padding:24mm 18mm 16mm 6mm; display:flex; flex-direction:column; justify-content:center; }
.meta2 .n{ font-size:46pt; font-weight:800; color:rgba(255,255,255,.10); line-height:1; }
.meta2 .k{ margin-top:4mm; font-size:9.5pt; letter-spacing:.28em; text-transform:uppercase; color:var(--green); }
.meta2 h2{ margin-top:4mm; font-size:24pt; font-weight:800; letter-spacing:-.01em; line-height:1.08; }
.meta2 .b{ margin-top:6mm; color:var(--muted); font-size:11pt; line-height:1.55; }
.meta2 ul{ list-style:none; margin-top:7mm; }
.meta2 li{ font-size:10.5pt; padding:2.4mm 0; display:flex; gap:3mm; }
.meta2 li::before{ content:""; width:6px; height:6px; border-radius:2px; background:var(--green); margin-top:5px; flex:0 0 auto; }

/* MOBILE */
.mob{ padding:18mm 22mm; }
.mob h2{ font-size:26pt; font-weight:800; }
.mob p{ color:var(--muted); font-size:11.5pt; margin-top:4mm; }
.phones{ display:flex; gap:9mm; margin-top:12mm; justify-content:space-between; }
.phone{ flex:1; text-align:center; }
.phone .pf{ border:1px solid var(--line); border-radius:14px; overflow:hidden; background:#000; box-shadow:0 18px 40px rgba(0,0,0,.5); }
.phone img{ width:100%; display:block; }
.phone .cap{ margin-top:4mm; font-size:8.5pt; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }

/* CLOSE */
.close{ display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:0 30mm; background:
  radial-gradient(60% 80% at 50% 30%, rgba(77,255,160,.16), transparent 60%), var(--bg); }
.close h2{ font-size:40pt; font-weight:800; letter-spacing:-.02em; }
.close h2 .g{ color:var(--green); }
.close p{ margin-top:7mm; color:var(--muted); font-size:12.5pt; max-width:170mm; line-height:1.55; }
.close .url{ margin-top:10mm; font-size:12pt; color:var(--green); letter-spacing:.04em; }

.pfoot{ position:absolute; left:18mm; right:18mm; bottom:9mm; display:flex; justify-content:space-between; font-size:8.5pt; color:rgba(255,255,255,.35); letter-spacing:.06em; }
`;

const sectionPage = (s, i) => `
<section class="page section">
  <div class="glow" style="width:320px;height:320px;background:${GREEN};top:-90px;right:-60px"></div>
  <div class="shot"><div class="frame"><img src="${img(s.img)}"></div></div>
  <div class="meta2">
    <div class="n">${s.num}</div>
    <div class="k">${s.kicker}</div>
    <h2>${s.title}</h2>
    <div class="b">${s.body}</div>
    <ul>${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
  </div>
  <div class="pfoot"><span>SCALPX &middot; Website Overview</span><span>${String(i + 3).padStart(2, "0")}</span></div>
</section>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${css}</style></head><body>

<section class="page cover">
  <div class="glow" style="width:520px;height:520px;background:${GREEN};top:-140px;right:-120px;opacity:.35"></div>
  <div class="wm">SCALP<b>X</b></div>
  <h1>Stop trading<br>in <span class="g">silence</span>.</h1>
  <p>A cinematic, scroll-driven website for a crypto scalping community - 3D WebGL hero, kinetic storytelling and a live-room product narrative, end to end.</p>
  <div class="meta">
    <div><b>Document</b>Website overview &amp; design reference</div>
    <div><b>Sections</b>10 screens &middot; desktop + mobile</div>
    <div><b>Live</b>flow-x-website-main.vercel.app</div>
  </div>
  <div class="scrolltag">- SCROLL -</div>
</section>

<section class="page ov">
  <h2>The website at a glance</h2>
  <div class="lead">ScalpX is a single-page experience that turns a crypto trading community into a premium product story. It opens on a 3D chrome-coin hero, then guides visitors through the problem, the platform, the proof and the call to action - each section animated as it enters the viewport, while staying fast on phones.</div>
  <div class="cols">
    <div class="col">
      <h3>Built with</h3>
      <ul>
        <li>Next.js (App Router) + React 19</li>
        <li>React Three Fiber, drei &amp; postprocessing<span></span></li>
        <li>Three.js - chrome coins, HDRI, bloom</li>
        <li>Framer Motion - scroll &amp; reveals</li>
        <li>Tailwind CSS v4 design tokens</li>
        <li>Lenis smooth scrolling</li>
      </ul>
    </div>
    <div class="col">
      <h3>Experience highlights</h3>
      <ul>
        <li>Scroll-driven 3D hero with camera dolly</li>
        <li>Pinned, cross-fading "how it works" flow</li>
        <li>Count-up stats &amp; tilt-in feature cards</li>
        <li>Auto-scrolling testimonial marquee</li>
        <li>Springy education chips &amp; glowing CTA</li>
      </ul>
    </div>
    <div class="col">
      <h3>Engineered for speed</h3>
      <ul>
        <li>WebGL canvas pauses when off-screen</li>
        <li>content-visibility on heavy sections</li>
        <li>IntersectionObserver-gated animations</li>
        <li>Shared geometries &amp; capped DPR</li>
        <li>Reduced-motion fallbacks throughout</li>
      </ul>
    </div>
  </div>
  <div class="pfoot"><span>SCALPX &middot; Website Overview</span><span>02</span></div>
</section>

${sections.map(sectionPage).join("")}

<section class="page mob">
  <div class="glow" style="width:360px;height:360px;background:${GREEN};bottom:-120px;left:-80px;opacity:.28"></div>
  <h2>Designed for mobile, too</h2>
  <p>Every section is re-laid out for portrait screens - the hero coins shrink into a gentle floating field, stats become a tidy grid, and the long-form flow stays smooth.</p>
  <div class="phones">
    ${mobileShots.map(([k, cap]) => `<div class="phone"><div class="pf"><img src="${img(k)}"></div><div class="cap">${cap}</div></div>`).join("")}
  </div>
  <div class="pfoot"><span>SCALPX &middot; Website Overview</span><span>13</span></div>
</section>

<section class="page close">
  <div class="wm" style="position:absolute;top:18mm;left:26mm;font-weight:800;letter-spacing:.06em;font-size:16pt">SCALP<b style="color:${GREEN}">X</b></div>
  <h2>Join the movement<br>before it goes <span class="g">global</span>.</h2>
  <p>Millisecond signal, live order-flow and execution built for scalpers - wrapped in a site that feels as fast as the trades.</p>
  <div class="url">flow-x-website-main.vercel.app</div>
</section>

</body></html>`;

const htmlPath = path.join(CAP, "_overview.html");
fs.writeFileSync(htmlPath, html, "utf8");

const out = path.join(ROOT, "ScalpX-Website-Overview.pdf");
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  try { await document.fonts.ready; } catch (e) {}
});
await new Promise((r) => setTimeout(r, 800));
await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("PDF →", out);
