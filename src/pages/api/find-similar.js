// pages/api/find-similar.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import axios from 'axios';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { pool } from '../../../lib/db';

export const config = { api: { bodyParser: false } };

const {
  CV_ENDPOINT: ENDPOINT,
  CV_PRED_KEY: PREDICTION_KEY,
  CV_PROJECT_ID: PROJECT_ID,
  CV_ITERATION: ITERATION = 'prod',
  SEARCH_ENDPOINT,
  SEARCH_ADMIN_KEY,
} = process.env;

const INDEX_NAME = 'tote-catalog';

async function classify(buffer) {
  const url = `${ENDPOINT}/customvision/v3.1/Prediction/${PROJECT_ID}/classify/iterations/${ITERATION}/image`;
  const { data } = await axios.post(url, buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Prediction-Key': PREDICTION_KEY,
    },
  });
  return data.predictions
    .filter(p => p.probability > 0.1)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5)
    .map(p => p.tagName);
}

async function findSimilarIds(tags) {
  const client = new SearchClient(
    SEARCH_ENDPOINT,
    INDEX_NAME,
    new AzureKeyCredential(SEARCH_ADMIN_KEY)
  );
  const query = tags.map(t => `"${t}"`).join(' OR ');
  const results = await client.search(query, { top: 8 });
  // here we only pull out the .id field
  return Array.from(results.results).map(r => r.document.id);
}

// wrap formidable.parse in a promise
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  try {
    const { files } = await parseForm(req);
    const upload = files.file;
    if (!upload) {
      return res.status(400).json({ error: 'No file uploaded under "file"' });
    }
    // formidable might give you an array
    const fileObj = Array.isArray(upload) ? upload[0] : upload;
    const filepath = fileObj.filepath || fileObj.path;
    const buffer   = fs.readFileSync(filepath);

    const tags = await classify(buffer);
    console.log('Classification tags:', tags);

    // 1) get the array of ID strings from Azure Search
    const similarIds = await findSimilarIds(tags);

    // 2) fetch full records from Postgres
    //    assumes you have a table `products(id TEXT PRIMARY KEY, name TEXT, price NUMERIC, image_url TEXT, ...)`
const { rows } = await pool.query(
    `SELECT
      id,
      name,
      base_price    AS price,
      images[1]     AS image_url,   -- grab the first element of the array
      tags
    FROM products
    WHERE id = ANY($1)`,
  [similarIds]
);

    // 3) re‑order the rows to match the similarity ranking
    const byId = Object.fromEntries(rows.map(r => [r.id, r]));
    const enriched = similarIds
      .map(id => byId[id])
      .filter(Boolean);

    return res.status(200).json({ similar: enriched });
  } catch (error) {
    console.error('find-similar error:', error);
    return res.status(500).json({ error: error.message });
  }
}
