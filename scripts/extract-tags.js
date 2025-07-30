require("dotenv").config();
//testing
console.log("CV_ENDPOINT =", process.env.CV_ENDPOINT);
console.log("CV_PRED_KEY =", Boolean(process.env.CV_PRED_KEY));

const fs    = require("fs");
const path  = require("path");
const axios = require("axios");

const ENDPOINT      = process.env.CV_ENDPOINT;      // e.g. https://…cognitiveservices.azure.com
const PREDICTION_KEY = process.env.CV_PRED_KEY;     // Prediction‑key
const PROJECT_ID    = "5521962d-3bf2-43e3-b204-491685f5b6b3";
const ITERATION     = "prod";

async function classify(buffer) {
  const url = `${ENDPOINT}/customvision/v3.1/Prediction/${PROJECT_ID}/classify/iterations/${ITERATION}/image`;
  const { data } = await axios.post(url, buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Prediction-Key": PREDICTION_KEY
    }
  });
  return data.predictions
    .filter(p => p.probability > 0.1)
    .sort((a,b)=> b.probability - a.probability)
    .slice(0,5)
    .map(p=> p.tagName);
}

async function run() {
  const dir = path.join(__dirname, "../public/catalog-images");
  const out = [];

  for (const file of fs.readdirSync(dir)) {
    const buffer = fs.readFileSync(path.join(dir, file));
    const tags   = await classify(buffer);
    const baseName = path.parse(file).name;
    out.push({ id: baseName, name: file, tags });
    console.log(`✅ ${file}:`, tags);
  }

  fs.writeFileSync("catalog.json", JSON.stringify(out, null,2));
  console.log("✅ catalog.json generated");
}

run().catch(err => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
