import pngToIco from "png-to-ico";
import { writeFileSync } from "node:fs";

const out = "public/favicon.ico";
const inputs = ["public/favicon-16.png", "public/favicon-32.png", "_favicon-48.png"];

const buf = await pngToIco(inputs);
writeFileSync(out, buf);
console.log(`Wrote ${out} (${buf.length} bytes) from ${inputs.join(", ")}`);
