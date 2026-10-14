const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Show current state before cleanup
  console.log('=== Current Database State ===\n');
  
  const products = await p.product.findMany({
    include: { images: true, category: { select: { name: true } } }
  });
  
  const realProducts = products.filter(pr => pr.images.some(img => img.url.startsWith('/uploads/')));
  const dummyProducts = products.filter(pr => !pr.images.some(img => img.url.startsWith('/uploads/')));
  
  console.log('✅ REAL products (have uploaded photos):');
  realProducts.forEach(pr => console.log(`  - [${pr.id}] ${pr.name}`));
  
  console.log('\n❌ DUMMY products (only Unsplash/placeholder photos):');
  dummyProducts.forEach(pr => console.log(`  - [${pr.id}] ${pr.name}`));
  
  const orders = await p.order.count();
  const subscribers = await p.newsletterSubscriber.count();
  const reviews = await p.review.count();
  const customers = await p.customer.count();
  const promos = await p.promoCode.count();
  
  console.log(`\nOrders: ${orders}`);
  console.log(`Newsletter subscribers: ${subscribers}`);
  console.log(`Reviews: ${reviews}`);
  console.log(`Customers: ${customers}`);
  console.log(`Promo Codes: ${promos}`);
  
  console.log('\nRun cleanup_db.js to remove all dummy data.');
}

main().finally(() => p.$disconnect());
