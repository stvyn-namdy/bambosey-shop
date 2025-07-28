require('dotenv').config();
const path = require('path');
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const catalog = require('../catalog.json');

// Environment variables
const SEARCH_ENDPOINT   = process.env.SEARCH_ENDPOINT;
const SEARCH_ADMIN_KEY  = process.env.SEARCH_ADMIN_KEY;
const INDEX_NAME        = 'tote-catalog';

async function run() {
  // Initialize the Search client
  const client = new SearchClient(
    SEARCH_ENDPOINT,
    INDEX_NAME,
    new AzureKeyCredential(SEARCH_ADMIN_KEY)
  );

  // Sanitize document keys by removing file extensions
  const safeDocs = catalog.map(doc => ({
    ...doc,
    id: path.parse(doc.id).name
  }));

  // Upload documents to Azure Cognitive Search
  const result = await client.uploadDocuments(safeDocs);
  console.log('✅ Indexed:', result);
}

run().catch(err => {
  console.error('❌ Indexing failed:', err);
  process.exit(1);
});
