import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

const prisma = new PrismaClient();
const search = new SearchClient(
process.env.SEARCH_ENDPOINT,         // e.g. https://bambosey-search.search.windows.net
'tote-catalog',
new AzureKeyCredential(process.env.SEARCH_ADMIN_KEY)
);

const BATCH = 500; // tune as needed

function toDoc(p) {
return {
id: String(p.id),                             // or p.slug / p.sku
name: p.name,
tags: p.tags ?? [],                           // or derive from category/variant
image_url: p.images?.[0] ?? p.image_url ?? '',
price: Number(p.base_price ?? p.price ?? 0),
};
}

async function main() {
// Pull everything or only incrementals using updatedAt
let cursor = 0;
// Example: flat products table
while (true) {
const products = await prisma.products.findMany({
    skip: cursor,
    take: BATCH,
    orderBy: { id: 'asc' },
    select: {
    id: true,
    name: true,
    base_price: true,
    images: true,         // string[] in your schema
    tags: true,           // if you store tags; otherwise build them
    },
});
if (products.length === 0) break;

const actions = products.map(p => ({
    actionType: 'mergeOrUpload',  // upsert
    ...toDoc(p),
}));

await search.uploadDocuments(actions);
cursor += products.length;
console.log(`Indexed ${cursor}`);
}

// Optional: handle deletions (Search has no foreign key awareness)
// Keep a table of deleted product ids and send { actionType: 'delete', id }
}

main().then(() => {
console.log('Done');
process.exit(0);
}).catch(err => {
console.error(err);
process.exit(1);
});
