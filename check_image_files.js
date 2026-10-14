const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const p = new PrismaClient();

async function main() {
  const imgs = await p.productImage.findMany({
    include: { product: { select: { name: true } } }
  });
  
  console.log('\n=== Checking all product images ===\n');
  let broken = 0;
  let ok = 0;
  
  for (const img of imgs) {
    if (img.url.startsWith('/uploads/')) {
      const filePath = path.join('c:/Users/HP/Desktop/sadiaproject/public', img.url.replace(/\//g, path.sep));
      if (fs.existsSync(filePath)) {
        console.log('✅ OK    :', img.product.name, '->', img.url);
        ok++;
      } else {
        console.log('❌ MISSING:', img.product.name, '->', img.url);
        broken++;
      }
    } else {
      console.log('🔗 EXTERNAL:', img.product.name, '->', img.url.substring(0, 60));
      ok++;
    }
  }
  
  console.log(`\nSummary: ${ok} OK, ${broken} broken/missing`);
}

main().finally(() => p.$disconnect());
