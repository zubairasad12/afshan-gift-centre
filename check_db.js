const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  console.log(`\nTotal products in DB (latest 20):`);
  products.forEach(p => console.log(` - ${p.name} | ${p.category?.name} | Rs. ${p.price}`));
  
  const total = await prisma.product.count();
  console.log(`\nGrand total: ${total} products`);
  
  const cats = await prisma.category.findMany({ select: { name: true, slug: true } });
  console.log(`\nCategories (${cats.length}):`);
  cats.forEach(c => console.log(` - ${c.name} [${c.slug}]`));
}

main().finally(() => prisma.$disconnect());
