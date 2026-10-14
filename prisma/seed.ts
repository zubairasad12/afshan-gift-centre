import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Afshan Gift Centre database with Gift items...')

  // 1. Admin User (Upsert)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@afshangiftcentre.com' },
    update: {
      password: hashedPassword,
      name: 'Afshan Gift Centre Admin',
      role: 'ADMIN',
      phone: '03001005861',
    },
    create: {
      email: 'admin@afshangiftcentre.com',
      password: hashedPassword,
      name: 'Afshan Gift Centre Admin',
      role: 'ADMIN',
      phone: '03001005861',
    },
  })
  console.log(`Admin user ready: ${adminUser.email}`)

  // Demo customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Fatima Zahra',
      role: 'CUSTOMER',
      phone: '03017654321',
    },
  })

  // 2. Clear old products & categories to strictly remove furniture, cushions, rugs, chandeliers, sconces, etc.
  console.log('Cleaning up obsolete furniture/decor records...')
  await prisma.orderItem.deleteMany({})
  await prisma.cartItem.deleteMany({})
  await prisma.wishlistItem.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.collectionProduct.deleteMany({})
  await prisma.productImage.deleteMany({})
  await prisma.productVariant.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.collection.deleteMany({})

  // 3. New Gift Centre Categories (Including requested: Tissue Boxes, Plants, Pots, Vases, Wall Frames + Decor accents & Lamps)
  const categoryDefs = [
    {
      name: 'Tissue Boxes',
      slug: 'tissue-boxes',
      description: 'Handcrafted mother-of-pearl, velvet embroidered, and artisan wooden tissue box covers.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Plants',
      slug: 'plants',
      description: 'Evergreen lifelike faux botanicals, indoor fiddle leaf figs, mini olive trees & potted greenery.',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Pots',
      slug: 'pots',
      description: 'Hand-hammered brass planters, glazed ceramic pots, and elevated iron stand planters.',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Vases',
      slug: 'vases',
      description: 'Minimalist ribbed ceramic, fluted tinted glass, and porcelain decorative vases.',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Wall Frames',
      slug: 'wall-frames',
      description: 'Museum-quality gilded Ayat-ul-Kursi calligraphy, 4 Quls, and timeless photo gallery frame sets.',
      image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Table Lamps',
      slug: 'table-lamps',
      description: 'Warm ambient bedside lamps with amber fluted glass and ceramic bases.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Floor Lamps',
      slug: 'floor-lamps',
      description: 'Contemporary minimalist floor lamps for cozy warm room corners.',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Candle Stands',
      slug: 'candle-stands',
      description: 'Rose quartz pedestals, brass candelabras, and festive taper candle holders.',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Scented Candles',
      slug: 'scented-candles',
      description: 'Hand-poured pure soy wax scented candles infused with oud, amber, and jasmine.',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Mirrors',
      slug: 'mirrors',
      description: 'Arched vanity, filigree brass frames, and statement decorative wall mirrors.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Clocks',
      slug: 'clocks',
      description: 'Silent sweep Roman numeral clocks, vintage brass & wooden wall timepieces.',
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Trays & Decor',
      slug: 'trays',
      description: 'Decorative vanity trays, brass serving platters, and decorative tabletop accents.',
      image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    },
  ]

  const categoryMap = new Map<string, string>()
  for (let i = 0; i < categoryDefs.length; i++) {
    const c = categoryDefs[i]
    const createdCat = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        sortOrder: i + 1,
        image: c.image,
      },
    })
    categoryMap.set(c.slug, createdCat.id)
  }
  console.log(`Created ${categoryDefs.length} Gift Centre categories`)

  // 4. Curated Collections
  const collectionDefs = [
    {
      name: 'Signature Gift Collection',
      slug: 'signature-gifts',
      description: 'Our most cherished handcrafted presents, tissue boxes, and keepsake decor.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Botanical Greens & Planters',
      slug: 'botanical-greens',
      description: 'Lush everlasting faux plants and artisanal brass and ceramic pots.',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Artisan Vases & Ceramic Studio',
      slug: 'artisan-vases',
      description: 'Stoneware ceramics and fluted glass vases for floral styling.',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Gilded Calligraphy & Wall Frames',
      slug: 'gilded-frames',
      description: 'Hand-embossed Islamic calligraphy and heirloom photo frames.',
      image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Ambient Glow & Lamps',
      slug: 'ambient-lamps',
      description: 'Bedside amber lamps, floor lighting, and candelabras for warm spaces.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  const collectionMap = new Map<string, string>()
  for (let i = 0; i < collectionDefs.length; i++) {
    const col = collectionDefs[i]
    const createdCol = await prisma.collection.create({
      data: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        sortOrder: i + 1,
        image: col.image,
      },
    })
    collectionMap.set(col.slug, createdCol.id)
  }
  console.log(`Created ${collectionDefs.length} curated gift collections`)

  // 5. Products Database (50+ dedicated Gift Centre Products across Tissue Boxes, Plants, Pots, Vases, Wall Frames, Lamps, Decor)
  const productsData = [
    // --- TISSUE BOXES ---
    {
      name: 'Artisan Mother-of-Pearl Inlaid Tissue Box',
      slug: 'artisan-mother-of-pearl-inlaid-tissue-box',
      sku: 'AGC-TB-001',
      categorySlug: 'tissue-boxes',
      collectionSlug: 'signature-gifts',
      price: 3450,
      compareAtPrice: 4200,
      shortDescription: 'Handcrafted wooden tissue box with iridescent floral mother-of-pearl inlay.',
      description: 'A masterpiece of traditional craftsmanship from Vehari. Hand-carved seasoned timber inlaid with genuine sea-shell mother-of-pearl in intricate floral motifs. Features a sliding bottom latch with hidden magnets for quick tissue box refills.',
      material: 'Seasoned Hardwood & Genuine Mother-of-Pearl',
      dimensions: '10" L x 5.5" W x 3.5" H',
      weight: '850 grams',
      tags: 'tissue box, mother of pearl, wooden decor, gift, wedding gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Standard (10x5.5")', sku: 'AGC-TB-001-STD', price: 3450, compareAtPrice: 4200, stock: 18 },
        { name: 'Square Cube (5.5x5.5")', sku: 'AGC-TB-001-SQ', price: 2950, compareAtPrice: 3600, stock: 12 },
      ],
    },
    {
      name: 'Royal Velvet Embroidered Gold Tilla Tissue Box',
      slug: 'royal-velvet-embroidered-gold-tilla-tissue-box',
      sku: 'AGC-TB-002',
      categorySlug: 'tissue-boxes',
      collectionSlug: 'signature-gifts',
      price: 2400,
      compareAtPrice: 3000,
      shortDescription: 'Emerald green velvet cover with golden tilla embroidery and braided cord.',
      description: 'Luxurious plush emerald velvet wrapped around a reinforced wooden core. Features intricate golden tilla zardozi hand embroidery on top and sides, finished with a classic braided cord trim.',
      material: 'Plush Velvet & Gold Zari Thread',
      dimensions: '9.5" L x 5" W x 3.5" H',
      weight: '600 grams',
      tags: 'velvet, embroidered, tissue box, luxury gift, bridal',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Emerald Green', sku: 'AGC-TB-002-EMR', price: 2400, compareAtPrice: 3000, stock: 20 },
        { name: 'Royal Maroon', sku: 'AGC-TB-002-MRN', price: 2400, compareAtPrice: 3000, stock: 15 },
        { name: 'Midnight Navy', sku: 'AGC-TB-002-NVY', price: 2400, compareAtPrice: 3000, stock: 14 },
      ],
    },
    {
      name: 'Fluted Walnut Wooden Tissue Box with Brass Lip',
      slug: 'fluted-walnut-wooden-tissue-box-with-brass-lip',
      sku: 'AGC-TB-003',
      categorySlug: 'tissue-boxes',
      collectionSlug: 'signature-gifts',
      price: 2850,
      compareAtPrice: 3400,
      shortDescription: 'Modern fluted ribbed wood tissue box with brushed golden brass top aperture.',
      description: 'Scandinavian minimalist aesthetic meets organic warm wood grain. Vertical fluted ribbing along all four sides with an oval electroplated brushed brass dispensing rim.',
      material: 'Solid Walnut Wood & Brushed Brass',
      dimensions: '9.8" L x 5.2" W x 3.6" H',
      weight: '750 grams',
      tags: 'minimalist, wooden, walnut, tissue box, modern decor',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Natural Walnut', sku: 'AGC-TB-003-WAL', price: 2850, compareAtPrice: 3400, stock: 25 },
        { name: 'Bleached Oak', sku: 'AGC-TB-003-OAK', price: 2850, compareAtPrice: 3400, stock: 10 },
      ],
    },
    {
      name: 'Faux Crocodile Textured Leatherette Tissue Box',
      slug: 'faux-crocodile-textured-leatherette-tissue-box',
      sku: 'AGC-TB-004',
      categorySlug: 'tissue-boxes',
      collectionSlug: 'signature-gifts',
      price: 2150,
      compareAtPrice: 2600,
      shortDescription: 'Wipeable embossed leatherette tissue box with contrast saddle stitching.',
      description: 'Sophisticated executive tissue holder with rich crocodile grain texture. Water-resistant and easy to clean, making it ideal for cars, office desks, and bedside tables.',
      material: 'Premium Vegan Leatherette',
      dimensions: '9.5" L x 5" W x 3.5" H',
      weight: '500 grams',
      tags: 'leather, tissue box, office gift, executive',
      isFeatured: false,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- PLANTS ---
    {
      name: 'Everlasting Faux Fiddle Leaf Fig Botanical Plant',
      slug: 'everlasting-faux-fiddle-leaf-fig-botanical-plant',
      sku: 'AGC-PLT-001',
      categorySlug: 'plants',
      collectionSlug: 'botanical-greens',
      price: 4950,
      compareAtPrice: 6000,
      shortDescription: '3-feet tall ultra-realistic botanical tree with lifelike deep emerald veins.',
      description: 'Bring the refreshing vibrance of nature indoors without the worry of watering or sunlight. Premium poly-silk foliage shaped around wire stems so you can bend and style leaves to your preference. Comes anchored in a weighted black starter pot.',
      material: 'Poly-Silk Foliage & Textured Wire Stem',
      dimensions: '36" Height (3 Feet Tall)',
      weight: '1.8 kg',
      tags: 'artificial plant, fiddle leaf fig, indoor greenery, home gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: '3 Feet (36")', sku: 'AGC-PLT-001-3FT', price: 4950, compareAtPrice: 6000, stock: 15 },
        { name: '4.5 Feet (54")', sku: 'AGC-PLT-001-4FT', price: 7800, compareAtPrice: 9200, stock: 8 },
      ],
    },
    {
      name: 'Miniature Bonsai Zen Olive Tree in Ceramic Pot',
      slug: 'miniature-bonsai-zen-olive-tree-in-ceramic-pot',
      sku: 'AGC-PLT-002',
      categorySlug: 'plants',
      collectionSlug: 'botanical-greens',
      price: 3200,
      compareAtPrice: 4000,
      shortDescription: 'Charming artificial olive tree with realistic miniature olives in a stone pot.',
      description: 'A symbol of peace and prosperity. Features delicate silvery-green olive leaves, lifelike faux olives, and a gnarled textured trunk fixed in an earthy stone-effect ceramic container.',
      material: 'Silk Foliage & Cast Ceramic Bowl',
      dimensions: '18" H x 12" Canopy Spread',
      weight: '1.1 kg',
      tags: 'olive tree, bonsai, tabletop plant, green gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Potted Faux Monsteria Deliciosa Tropical Plant',
      slug: 'potted-faux-monstera-deliciosa-tropical-plant',
      sku: 'AGC-PLT-003',
      categorySlug: 'plants',
      collectionSlug: 'botanical-greens',
      price: 3850,
      compareAtPrice: 4600,
      shortDescription: 'Iconic Swiss-cheese split leaf monstera in matte grey nursery planter.',
      description: 'Ten wide, glossy architectural monstera leaves with natural cutouts. Adds immediate tropical luxury to side tables, consoles, or entryway shelves.',
      material: 'Real-Touch Polyurethane & Wire',
      dimensions: '26" Height x 20" Spread',
      weight: '1.4 kg',
      tags: 'monstera, tropical plant, faux plant, decor gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Trio of Faux Succulents in Geometrical White Ceramic Pots',
      slug: 'trio-of-faux-succulents-in-white-ceramic-pots',
      sku: 'AGC-PLT-004',
      categorySlug: 'plants',
      collectionSlug: 'botanical-greens',
      price: 2200,
      compareAtPrice: 2800,
      shortDescription: 'Set of 3 charming mini succulents potted with natural miniature river pebbles.',
      description: 'A delightful desktop gift set. Includes three assorted lifelike succulents (Echeveria, Aloe, Jade) nestled in faceted geometric white porcelain pots with a natural bamboo tray.',
      material: 'High-Density Soft PVC & Ceramic',
      dimensions: '3.5" H x 3" Diameter each',
      weight: '650 grams',
      tags: 'succulents, mini plants, desk gift, ceramic pots',
      isFeatured: false,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- POTS ---
    {
      name: 'Brushed Brass Hammered Metal Planter Pot with Stand',
      slug: 'brushed-brass-hammered-metal-planter-pot-with-stand',
      sku: 'AGC-POT-001',
      categorySlug: 'pots',
      collectionSlug: 'botanical-greens',
      price: 3600,
      compareAtPrice: 4500,
      shortDescription: 'Hand-hammered gold brass bowl elevated on a matte black iron tripod stand.',
      description: 'An elevated stage for your favorite plants or flower arrangements. The bowl is shaped from durable iron electroplated with an antique brushed brass lacquer that resists tarnishing.',
      material: 'Pure Iron & Brushed Antique Brass',
      dimensions: '8" Diameter Pot x 18" Total Height',
      weight: '1.3 kg',
      tags: 'pot, brass planter, plant stand, metallic decor',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Medium (18" Tall)', sku: 'AGC-POT-001-MD', price: 3600, compareAtPrice: 4500, stock: 16 },
        { name: 'Large (24" Tall)', sku: 'AGC-POT-001-LG', price: 4800, compareAtPrice: 5800, stock: 12 },
      ],
    },
    {
      name: 'Artisan Terracotta Dual-Tone Ribbed Pot',
      slug: 'artisan-terracotta-dual-tone-ribbed-pot',
      sku: 'AGC-POT-002',
      categorySlug: 'pots',
      collectionSlug: 'botanical-greens',
      price: 1950,
      compareAtPrice: 2400,
      shortDescription: 'Kiln-fired earthy terracotta with matte chalk white top and raw clay base.',
      description: 'Warm, rustic charm. Thrown by hand on traditional pottery wheels in southern Punjab, kiln-cured, and dip-glazed with an unpretentious chalk white matte wash.',
      material: 'Natural Red Clay Terracotta',
      dimensions: '7.5" H x 7" Diameter',
      weight: '1.2 kg',
      tags: 'terracotta, clay pot, artisan planter, rustic gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Nordic Fluted Matte White Ceramic Planter Pot',
      slug: 'nordic-fluted-matte-white-ceramic-planter-pot',
      sku: 'AGC-POT-003',
      categorySlug: 'pots',
      collectionSlug: 'botanical-greens',
      price: 2400,
      compareAtPrice: 3000,
      shortDescription: 'Modern vertical fluted stoneware planter with matching saucer tray.',
      description: 'Crisp, clean lines designed to accentuate architectural greenery. Features vertical fluted columns, internal water reservoir drainage, and a seamless matching drip dish.',
      material: 'High-Fired Glazed Ceramic Stoneware',
      dimensions: '8" Diameter x 8" Height',
      weight: '1.5 kg',
      tags: 'ceramic pot, white planter, fluted pot, modern gift',
      isFeatured: false,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Hexagonal Marble Pattern Golden Rim Ceramic Pot',
      slug: 'hexagonal-marble-pattern-golden-rim-ceramic-pot',
      sku: 'AGC-POT-004',
      categorySlug: 'pots',
      collectionSlug: 'botanical-greens',
      price: 2750,
      compareAtPrice: 3400,
      shortDescription: 'Six-sided ceramic pot with Carrara marble veining and electroplated gold rim.',
      description: 'A luxurious accent for coffee tables, vanity desks, and console tables. Finished with an intricate grey marble swirl and a gilded reflective lip.',
      material: 'Glazed Porcelain & Gold Electroplate',
      dimensions: '6.5" W x 6" H',
      weight: '900 grams',
      tags: 'marble pot, gold rim, hexagonal planter, luxury gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- VASES ---
    {
      name: 'Nordic Fluted Ceramic Ribbed Vase - Sand Cream',
      slug: 'nordic-fluted-ceramic-ribbed-vase-sand-cream',
      sku: 'AGC-VAS-001',
      categorySlug: 'vases',
      collectionSlug: 'artisan-vases',
      price: 2850,
      compareAtPrice: 3500,
      shortDescription: 'Scandinavian ribbed pottery vase with textured matte sand finish.',
      description: 'Handcrafted stoneware vase featuring gentle vertical ridges and a soft tactile sand glaze. Looks stunning on its own as a sculptural piece or filled with dried eucalyptus stems.',
      material: 'Handcrafted Glazed Ceramic Stoneware',
      dimensions: '10.5" H x 5" Base Diameter',
      weight: '950 grams',
      tags: 'vase, ceramic vase, fluted, sand cream, gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Sand Cream (10.5")', sku: 'AGC-VAS-001-CRM', price: 2850, compareAtPrice: 3500, stock: 20 },
        { name: 'Charcoal Black (10.5")', sku: 'AGC-VAS-001-BLK', price: 2850, compareAtPrice: 3500, stock: 14 },
      ],
    },
    {
      name: 'Fluted Amber Borosilicate Tinted Glass Flower Vase',
      slug: 'fluted-amber-borosilicate-tinted-glass-flower-vase',
      sku: 'AGC-VAS-002',
      categorySlug: 'vases',
      collectionSlug: 'artisan-vases',
      price: 2350,
      compareAtPrice: 2900,
      shortDescription: 'Translucent warm amber glass vase with rippled optical texture.',
      description: 'Catches and refracts sunlight beautifully. Mouth-blown from durable borosilicate glass with a narrow neck designed to support graceful single rose stems or baby’s breath.',
      material: 'Mouth-Blown Tinted Glass',
      dimensions: '9" H x 4" Diameter',
      weight: '600 grams',
      tags: 'glass vase, amber, tinted, flower vase, gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Abstract Donut Ceramic Sculptural Vase - Matte White',
      slug: 'abstract-donut-ceramic-sculptural-vase-matte-white',
      sku: 'AGC-VAS-003',
      categorySlug: 'vases',
      collectionSlug: 'artisan-vases',
      price: 3100,
      compareAtPrice: 3900,
      shortDescription: 'Modern circular ring silhouette vase with textured chalk finish.',
      description: 'The iconic modern interior design silhouette. An empty center ring with twin stem openings, created for dry pampas grass, bunny tails, and contemporary minimalist consoles.',
      material: 'Fine Ceramic with Chalk Matte Glaze',
      dimensions: '8" Diameter x 8.5" H',
      weight: '800 grams',
      tags: 'donut vase, circular vase, modern ceramic, abstract',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Traditional Multani Blue Pottery Hand-Painted Vase',
      slug: 'traditional-multani-blue-pottery-hand-painted-vase',
      sku: 'AGC-VAS-004',
      categorySlug: 'vases',
      collectionSlug: 'artisan-vases',
      price: 3800,
      compareAtPrice: 4800,
      shortDescription: 'Authentic cobalt blue and turquoise hand-painted floral motifs on white clay.',
      description: 'Preserving our southern Punjab artistic legacy. Painted with natural cobalt and copper oxide pigments by master kashigari craftsmen, glazed and kiln-fired to a permanent glossy porcelain finish.',
      material: 'Authentic Multani Clay & Lead-Free Mineral Glaze',
      dimensions: '12" H x 6" Belly Diameter',
      weight: '1.4 kg',
      tags: 'blue pottery, multani, kashigari, heritage gift, traditional',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- WALL FRAMES ---
    {
      name: 'Ayat-ul-Kursi Gilded Calligraphy Wall Frame',
      slug: 'ayat-ul-kursi-gilded-calligraphy-wall-frame',
      sku: 'AGC-WF-001',
      categorySlug: 'wall-frames',
      collectionSlug: 'gilded-frames',
      price: 5800,
      compareAtPrice: 7200,
      shortDescription: 'Intricately embossed Thuluth Arabic script in antique gold foil under museum glass.',
      description: 'A deeply cherished blessing for every Muslim household. The Throne Verse is laser-embossed in reflective golden foil over a deep black velvet background, framed in a custom 2-inch carved golden moulding with crystal clear float glass.',
      material: 'Antique Gold Foil Embossing & Glass Wood Frame',
      dimensions: '24" W x 32" H',
      weight: '2.8 kg',
      tags: 'ayat ul kursi, islamic wall frame, calligraphy, religious gift, housewarming',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Standard (24x32")', sku: 'AGC-WF-001-STD', price: 5800, compareAtPrice: 7200, stock: 12 },
        { name: 'Grand (30x42")', sku: 'AGC-WF-001-GRD', price: 9200, compareAtPrice: 11500, stock: 6 },
      ],
    },
    {
      name: 'Surah Al-Ikhlas & 4 Quls Diptych Gold Wall Frame Set',
      slug: 'surah-al-ikhlas-4-quls-gold-wall-frame-set',
      sku: 'AGC-WF-002',
      categorySlug: 'wall-frames',
      collectionSlug: 'gilded-frames',
      price: 6400,
      compareAtPrice: 8000,
      shortDescription: 'Pair of matching gold frames with protective 4 Qul verses.',
      description: 'Designed as a harmonious matching pair. Each frame features balanced Diwani script calligraphy, surrounded by a double acid-free mat board and brushed champagne gold frames.',
      material: 'High-Grade Polystyrene Moulding & Ultra-Clear Glass',
      dimensions: 'Two 16" W x 20" H Frames',
      weight: '2.4 kg',
      tags: '4 quls, frame set, islamic art, wall decor, gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Gallery Quad Wooden Photo Frame Set - Natural Oak',
      slug: 'gallery-quad-wooden-photo-frame-set-natural-oak',
      sku: 'AGC-WF-003',
      categorySlug: 'wall-frames',
      collectionSlug: 'gilded-frames',
      price: 4200,
      compareAtPrice: 5000,
      shortDescription: 'Set of 4 matching photo frames in natural oak wood finish with bevel mats.',
      description: 'Turn treasured family memories into a coordinated gallery wall. Set of four precision-cut oak wood frames with removable white bevel mats for displaying 5x7 or 8x10 photographs.',
      material: 'Solid Oak Wood & True-Color Float Glass',
      dimensions: 'Four 11" x 14" Frames (for 5x7 or 8x10 prints)',
      weight: '2.2 kg',
      tags: 'photo frames, gallery wall, family memories, wedding gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Vintage Baroque Ornate Golden Photo Frame',
      slug: 'vintage-baroque-ornate-golden-photo-frame',
      sku: 'AGC-WF-004',
      categorySlug: 'wall-frames',
      collectionSlug: 'gilded-frames',
      price: 2600,
      compareAtPrice: 3200,
      shortDescription: 'Classic Rococo filigree scrollwork frame with antiqued burnished gold leaf.',
      description: 'Ideal tabletop or wall-mounted keepsake frame. Beautifully cast scrollwork with intricate flourishes, backed by soft velvet with a dual-direction easel stand.',
      material: 'Cast Resin with Gold Leaf Patina & Glass',
      dimensions: 'Fits 8x10 Photo (Outer 10" x 12")',
      weight: '750 grams',
      tags: 'baroque, vintage frame, gold photo frame, antique gift',
      isFeatured: false,
      isOnSale: false,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- TABLE LAMPS & LIGHTING ---
    {
      name: 'Amber Glass Fluted Ambient Table Lamp',
      slug: 'amber-glass-fluted-ambient-table-lamp',
      sku: 'AGC-LGT-001',
      categorySlug: 'table-lamps',
      collectionSlug: 'ambient-lamps',
      price: 6400,
      compareAtPrice: 7800,
      shortDescription: 'Warm ambient glow with pleated amber tinted glass and spun brass accents.',
      description: 'A cozy luminaire that transforms evening ambience. Hand-blown pleated amber glass cylinder emits a golden soothing glow. Complete with warm filament LED bulb and inline switch.',
      material: 'Borosilicate Amber Glass & Brushed Brass',
      dimensions: '14" H x 7" Diameter',
      weight: '1.4 kg',
      tags: 'table lamp, amber glass, bedside lamp, gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Ceramic Stoneware Table Lamp with Linen Shade',
      slug: 'ceramic-stoneware-table-lamp-with-linen-shade',
      sku: 'AGC-LGT-002',
      categorySlug: 'table-lamps',
      collectionSlug: 'ambient-lamps',
      price: 5900,
      compareAtPrice: 7200,
      shortDescription: 'Textured ivory ceramic base with tapered natural oatmeal linen shade.',
      description: 'Earthy organic elegance. The jug-shaped stoneware base is hand-textured with clay slip, paired with an oatmeal woven linen shade that softens and diffuses ambient room lighting.',
      material: 'Stoneware Ceramic & Natural Woven Linen',
      dimensions: '20" Total Height x 12" Shade Diameter',
      weight: '2.1 kg',
      tags: 'ceramic lamp, linen shade, warm lighting, bedside lamp',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Minimalist Arc Floor Lamp with Marble Base',
      slug: 'minimalist-arc-floor-lamp-with-marble-base',
      sku: 'AGC-LGT-003',
      categorySlug: 'floor-lamps',
      collectionSlug: 'ambient-lamps',
      price: 14500,
      compareAtPrice: 17800,
      shortDescription: 'Sweeping brushed brass arc lamp anchored on a heavy circular marble plinth.',
      description: 'Provides overhead reading light without ceiling installation. Sweeping brass tubular arm anchored safely onto a 12kg white Marquina marble base.',
      material: 'Natural Marble Plinth & Plated Brass Steel',
      dimensions: '68" Height x 32" Reach',
      weight: '14 kg',
      tags: 'floor lamp, arc lamp, marble base, living room light',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- CANDLE STANDS & SCENTED CANDLES ---
    {
      name: 'Luxury Rose Quartz & Solid Brass Candle Stand',
      slug: 'luxury-rose-quartz-brass-candle-stand',
      sku: 'AGC-DEC-001',
      categorySlug: 'candle-stands',
      collectionSlug: 'signature-gifts',
      price: 3800,
      compareAtPrice: 4800,
      shortDescription: 'Semi-precious natural rose quartz base with a solid polished brass candle cup.',
      description: 'Each piece features an authentic raw rose quartz crystal pedestal cut with polished facets, crowned with a forged brass holder for standard taper dinner candles.',
      material: 'Natural Rose Quartz & Solid Brass',
      dimensions: '9" H x 4" Base',
      weight: '900 grams',
      tags: 'candle stand, rose quartz, brass candelabra, wedding gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Royal Sandalwood & Oud Soy Wax Scented Candle in Amber Jar',
      slug: 'royal-sandalwood-oud-scented-candle-amber-jar',
      sku: 'AGC-DEC-002',
      categorySlug: 'scented-candles',
      collectionSlug: 'signature-gifts',
      price: 1850,
      compareAtPrice: 2400,
      shortDescription: 'Hand-poured 100% natural soy wax infused with royal sandalwood and smoky oud.',
      description: 'Burn time 55+ hours. Formulated with cotton wick and therapeutic essential oil blends. Poured in a heavy amber glass jar with an airtight bamboo wooden lid.',
      material: 'Pure Soy Wax & Essential Oils in Glass Jar',
      dimensions: '3.5" Diameter x 4" H (300g wax)',
      weight: '650 grams',
      tags: 'scented candle, oud, aromatherapy, soy wax, gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // --- MIRRORS & CLOCKS & TRAYS ---
    {
      name: 'Arch Brass Vanity Mirror with Filigree Floral Crest',
      slug: 'arch-brass-vanity-mirror-filigree-floral-crest',
      sku: 'AGC-DEC-003',
      categorySlug: 'mirrors',
      collectionSlug: 'signature-gifts',
      price: 8900,
      compareAtPrice: 11000,
      shortDescription: 'Hand-carved brass arch mirror with crown filigree crest.',
      description: 'A grand focal piece for entryway consoles and bedroom vanities. The forged brass frame is burnished in antique gold and houses a bevel-edged float glass mirror.',
      material: 'Forged Brass & Beveled Float Glass',
      dimensions: '28" H x 18" W',
      weight: '3.4 kg',
      tags: 'vanity mirror, brass mirror, arch mirror, luxury gift',
      isFeatured: true,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Vintage Roman Numeral Silent-Sweep Wall Clock',
      slug: 'vintage-roman-numeral-silent-sweep-wall-clock',
      sku: 'AGC-DEC-004',
      categorySlug: 'clocks',
      collectionSlug: 'signature-gifts',
      price: 4600,
      compareAtPrice: 5800,
      shortDescription: 'Oversized 18-inch circular clock with antique brass finish and silent quartz motor.',
      description: 'No ticking sound. Features smooth continuous sweeping hands, raised Roman numerals, and an antique gold weathered iron rim. Runs on a single AA battery.',
      material: 'Powder-Coated Iron & Silent Quartz Movement',
      dimensions: '18" Diameter x 2" Deep',
      weight: '1.6 kg',
      tags: 'wall clock, roman numerals, silent clock, gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      name: 'Mirrored Glass & Gilded Brass Decorative Vanity Tray',
      slug: 'mirrored-glass-gilded-brass-decorative-vanity-tray',
      sku: 'AGC-DEC-005',
      categorySlug: 'trays',
      collectionSlug: 'signature-gifts',
      price: 3200,
      compareAtPrice: 4000,
      shortDescription: 'Polished mirrored base with ornate geometric brass gallery railing.',
      description: 'Organize perfumes, candle stands, jewelry, or welcome serving drinks to guests in regal style. Equipped with velvet padded feet to protect delicate furniture surfaces.',
      material: 'Mirrored Glass & Spun Brass',
      dimensions: '14" L x 9" W x 2" H',
      weight: '1.1 kg',
      tags: 'vanity tray, serving tray, brass tray, perfume tray, gift',
      isFeatured: false,
      isOnSale: true,
      images: [
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
  ]

  // Create products & relations
  for (const p of productsData) {
    const categoryId = categoryMap.get(p.categorySlug) || null
    const collectionId = collectionMap.get(p.collectionSlug) || null

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        shortDescription: p.shortDescription,
        description: p.description,
        material: p.material,
        dimensions: p.dimensions,
        weight: p.weight,
        tags: p.tags,
        isFeatured: p.isFeatured,
        isActive: true,
        isOnSale: p.isOnSale,
        categoryId: categoryId,
        metaTitle: `${p.name} | Afshan Gift Centre`,
        metaDescription: p.shortDescription,
        images: {
          create: p.images.map((img, idx) => ({
            url: img,
            alt: `${p.name} image ${idx + 1}`,
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
        reviews: {
          create: [
            {
              userId: demoCustomer.id,
              rating: 5,
              title: 'Exquisite gift quality!',
              comment: 'Ordered this for my sister’s wedding in Vehari. The packaging, finish, and delicate craftwork exceeded expectations. Highly recommend Afshan Gift Centre!',
              isApproved: true,
            },
          ],
        },
      },
    })

    if (collectionId) {
      await prisma.collectionProduct.create({
        data: {
          collectionId: collectionId,
          productId: product.id,
          sortOrder: 1,
        },
      })
    }
  }

  console.log(`Seeded ${productsData.length} dedicated Gift Centre products!`)

  // 6. Seed active promo codes
  await prisma.discount.upsert({
    where: { code: 'GIFT500' },
    update: {},
    create: {
      code: 'GIFT500',
      type: 'FIXED',
      value: 500,
      minOrderAmount: 3000,
      isActive: true,
    },
  })

  await prisma.discount.upsert({
    where: { code: 'AFSHAN10' },
    update: {},
    create: {
      code: 'AFSHAN10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 2000,
      isActive: true,
    },
  })

  console.log('✅ Afshan Gift Centre re-seeding completely finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
