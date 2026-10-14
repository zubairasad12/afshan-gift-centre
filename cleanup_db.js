const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const DUMMY_PRODUCT_IDS = [
  'cmv6w34hb004ln65024cycb80', // Gallery Quad Wooden Photo Frame Set
  'cmv6w34hs004sn650rww9ydwb', // Vintage Baroque Ornate Golden Photo Frame
  'cmv6w34kz0065n650yitrvaue', // Vintage Roman Numeral Silent-Sweep Wall Clock
  'cmv8cdi8g000cnclj5dtb8mwl', // Alarm Clock (no real photo uploaded)
  'cmv8cdi8y000incljii3fsh14', // 3D Light Photo Frame (no real photo uploaded)
];

async function main() {
  console.log('🧹 Continuing dummy data cleanup...\n');

  // 1. Delete all dummy product images
  await p.productImage.deleteMany({
    where: { productId: { in: DUMMY_PRODUCT_IDS } }
  });

  // 2. Delete all dummy product variants
  await p.productVariant.deleteMany({
    where: { productId: { in: DUMMY_PRODUCT_IDS } }
  });

  // 3. Delete collection links for dummy products
  await p.collectionProduct.deleteMany({
    where: { productId: { in: DUMMY_PRODUCT_IDS } }
  });

  // 4. Delete any reviews
  await p.review.deleteMany({});
  console.log('✅ Cleared all dummy reviews');

  // 5. Delete the dummy products
  await p.product.deleteMany({
    where: { id: { in: DUMMY_PRODUCT_IDS } }
  });
  console.log('✅ Deleted dummy products without photos');

  // 6. Delete all dummy orders & order items
  await p.orderItem.deleteMany({});
  await p.payment.deleteMany({});
  await p.shipment.deleteMany({});
  await p.order.deleteMany({});
  console.log('✅ Cleared dummy orders, items, payments and shipments');

  // 7. Delete dummy discount redemptions and discounts
  await p.discountRedemption.deleteMany({});
  await p.discount.deleteMany({});
  console.log('✅ Cleared dummy discount coupons');

  // 8. Delete dummy subscribers & audit logs
  await p.newsletterSubscriber.deleteMany({});
  await p.auditLog.deleteMany({});
  console.log('✅ Cleared newsletter and audit logs');

  // 9. Count remaining
  const finalProductCount = await p.product.count();
  const finalOrderCount = await p.order.count();
  console.log(`\n✨ Done! Only real products remain: ${finalProductCount}`);
  console.log(`✨ Current live orders: ${finalOrderCount} (new customer orders will populate here)`);
}

main()
  .catch(e => { console.error('❌ Error:', e.message); process.exit(1); })
  .finally(() => p.$disconnect());
