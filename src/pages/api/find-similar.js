import { IncomingForm } from 'formidable';
import fs from 'fs';
import axios from 'axios';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure these env vars are set in your .env file:
// CV_ENDPOINT, CV_PRED_KEY, CV_PROJECT_ID, CV_ITERATION (optional)
// SEARCH_ENDPOINT, SEARCH_ADMIN_KEY

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

async function findSimilar(tags) {
  const client = new SearchClient(
    SEARCH_ENDPOINT,
    INDEX_NAME,
    new AzureKeyCredential(SEARCH_ADMIN_KEY)
  );
  const query = tags.map(t => `"${t}"`).join(' OR ');
  const results = await client.search(query, { top: 8 });
  return Array.from(results.results).map(r => r.document);
}

// Promisified form parsing
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
      return res.status(400).json({ error: 'No file uploaded under "file" field' });
    }
    const fileObj = Array.isArray(upload) ? upload[0] : upload;
    const filepath = fileObj.filepath || fileObj.path;
    if (!filepath) {
      return res.status(400).json({ error: 'File path not found on uploaded file' });
    }
    const buffer = fs.readFileSync(filepath);
    const tags = await classify(buffer);
    console.log('Classification tags:', tags);
    const similar = await findSimilar(tags);
    return res.status(200).json({ similar });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
