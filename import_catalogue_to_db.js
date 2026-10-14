const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importCatalogueProducts() {
  console.log('--- Starting Catalogue Import into Afshan Gift Centre Database ---');

  // 1. Categories mapping dictionary
  const categoriesToEnsure = [
    { name: 'Clock', slug: 'clocks', description: 'Alarm clocks, vintage wall timepieces, and desk clocks.' },
    { name: 'Frame 3D', slug: 'frame-3d', description: '3D light photo frames, reflective backframes, and ambient illuminated frames.' },
    { name: 'Crystal Jar', slug: 'crystal-jar', description: 'Decorative crystal globe jars, dry fruit jars, and candy containers.' },
    { name: 'Plant Holders / Stand', slug: 'plant-holders-stand', description: 'Cage style plant holders, tall vase stands, and metal display racks.' },
    { name: 'Artificial Leaves', slug: 'plants', description: 'Artificial leaves, decorative potted plants, and ornamental botanical arrangements.' },
    { name: 'Lamps', slug: 'table-lamps', description: 'Floor lamps, 3D wave table lamps, and ambient luminaires.' },
    { name: 'Planters', slug: 'pots', description: 'Decorative floor planters, cycle planters, and indoor plant pots.' },
    { name: 'Candle Stands', slug: 'candle-stands', description: 'Metal and crystal candle holders, 3-arm swirl candelabras, and taper stands.' },
    { name: 'Tissue Boxes', slug: 'tissue-boxes', description: 'Metal gold edition tissue boxes, crystal covers, and luxury holders.' },
    { name: 'Pots / Vases', slug: 'vases', description: 'Decorative flower pots, fiber vases, and round flower vessels.' },
    { name: 'Wall Frames', slug: 'wall-frames', description: '3D floral metal wall frames, butterfly art, and gallery decor.' },
  ];

  const catMap = new Map();

  for (const c of categoriesToEnsure) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: `https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80`,
      },
    });
    catMap.set(c.slug, cat.id);
  }
  console.log('Categories verified and ready in DB.');

  // 2. The 11 Products from the Master Catalogue
  const catalogueProducts = [
    {
      name: 'Alarm Clock',
      slug: 'alarm-clock-metal',
      sku: 'AQC-SKU-005-CLK',
      origSku: 'AQC-SKU-005',
      categorySlug: 'clocks',
      price: 2500,
      compareAtPrice: 3000,
      stock: 23,
      material: 'Metal',
      dimensions: 'Standard Compact Desk Size',
      tags: 'alarm clock, clock, metal, bedroom, gift',
      shortDescription: 'Classic metal alarm clock with precision movement and twin-bell design.',
      description: 'Durable metal alarm clock available in black, gold, and white finishes. Perfect bedside and desktop timekeeper with clear dial numerals.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Black', sku: 'AQC-SKU-005-CLK-BLK', price: 2500, compareAtPrice: 3000, stock: 8 },
        { name: 'Gold', sku: 'AQC-SKU-005-CLK-GLD', price: 2500, compareAtPrice: 3000, stock: 8 },
        { name: 'White', sku: 'AQC-SKU-005-CLK-WHT', price: 2500, compareAtPrice: 3000, stock: 7 },
      ],
    },
    {
      name: '3D Light Photo Frame',
      slug: '3d-light-photo-frame',
      sku: 'AQC-SKU-005-FRM',
      origSku: 'AQC-SKU-005',
      categorySlug: 'frame-3d',
      price: 1500,
      compareAtPrice: 2500,
      stock: 20,
      material: 'Mirror, lights, reflective back',
      dimensions: '8" x 10" Display Aperture',
      tags: 'photo frame, 3d frame, led lights, mirror frame, gift',
      shortDescription: 'Decorative 3D photo frame featuring ambient LED lights and a reflective mirror back.',
      description: 'Decorative 3D photo frame featuring lights and a reflective back. Creates a captivating depth illusion with internal LED illumination. Available in all colours.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Standard 3D Light Model', sku: 'AQC-SKU-005-FRM-STD', price: 1500, compareAtPrice: 2500, stock: 20 },
      ],
    },
    {
      name: 'Crystal Globe Jar',
      slug: 'crystal-globe-jar',
      sku: 'AQC-DEC-005-JAR',
      origSku: 'AQC-DEC-005',
      categorySlug: 'crystal-jar',
      price: 2500,
      compareAtPrice: 3200,
      stock: 25,
      material: 'Metal and crystal',
      dimensions: 'Globe Silhouette with Lid',
      tags: 'crystal jar, candy jar, dry fruit jar, tabletop decor, gift',
      shortDescription: 'Decorative crystal globe jar with gold finished metal base and lid.',
      description: 'Decorative crystal globe jar with metal components. Ideal for dry fruit serving, candy presentation, or vanity table accent display. Transparent crystal with golden metallic trim.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Dry Fruit Crystal Jar', sku: 'AQC-DEC-005-JAR-DF', price: 2500, compareAtPrice: 3200, stock: 13 },
        { name: 'Globe Candy Jar with Lid', sku: 'AQC-DEC-005-JAR-CD', price: 2500, compareAtPrice: 3200, stock: 12 },
      ],
    },
    {
      name: 'Cage Plant Holder',
      slug: 'cage-plant-holder',
      sku: 'AQC-DEC-005-HLD',
      origSku: 'AQC-DEC-005',
      categorySlug: 'plant-holders-stand',
      price: 2400,
      compareAtPrice: 3000,
      stock: 20,
      material: 'Metal',
      dimensions: 'Tall & Round Geometrical Formats',
      tags: 'plant holder, cage holder, metal plant stand, decor',
      shortDescription: 'Metal plant holder designed for decorative indoor botanical displays.',
      description: 'Decorative cage-style plant holder crafted from forged wire metal. Available in tall vase shape and round spherical format for stylish tabletop greenery.',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Tall Vase Shape', sku: 'AQC-DEC-005-HLD-TLS', price: 2400, compareAtPrice: 3000, stock: 10 },
        { name: 'Round Shape', sku: 'AQC-DEC-005-HLD-RND', price: 2400, compareAtPrice: 3000, stock: 10 },
      ],
    },
    {
      name: 'Plant Leafs',
      slug: 'plant-leafs-artificial-collection',
      sku: 'AQC-DEC-005-BOT',
      origSku: 'AQC-DEC-005',
      categorySlug: 'plants',
      price: 4500,
      compareAtPrice: 6000,
      stock: 50,
      material: 'Decorative Poly-Fiber & Silk Botanicals',
      dimensions: 'Assorted Botanical Sizes',
      tags: 'artificial plants, banana leaf, ficus, cherry blossom, palm leaves, plant decor',
      shortDescription: 'Artificial decorative plants, leaves, and ornamental trees for home decoration.',
      description: 'Artificial decorative plants, leaves, and ornamental trees for home decoration. Features lifelike textures, realistic veins, and durable everlasting construction. Includes Banana Leaf, Ficus, Cherry Blossom, and Palm varieties.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Artificial Banana Leaf Plant with White Pot', sku: 'AQC-DEC-005-BOT-BNW', price: 4500, compareAtPrice: 6000, stock: 5 },
        { name: 'Artificial Banana Leaf Plant with Black Pot', sku: 'AQC-DEC-005-BOT-BNB', price: 4500, compareAtPrice: 6000, stock: 5 },
        { name: 'Rustic Floor Plant Pot', sku: 'AQC-DEC-005-BOT-RST', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Luxury Plant Pot', sku: 'AQC-DEC-005-BOT-LUX', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Artificial Pink Maple Leaf Tree', sku: 'AQC-DEC-005-BOT-PMT', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Yellow Cherry Blossom Tree', sku: 'AQC-DEC-005-BOT-YCB', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Pink Cherry Blossom Tree', sku: 'AQC-DEC-005-BOT-PCB', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Red Cherry Blossom Tree', sku: 'AQC-DEC-005-BOT-RCB', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Variegated Ficus Tree with Tall Vine', sku: 'AQC-DEC-005-BOT-FCV', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Bamboo Tree Leaf', sku: 'AQC-DEC-005-BOT-BMB', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Money Plant Tree', sku: 'AQC-DEC-005-BOT-MNY', price: 4500, compareAtPrice: 6000, stock: 4 },
        { name: 'Palm Leaves', sku: 'AQC-DEC-005-BOT-PLM', price: 4500, compareAtPrice: 6000, stock: 4 },
      ],
    },
    {
      name: 'Lamp',
      slug: 'decorative-floor-and-table-lamp',
      sku: 'AQC-DEC-005-LMP',
      origSku: 'AQC-DEC-005',
      categorySlug: 'table-lamps',
      price: 5000,
      compareAtPrice: 7000,
      stock: 50,
      material: 'Wood / metal with fabric pleated shade',
      dimensions: 'Square / Block Base Silhouette',
      tags: 'lamp, floor lamp, table lamp, pleated shade, ambient light',
      shortDescription: 'Decorative lamp featuring a fabric pleated shade and square or block-style design.',
      description: 'Decorative electric floor lamp featuring a fabric pleated shade and a square or block-style design. Emits a cozy warm ambient lighting for living rooms and bedrooms.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: '3D Wave Table Lamp', sku: 'AQC-DEC-005-LMP-3DW', price: 5000, compareAtPrice: 7000, stock: 17 },
        { name: '3D Twisted Leaf Table Lamp', sku: 'AQC-DEC-005-LMP-3TL', price: 5000, compareAtPrice: 7000, stock: 17 },
        { name: 'Crystal Glass Table Lamp', sku: 'AQC-DEC-005-LMP-CG', price: 5000, compareAtPrice: 7000, stock: 16 },
      ],
    },
    {
      name: 'Planter',
      slug: 'decorative-planters-collection',
      sku: 'AQC-SKU-005-PLT',
      origSku: 'AQC-SKU-005',
      categorySlug: 'pots',
      price: 5200,
      compareAtPrice: 6000,
      stock: 30,
      material: 'Durable Planter Materials with Botanical Accents',
      dimensions: 'Assorted Planter Formats',
      tags: 'planter, plant pot, cycle planter, ficus, flower pot',
      shortDescription: 'Decorative planters and artificial plant arrangements for interior decoration.',
      description: 'Decorative planters and artificial plant arrangements for interior decoration. Features creative cycle planters, floor pots, and dome arrangements that add warmth and life to any space.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Rustic Floor Plant Pot', sku: 'AQC-SKU-005-PLT-RST', price: 5200, compareAtPrice: 6000, stock: 4 },
        { name: 'Pink Maple Leaf', sku: 'AQC-SKU-005-PLT-PML', price: 5200, compareAtPrice: 6000, stock: 4 },
        { name: 'Yellow Cherry Blossom', sku: 'AQC-SKU-005-PLT-YCB', price: 5200, compareAtPrice: 6000, stock: 4 },
        { name: 'Ficus Tree', sku: 'AQC-SKU-005-PLT-FCS', price: 5200, compareAtPrice: 6000, stock: 4 },
        { name: 'Money Plant', sku: 'AQC-SKU-005-PLT-MNY', price: 5200, compareAtPrice: 6000, stock: 3 },
        { name: 'Cycle Flower', sku: 'AQC-SKU-005-PLT-CYF', price: 5200, compareAtPrice: 6000, stock: 3 },
        { name: 'Galaxy Rose Dome', sku: 'AQC-SKU-005-PLT-GRD', price: 5200, compareAtPrice: 6000, stock: 3 },
        { name: 'Cycle Planter', sku: 'AQC-SKU-005-PLT-CYP', price: 5200, compareAtPrice: 6000, stock: 3 },
        { name: 'Golden Cycle Flower Pot', sku: 'AQC-SKU-005-PLT-GCF', price: 5200, compareAtPrice: 6000, stock: 2 },
      ],
    },
    {
      name: 'Metal Candle Holder',
      slug: 'metal-candle-holder-set',
      sku: 'AQC-DEC-005-CND',
      origSku: 'AQC-DEC-005',
      categorySlug: 'candle-stands',
      price: 3200,
      compareAtPrice: 4000,
      stock: 20,
      material: 'Metal and crystal',
      dimensions: 'Approx. 14L × 7W × 2? (3-Piece Set: S, M, L)',
      tags: 'candle holder, crystal candle holder, brass stand, candle stand',
      shortDescription: 'Decorative metal and crystal candle holder set with a gold finish in three sizes.',
      description: 'Decorative metal and crystal candle holder set with a gold finish and three different sizes. Features elegant tall stands with round bases and sparkling crystal accents.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Crystal Glass Candle Holder', sku: 'AQC-DEC-005-CND-CG', price: 3200, compareAtPrice: 4000, stock: 3 },
        { name: 'Crystal Flower Candle Holder', sku: 'AQC-DEC-005-CND-CF', price: 3200, compareAtPrice: 4000, stock: 3 },
        { name: 'Bird Crystal Candle Holder', sku: 'AQC-DEC-005-CND-BC', price: 3200, compareAtPrice: 4000, stock: 3 },
        { name: 'Double Heart Crystal Candle Holder', sku: 'AQC-DEC-005-CND-DH', price: 3200, compareAtPrice: 4000, stock: 3 },
        { name: '3-Arm Swirl Crystal Candle Holder', sku: 'AQC-DEC-005-CND-3S', price: 3200, compareAtPrice: 4000, stock: 2 },
        { name: 'Triple Heart Candle Holder', sku: 'AQC-DEC-005-CND-TH', price: 3200, compareAtPrice: 4000, stock: 2 },
        { name: 'Crystal Flowers Candle Holder', sku: 'AQC-DEC-005-CND-CFL', price: 3200, compareAtPrice: 4000, stock: 2 },
        { name: 'Metal Taper', sku: 'AQC-DEC-005-CND-MTP', price: 3200, compareAtPrice: 4000, stock: 2 },
      ],
    },
    {
      name: 'Metal Tissue Box – Gold Edition',
      slug: 'metal-tissue-box-gold-edition',
      sku: 'AGC-DEC-005',
      origSku: 'AGC-DEC-005',
      categorySlug: 'tissue-boxes',
      price: 2500,
      compareAtPrice: 3200,
      stock: 25,
      material: 'Metal',
      dimensions: 'Rectangular Standard Tissue Box',
      tags: 'tissue box, metal tissue box, gold tissue box, embossed border, gift',
      shortDescription: 'Elegant gold metal tissue box with rectangular shape and embossed decorative border.',
      description: 'Elegant gold metal tissue box with a rectangular shape and embossed decorative border. Ideal for living rooms, bedrooms, and offices. Sturdy, wipeable, and luxurious.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Golden Metal Tissue Box', sku: 'AGC-DEC-005-GMT', price: 2500, compareAtPrice: 3200, stock: 10 },
        { name: 'Crystal Tissue Box Cover', sku: 'AGC-DEC-005-CTC', price: 2500, compareAtPrice: 3200, stock: 8 },
        { name: 'Luxury Golden Tissue Box', sku: 'AGC-DEC-005-LGT', price: 2500, compareAtPrice: 3200, stock: 7 },
      ],
    },
    {
      name: 'Decorative Flower Vase / Pot',
      slug: 'decorative-flower-vase-pot',
      sku: 'AGC-DEC-005-POT',
      origSku: 'AGC-DEC-005',
      categorySlug: 'vases',
      price: 1500,
      compareAtPrice: 2200,
      stock: 35,
      material: 'Fiber and metal',
      dimensions: 'Round Tabletop Silhouette',
      tags: 'flower vase, decorative pot, fiber pot, floral vessel, decor',
      shortDescription: 'Stylish round decorative pot made from fiber and metal for artificial flowers.',
      description: 'Stylish round decorative pot made from fiber and metal. Suitable for artificial flowers and home decoration. Lightweight, durable, and crafted for modern table styling.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Decorative Flower Pots', sku: 'AGC-DEC-005-POT-DFP', price: 1500, compareAtPrice: 2200, stock: 12 },
        { name: 'Round Decorative Pots', sku: 'AGC-DEC-005-POT-RDP', price: 1500, compareAtPrice: 2200, stock: 12 },
        { name: 'Luxury Flower Vases', sku: 'AGC-DEC-005-POT-LFV', price: 1500, compareAtPrice: 2200, stock: 11 },
      ],
    },
    {
      name: '3D Floral Wall Decor Frame',
      slug: '3d-floral-wall-decor-frame',
      sku: 'AGC-WDF-011',
      origSku: 'Not Provided',
      categorySlug: 'wall-frames',
      price: 4500,
      compareAtPrice: 5200,
      stock: 30,
      material: 'Metal',
      dimensions: 'Sculptured Wall Frame',
      tags: 'wall frame, 3d frame, floral wall decor, metal frame, butterfly frame',
      shortDescription: 'Decorative metal wall frame featuring a 3D floral design in black and light gold.',
      description: 'Decorative metal wall frame featuring a 3D floral design, available in black and light gold finishes. Suitable for living rooms, bedrooms, and hallways.',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: '3D Butterfly Wall Frame – Colorful', sku: 'AGC-WDF-011-BTF', price: 4500, compareAtPrice: 5200, stock: 6 },
        { name: 'Vintage Car Wall Frame', sku: 'AGC-WDF-011-VCR', price: 4500, compareAtPrice: 5200, stock: 6 },
        { name: 'Fish Wall Frame', sku: 'AGC-WDF-011-FSH', price: 4500, compareAtPrice: 5200, stock: 6 },
        { name: 'Lions / Lion Wall Frame', sku: 'AGC-WDF-011-LIO', price: 4500, compareAtPrice: 5200, stock: 6 },
        { name: '3D Flower Vase Wall Frame', sku: 'AGC-WDF-011-FVW', price: 4500, compareAtPrice: 5200, stock: 6 },
      ],
    },
  ];

  for (const p of catalogueProducts) {
    const categoryId = catMap.get(p.categorySlug);

    // Upsert product so it exists permanently
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug: p.slug }, { sku: p.sku }],
      },
      include: { images: true, variants: true },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          categoryId: categoryId,
          shortDescription: p.shortDescription,
          description: p.description,
          material: p.material,
          dimensions: p.dimensions,
          tags: p.tags,
          isActive: true,
          isFeatured: p.isFeatured,
          isOnSale: p.isOnSale,
        },
      });

      // Update images
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.createMany({
        data: p.images.map((url, idx) => ({
          productId: existing.id,
          url,
          alt: `${p.name} Image ${idx + 1}`,
          position: idx,
          isPrimary: idx === 0,
        })),
      });

      // Update variants
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
      await prisma.productVariant.createMany({
        data: p.variants.map((v) => ({
          productId: existing.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          isActive: true,
        })),
      });
      console.log(`Updated product: ${p.name}`);
    } else {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          categoryId: categoryId,
          shortDescription: p.shortDescription,
          description: p.description,
          material: p.material,
          dimensions: p.dimensions,
          tags: p.tags,
          isActive: true,
          isFeatured: p.isFeatured,
          isOnSale: p.isOnSale,
          images: {
            create: p.images.map((url, idx) => ({
              url,
              alt: `${p.name} Image ${idx + 1}`,
              position: idx,
              isPrimary: idx === 0,
            })),
          },
          variants: {
            create: p.variants.map((v) => ({
              name: v.name,
              sku: v.sku,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              stock: v.stock,
              isActive: true,
            })),
          },
        },
      });
      console.log(`Created product: ${p.name}`);
    }
  }

  console.log('✅ All 11 catalogue products successfully imported into database.');
}

importCatalogueProducts()
  .catch((err) => {
    console.error('Error importing catalogue products:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
