const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const imgs = await p.productImage.findMany({ take: 20, include: { product: { select: { name: true } } } });
  console.log('Product images in DB:', imgs.length);
  imgs.forEach(i => console.log(' -', i.product.name, '|', i.url));
}

main().finally(() => p.$disconnect());
