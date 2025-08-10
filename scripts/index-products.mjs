#!/usr/bin/env node
import 'dotenv/config';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import pkg from 'pg';
const { Client: PgClient } = pkg;

async function main() {
  // 1) Fetch products from Postgres
  const pg = new PgClient({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  const { rows } = await pg.query(`
    SELECT
      id::text,                -- must be string for Azure Search key
      name,
      base_price    AS price,
      images[1]     AS image_url
    FROM products;
  `);
  console.log(`📦 Fetched ${rows.length} rows from Postgres`);

  // 2) Instantiate Azure Search client
  const indexName = process.env.SEARCH_INDEX_NAME;
  if (!process.env.SEARCH_ENDPOINT || !process.env.SEARCH_ADMIN_KEY || !indexName) {
    throw new Error('Missing SEARCH_ENDPOINT, SEARCH_ADMIN_KEY or SEARCH_INDEX_NAME in .env');
  }
  const searchClient = new SearchClient(
    process.env.SEARCH_ENDPOINT,
    indexName,
    new AzureKeyCredential(process.env.SEARCH_ADMIN_KEY)
  );
  console.log('🔍 Index name:', indexName);

  // 3) Upload documents
  const result = await searchClient.uploadDocuments(rows);
  console.log('✅ Indexed documents:', result);

  await pg.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
