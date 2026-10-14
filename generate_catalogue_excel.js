const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createMasterCatalogue() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Afshan Gift Centre - Catalog Team';
  workbook.created = new Date();

  // Color Palette & Styles
  const primaryHeaderFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2C2C2C' }, // Charcoal
  };
  const secondaryHeaderFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFB8956A' }, // Accent Gold
  };
  const alertHeaderFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8C2D2D' }, // Dark Red
  };
  const headerFont = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' },
  };
  const totalRowFont = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FF000000' },
  };
  const borderStyle = {
    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    right: { style: 'thin', color: { argb: 'FFD3D3D3' } },
  };

  // ==========================================
  // SHEET 1: Master Product Catalogue
  // ==========================================
  const wsMaster = workbook.addWorksheet('Master Product Catalogue', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  wsMaster.columns = [
    { header: 'Product ID', key: 'id', width: 14 },
    { header: 'Product Name', key: 'name', width: 28 },
    { header: 'SKU Code', key: 'sku', width: 20 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Original Price', key: 'origPrice', width: 16 },
    { header: 'Selling Price', key: 'sellPrice', width: 16 },
    { header: 'Stock Quantity', key: 'stock', width: 16 },
    { header: 'Material', key: 'material', width: 28 },
    { header: 'Colour', key: 'colour', width: 24 },
    { header: 'Shape', key: 'shape', width: 24 },
    { header: 'Design', key: 'design', width: 32 },
    { header: 'Size / Dimensions', key: 'size', width: 24 },
    { header: 'Short Description', key: 'desc', width: 45 },
    { header: 'Subcategories / Variants', key: 'variants', width: 45 },
    { header: 'Data Verification Notes', key: 'notes', width: 45 },
  ];

  const masterRows = [
    {
      id: 'PROD-001',
      name: 'Alarm Clock',
      sku: 'AQC-SKU-005',
      category: 'Clock',
      origPrice: 3000,
      sellPrice: 2500,
      stock: 23,
      material: 'Metal',
      colour: 'Black, Gold, White',
      shape: 'Not Provided',
      design: 'Not Provided',
      size: 'Not Provided',
      desc: 'Not Provided',
      variants: 'Not Provided',
      notes: 'SKU (AQC-SKU-005) duplicated with Product 2, 7; Original & Selling Prices flagged as Needs Confirmation.',
    },
    {
      id: 'PROD-002',
      name: '3D Light Photo Frame',
      sku: 'AQC-SKU-005',
      category: 'Frame 3D',
      origPrice: 2500,
      sellPrice: 1500,
      stock: 20,
      material: 'Mirror, lights, reflective back',
      colour: 'All colours available',
      shape: 'Not Provided',
      design: '3D light photo frame',
      size: 'Not Provided',
      desc: 'Decorative 3D photo frame featuring lights and a reflective back.',
      variants: 'Not Provided',
      notes: 'SKU (AQC-SKU-005) flagged as Needs Confirmation; possible duplicate with Product 1, 7.',
    },
    {
      id: 'PROD-003',
      name: 'Crystal Globe Jar',
      sku: 'AQC-DEC-005',
      category: 'Crystal Jar',
      origPrice: 3200,
      sellPrice: 2500,
      stock: 25,
      material: 'Metal and crystal',
      colour: 'Transparent; golden colour noted',
      shape: 'Globe',
      design: 'Crystal globe jar',
      size: 'Not Provided',
      desc: 'Decorative crystal globe jar with metal components.',
      variants: 'Dry Fruit Crystal Jar; Globe Candy Jar with Lid',
      notes: 'SKU (AQC-DEC-005) duplicated across Products 4, 5, 6, 8; Packaging Note: 2 pieces / 1 set Needs Confirmation.',
    },
    {
      id: 'PROD-004',
      name: 'Cage Plant Holder',
      sku: 'AQC-DEC-005',
      category: 'Plant Holders / Stand',
      origPrice: 3000,
      sellPrice: 2400,
      stock: 20,
      material: 'Metal',
      colour: 'Not Provided',
      shape: 'Tall vase shape; round shape',
      design: 'Decorative cage-style plant holder',
      size: 'Not Provided',
      desc: 'Metal plant holder designed for decorative plant displays.',
      variants: 'Tall Vase Shape; Round Shape',
      notes: 'SKU (AQC-DEC-005) Needs Confirmation (duplicated with Products 3, 5, 6, 8). Colour not specified.',
    },
    {
      id: 'PROD-005',
      name: 'Plant Leafs',
      sku: 'AQC-DEC-005',
      category: 'Artificial Leaves',
      origPrice: 6000,
      sellPrice: 4500,
      stock: 50,
      material: 'Not Clearly Provided',
      colour: 'Not Provided',
      shape: 'Different plant and leaf shapes',
      design: 'Artificial decorative plants and trees',
      size: 'Not Provided',
      desc: 'Artificial decorative plants, leaves, and ornamental trees for home decoration.',
      variants: 'Artificial Banana Leaf Plant with White Pot; Artificial Banana Leaf Plant with Black Pot; Rustic Floor Plant Pot; Luxury Plant Pot; Artificial Pink Maple Leaf Tree; Yellow Cherry Blossom Tree; Pink Cherry Blossom Tree; Red Cherry Blossom Tree; Variegated Ficus Tree with Tall Vine; Bamboo Tree Leaf; Money Plant Tree; Palm Leaves',
      notes: 'Material not clearly provided. Total 12 subcategories/variants listed; SKU (AQC-DEC-005) Needs Confirmation.',
    },
    {
      id: 'PROD-006',
      name: 'Lamp',
      sku: 'AQC-DEC-005',
      category: 'Lamps',
      origPrice: 7000,
      sellPrice: 5000,
      stock: 50,
      material: 'Wood / metal with fabric pleated shade',
      colour: 'Black and brown shade',
      shape: 'Square / block',
      design: 'Electric floor lamp',
      size: 'Not Provided',
      desc: 'Decorative electric floor lamp featuring a fabric pleated shade and a square or block-style design.',
      variants: '3D Wave Table Lamp; 3D Twisted Leaf Table Lamp; Crystal Glass Table Lamp',
      notes: 'Floor lamp vs Table lamp variants noted; SKU (AQC-DEC-005) Needs Confirmation.',
    },
    {
      id: 'PROD-007',
      name: 'Planter',
      sku: 'AQC-SKU-005',
      category: 'Planters',
      origPrice: 6000,
      sellPrice: 5200,
      stock: 30,
      material: 'Ficus trees / leaves noted — Needs Confirmation',
      colour: 'Not Provided',
      shape: 'Not Provided',
      design: 'Decorative planter and artificial plant arrangements',
      size: 'Not Provided',
      desc: 'Decorative planters and artificial plant arrangements for interior decoration.',
      variants: 'Rustic Floor Plant Pot; Pink Maple Leaf; Yellow Cherry Blossom; Ficus Tree; Money Plant; Cycle Flower; Galaxy Rose Dome; Cycle Planter; Golden Cycle Flower Pot',
      notes: 'Material is marked Needs Confirmation (leaves noted as material in notes). SKU (AQC-SKU-005) Needs Confirmation.',
    },
    {
      id: 'PROD-008',
      name: 'Metal Candle Holder',
      sku: 'AQC-DEC-005',
      category: 'Candle Stands',
      origPrice: 4000,
      sellPrice: 3200,
      stock: 20,
      material: 'Metal and crystal',
      colour: 'Golden',
      shape: 'Tall stand with round base',
      design: 'Three-piece set in small, medium, and large sizes',
      size: 'Handwritten as approx. 14L × 7W × 2? × H? — Needs Confirmation',
      desc: 'Decorative metal and crystal candle holder set with a gold finish and three different sizes.',
      variants: 'Crystal Glass Candle Holder; Crystal Flower Candle Holder; Bird Crystal Candle Holder; Double Heart Crystal Candle Holder; 3-Arm Swirl Crystal Candle Holder; Triple Heart Candle Holder; Crystal Flowers Candle Holder; Metal Taper',
      notes: 'Dimensions handwritten and uncertain (14L × 7W × 2? × H?). SKU (AQC-DEC-005) Needs Confirmation.',
    },
    {
      id: 'PROD-009',
      name: 'Metal Tissue Box – Gold Edition',
      sku: 'AGC-DEC-005',
      category: 'Tissue Boxes',
      origPrice: 3200,
      sellPrice: 2500,
      stock: 25,
      material: 'Metal',
      colour: 'Golden',
      shape: 'Rectangular',
      design: 'Embossed Border',
      size: 'Not Provided',
      desc: 'Elegant gold metal tissue box with a rectangular shape and embossed decorative border. Ideal for living rooms, bedrooms, and offices.',
      variants: 'Golden Metal Tissue Box; Crystal Tissue Box Cover; Luxury Golden Tissue Box',
      notes: 'Standard confirmed SKU prefix AGC-DEC-005. Dimensions not specified.',
    },
    {
      id: 'PROD-010',
      name: 'Decorative Flower Vase / Pot',
      sku: 'AGC-DEC-005',
      category: 'Pots / Vases',
      origPrice: 2200,
      sellPrice: 1500,
      stock: 35,
      material: 'Fiber and metal',
      colour: 'Not Specified',
      shape: 'Round',
      design: 'Empty Decorative Pot',
      size: 'Not Provided',
      desc: 'Stylish round decorative pot made from fiber and metal. Suitable for artificial flowers and home decoration.',
      variants: 'Decorative Flower Pots; Round Decorative Pots; Luxury Flower Vases',
      notes: 'SKU AGC-DEC-005 matches Product 9 SKU; flagged for confirmation.',
    },
    {
      id: 'PROD-011',
      name: '3D Floral Wall Decor Frame',
      sku: 'Not Provided',
      category: 'Wall Frames',
      origPrice: 5200,
      sellPrice: 4500,
      stock: 30,
      material: 'Metal',
      colour: 'Black, Light Gold',
      shape: 'Not Specified',
      design: '3D Flowers',
      size: 'Not Provided',
      desc: 'Decorative metal wall frame featuring a 3D floral design, available in black and light gold finishes. Suitable for living rooms, bedrooms, and hallways.',
      variants: '3D Butterfly Wall Frame – Colorful; Vintage Car Wall Frame; Fish Wall Frame; Lions / Lion Wall Frame; 3D Flower Vase Wall Frame',
      notes: 'SKU is Not Provided in source data. Requires assignment.',
    },
  ];

  masterRows.forEach((r) => {
    const row = wsMaster.addRow(r);
    row.getCell('origPrice').numFmt = '#,##0';
    row.getCell('sellPrice').numFmt = '#,##0';
    row.getCell('stock').numFmt = '#,##0';
    row.alignment = { vertical: 'top', wrapText: true };
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = borderStyle;
    });
  });

  // Master Header Styling & AutoFilter
  wsMaster.getRow(1).eachCell((cell) => {
    cell.fill = primaryHeaderFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = borderStyle;
  });
  wsMaster.getRow(1).height = 26;
  wsMaster.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: masterRows.length + 1, column: 15 },
  };

  // ==========================================
  // SHEET 2: Inventory Summary
  // ==========================================
  const wsInv = workbook.addWorksheet('Inventory Summary', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  wsInv.columns = [
    { header: 'Product ID', key: 'id', width: 14 },
    { header: 'Product Name', key: 'name', width: 32 },
    { header: 'SKU Code', key: 'sku', width: 22 },
    { header: 'Category', key: 'category', width: 22 },
    { header: 'Stock Quantity', key: 'stock', width: 18 },
    { header: 'Original Price (PKR)', key: 'origPrice', width: 22 },
    { header: 'Selling Price (PKR)', key: 'sellPrice', width: 22 },
    { header: 'Stock Value at Selling Price (PKR)', key: 'stockValue', width: 34 },
    { header: 'Potential Value at Original Price (PKR)', key: 'origValue', width: 36 },
  ];

  masterRows.forEach((p, idx) => {
    const rowNum = idx + 2;
    const row = wsInv.addRow({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stock: p.stock,
      origPrice: p.origPrice,
      sellPrice: p.sellPrice,
      stockValue: { formula: `E${rowNum}*G${rowNum}`, result: p.stock * p.sellPrice },
      origValue: { formula: `E${rowNum}*F${rowNum}`, result: p.stock * p.origPrice },
    });

    row.getCell('stock').numFmt = '#,##0';
    row.getCell('origPrice').numFmt = 'Rs #,##0';
    row.getCell('sellPrice').numFmt = 'Rs #,##0';
    row.getCell('stockValue').numFmt = 'Rs #,##0';
    row.getCell('origValue').numFmt = 'Rs #,##0';
    row.alignment = { vertical: 'middle', wrapText: true };
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = borderStyle;
    });
  });

  // Summary Row at Bottom
  const totalRowNum = masterRows.length + 2;
  const summaryRow = wsInv.addRow({
    id: 'TOTAL',
    name: 'Total Inventory Portfolio',
    sku: '-',
    category: '11 Product Lines',
    stock: { formula: `SUM(E2:E${totalRowNum - 1})`, result: 318 },
    origPrice: { formula: `AVERAGE(F2:F${totalRowNum - 1})`, result: 4100 },
    sellPrice: { formula: `AVERAGE(G2:G${totalRowNum - 1})`, result: 3254.55 },
    stockValue: { formula: `SUM(H2:H${totalRowNum - 1})`, result: 1111500 },
    origValue: { formula: `SUM(I2:I${totalRowNum - 1})`, result: 1416000 },
  });

  summaryRow.font = totalRowFont;
  summaryRow.height = 24;
  summaryRow.getCell('stock').numFmt = '#,##0';
  summaryRow.getCell('origPrice').numFmt = 'Rs #,##0';
  summaryRow.getCell('sellPrice').numFmt = 'Rs #,##0';
  summaryRow.getCell('stockValue').numFmt = 'Rs #,##0';
  summaryRow.getCell('origValue').numFmt = 'Rs #,##0';
  summaryRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF5F0EB' }, // Cream
    };
    cell.border = {
      top: { style: 'double', color: { argb: 'FF2C2C2C' } },
      bottom: { style: 'double', color: { argb: 'FF2C2C2C' } },
      left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      right: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    };
  });

  // Header formatting
  wsInv.getRow(1).eachCell((cell) => {
    cell.fill = primaryHeaderFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = borderStyle;
  });
  wsInv.getRow(1).height = 26;
  wsInv.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: totalRowNum - 1, column: 9 },
  };

  // ==========================================
  // SHEET 3: Categories and Subcategories
  // ==========================================
  const wsCat = workbook.addWorksheet('Categories and Subcategories', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  wsCat.columns = [
    { header: 'Product ID', key: 'id', width: 14 },
    { header: 'Parent Product Name', key: 'parentName', width: 30 },
    { header: 'Main Category', key: 'category', width: 22 },
    { header: 'Subcategory / Variant Name', key: 'subName', width: 44 },
    { header: 'Variant Type', key: 'type', width: 22 },
    { header: 'Stock Status Note', key: 'stockNote', width: 36 },
  ];

  const categoryMappings = [
    // Product 1
    { id: 'PROD-001', parentName: 'Alarm Clock', category: 'Clock', subName: 'Not Provided (Single Model)', type: 'Standard Product', stockNote: 'Parent stock: 23 units' },
    // Product 2
    { id: 'PROD-002', parentName: '3D Light Photo Frame', category: 'Frame 3D', subName: 'Not Provided (Multi-colour)', type: 'Colour Variation', stockNote: 'Parent stock: 20 units' },
    // Product 3
    { id: 'PROD-003', parentName: 'Crystal Globe Jar', category: 'Crystal Jar', subName: 'Dry Fruit Crystal Jar', type: 'Design / Usage Variant', stockNote: 'Subcategory of 25 unit parent lot' },
    { id: 'PROD-003', parentName: 'Crystal Globe Jar', category: 'Crystal Jar', subName: 'Globe Candy Jar with Lid', type: 'Design / Usage Variant', stockNote: 'Subcategory of 25 unit parent lot' },
    // Product 4
    { id: 'PROD-004', parentName: 'Cage Plant Holder', category: 'Plant Holders / Stand', subName: 'Tall Vase Shape', type: 'Shape Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-004', parentName: 'Cage Plant Holder', category: 'Plant Holders / Stand', subName: 'Round Shape', type: 'Shape Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    // Product 5
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Artificial Banana Leaf Plant with White Pot', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Artificial Banana Leaf Plant with Black Pot', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Rustic Floor Plant Pot', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Luxury Plant Pot', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Artificial Pink Maple Leaf Tree', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Yellow Cherry Blossom Tree', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Pink Cherry Blossom Tree', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Red Cherry Blossom Tree', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Variegated Ficus Tree with Tall Vine', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Bamboo Tree Leaf', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Money Plant Tree', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-005', parentName: 'Plant Leafs', category: 'Artificial Leaves', subName: 'Palm Leaves', type: 'Botanical Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    // Product 6
    { id: 'PROD-006', parentName: 'Lamp', category: 'Lamps', subName: '3D Wave Table Lamp', type: 'Style / Model Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-006', parentName: 'Lamp', category: 'Lamps', subName: '3D Twisted Leaf Table Lamp', type: 'Style / Model Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    { id: 'PROD-006', parentName: 'Lamp', category: 'Lamps', subName: 'Crystal Glass Table Lamp', type: 'Style / Model Variant', stockNote: 'Subcategory of 50 unit parent lot' },
    // Product 7
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Rustic Floor Plant Pot', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Pink Maple Leaf', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Yellow Cherry Blossom', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Ficus Tree', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Money Plant', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Cycle Flower', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Galaxy Rose Dome', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Cycle Planter', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-007', parentName: 'Planter', category: 'Planters', subName: 'Golden Cycle Flower Pot', type: 'Arrangement Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    // Product 8
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Crystal Glass Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Crystal Flower Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Bird Crystal Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Double Heart Crystal Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: '3-Arm Swirl Crystal Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Triple Heart Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Crystal Flowers Candle Holder', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    { id: 'PROD-008', parentName: 'Metal Candle Holder', category: 'Candle Stands', subName: 'Metal Taper', type: 'Design Variant', stockNote: 'Subcategory of 20 unit parent lot' },
    // Product 9
    { id: 'PROD-009', parentName: 'Metal Tissue Box – Gold Edition', category: 'Tissue Boxes', subName: 'Golden Metal Tissue Box', type: 'Style Variant', stockNote: 'Subcategory of 25 unit parent lot' },
    { id: 'PROD-009', parentName: 'Metal Tissue Box – Gold Edition', category: 'Tissue Boxes', subName: 'Crystal Tissue Box Cover', type: 'Style Variant', stockNote: 'Subcategory of 25 unit parent lot' },
    { id: 'PROD-009', parentName: 'Metal Tissue Box – Gold Edition', category: 'Tissue Boxes', subName: 'Luxury Golden Tissue Box', type: 'Style Variant', stockNote: 'Subcategory of 25 unit parent lot' },
    // Product 10
    { id: 'PROD-010', parentName: 'Decorative Flower Vase / Pot', category: 'Pots / Vases', subName: 'Decorative Flower Pots', type: 'Category Sub-type', stockNote: 'Subcategory of 35 unit parent lot' },
    { id: 'PROD-010', parentName: 'Decorative Flower Vase / Pot', category: 'Pots / Vases', subName: 'Round Decorative Pots', type: 'Category Sub-type', stockNote: 'Subcategory of 35 unit parent lot' },
    { id: 'PROD-010', parentName: 'Decorative Flower Vase / Pot', category: 'Pots / Vases', subName: 'Luxury Flower Vases', type: 'Category Sub-type', stockNote: 'Subcategory of 35 unit parent lot' },
    // Product 11
    { id: 'PROD-011', parentName: '3D Floral Wall Decor Frame', category: 'Wall Frames', subName: '3D Butterfly Wall Frame – Colorful', type: 'Design Motif Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-011', parentName: '3D Floral Wall Decor Frame', category: 'Wall Frames', subName: 'Vintage Car Wall Frame', type: 'Design Motif Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-011', parentName: '3D Floral Wall Decor Frame', category: 'Wall Frames', subName: 'Fish Wall Frame', type: 'Design Motif Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-011', parentName: '3D Floral Wall Decor Frame', category: 'Wall Frames', subName: 'Lions / Lion Wall Frame', type: 'Design Motif Variant', stockNote: 'Subcategory of 30 unit parent lot' },
    { id: 'PROD-011', parentName: '3D Floral Wall Decor Frame', category: 'Wall Frames', subName: '3D Flower Vase Wall Frame', type: 'Design Motif Variant', stockNote: 'Subcategory of 30 unit parent lot' },
  ];

  categoryMappings.forEach((c) => {
    const row = wsCat.addRow(c);
    row.alignment = { vertical: 'middle', wrapText: true };
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = borderStyle;
    });
  });

  wsCat.getRow(1).eachCell((cell) => {
    cell.fill = secondaryHeaderFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = borderStyle;
  });
  wsCat.getRow(1).height = 26;
  wsCat.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: categoryMappings.length + 1, column: 6 },
  };

  // ==========================================
  // SHEET 4: Data Verification
  // ==========================================
  const wsVer = workbook.addWorksheet('Data Verification', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  wsVer.columns = [
    { header: 'Issue ID', key: 'issueId', width: 12 },
    { header: 'Product ID', key: 'prodId', width: 14 },
    { header: 'Product Name', key: 'prodName', width: 28 },
    { header: 'Field with Discrepancy', key: 'field', width: 24 },
    { header: 'Provided Value in Source', key: 'currentValue', width: 34 },
    { header: 'Audit Issue & Verification Required', key: 'issueDesc', width: 50 },
    { header: 'Recommended Action', key: 'action', width: 44 },
    { header: 'Status', key: 'status', width: 20 },
  ];

  const verificationIssues = [
    {
      issueId: 'ISSUE-01',
      prodId: 'PROD-001',
      prodName: 'Alarm Clock',
      field: 'SKU / Code',
      currentValue: 'AQC-SKU-005',
      issueDesc: 'Flagged in source notes as "Needs Confirmation". Also conflicts with Product 2 and Product 7 who share identical SKU.',
      action: 'Assign unique SKU (e.g., AGC-CLK-001) upon owner verification.',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-02',
      prodId: 'PROD-001',
      prodName: 'Alarm Clock',
      field: 'Original & Selling Price',
      currentValue: 'Orig: 3000 / Sell: 2500',
      issueDesc: 'Both original price (3,000) and selling price (2,500) explicitly flagged in source notes as "Needs Confirmation".',
      action: 'Confirm retail and promo wholesale pricing with showroom manager.',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-03',
      prodId: 'PROD-002',
      prodName: '3D Light Photo Frame',
      field: 'SKU / Code',
      currentValue: 'AQC-SKU-005',
      issueDesc: 'Marked "Needs Confirmation". Duplicates SKU with Product 1 (Alarm Clock) and Product 7 (Planter).',
      action: 'Assign distinct SKU (e.g., AGC-FRM-002).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-04',
      prodId: 'PROD-003',
      prodName: 'Crystal Globe Jar',
      field: 'SKU / Code',
      currentValue: 'AQC-DEC-005',
      issueDesc: 'Marked "Needs Confirmation". Shares duplicate SKU with Products 4, 5, 6, and 8.',
      action: 'Assign dedicated SKU (e.g., AGC-JAR-003).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-05',
      prodId: 'PROD-003',
      prodName: 'Crystal Globe Jar',
      field: 'Packaging / Set Count',
      currentValue: '2 pieces / 1 set',
      issueDesc: 'Source notes state "Packaging Note: 2 pieces / 1 set — Needs Confirmation". Stock is 25 sets or 25 pieces?',
      action: 'Verify whether stock quantity of 25 refers to 25 single pieces or 25 paired boxed sets.',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-06',
      prodId: 'PROD-004',
      prodName: 'Cage Plant Holder',
      field: 'SKU / Code',
      currentValue: 'AQC-DEC-005',
      issueDesc: 'Marked "Needs Confirmation". Overlaps with Crystal Jar, Plant Leafs, Lamp, and Candle Holder.',
      action: 'Assign dedicated SKU (e.g., AGC-HLD-004).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-07',
      prodId: 'PROD-004',
      prodName: 'Cage Plant Holder',
      field: 'Colour',
      currentValue: 'Not Provided',
      issueDesc: 'Metal finish (e.g., Antique Gold, Matte Black, White) is not specified.',
      action: 'Inspect physical inventory and log metal finish colours.',
      status: 'Not Provided',
    },
    {
      issueId: 'ISSUE-08',
      prodId: 'PROD-005',
      prodName: 'Plant Leafs',
      field: 'SKU / Code',
      currentValue: 'AQC-DEC-005',
      issueDesc: 'Shares duplicate SKU across multiple unrelated products; flagged in source notes.',
      action: 'Assign dedicated parent SKU (e.g., AGC-BOT-005).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-09',
      prodId: 'PROD-005',
      prodName: 'Plant Leafs',
      field: 'Material',
      currentValue: 'Not Clearly Provided',
      issueDesc: 'Material is explicitly listed as "Not Clearly Provided" in source data.',
      action: 'Confirm if leaves are silk, poly-fabric, real-touch polyurethane, or coated plastic.',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-10',
      prodId: 'PROD-006',
      prodName: 'Lamp',
      field: 'SKU / Code',
      currentValue: 'AQC-DEC-005',
      issueDesc: 'Shares duplicate code with 4 other decor items.',
      action: 'Assign dedicated lighting SKU (e.g., AGC-LMP-006).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-11',
      prodId: 'PROD-006',
      prodName: 'Lamp',
      field: 'Design vs Subcategories Conflict',
      currentValue: 'Design: Floor Lamp / Sub: Table Lamps',
      issueDesc: 'Main design notes state "Electric floor lamp", while subcategories list "3D Wave Table Lamp", "3D Twisted Leaf Table Lamp", and "Crystal Glass Table Lamp".',
      action: 'Clarify whether the 50 in-stock units are Floor Lamps or an assortment of Table Lamps.',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-12',
      prodId: 'PROD-007',
      prodName: 'Planter',
      field: 'SKU / Code',
      currentValue: 'AQC-SKU-005',
      issueDesc: 'Duplicates SKU with Alarm Clock (Prod 1) and 3D Light Frame (Prod 2).',
      action: 'Assign dedicated planter SKU (e.g., AGC-PLT-007).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-13',
      prodId: 'PROD-007',
      prodName: 'Planter',
      field: 'Material',
      currentValue: 'Ficus trees / leaves noted',
      issueDesc: 'Source notes state "Ficus trees / leaves noted — Needs Confirmation". Leaves are a plant type, not pot construction material.',
      action: 'Specify actual pot material (Ceramic, Metal, Iron, Plastic, Terracotta).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-14',
      prodId: 'PROD-008',
      prodName: 'Metal Candle Holder',
      field: 'SKU / Code',
      currentValue: 'AQC-DEC-005',
      issueDesc: 'Shares duplicate code with Products 3, 4, 5, 6.',
      action: 'Assign dedicated candle stand SKU (e.g., AGC-CND-008).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-15',
      prodId: 'PROD-008',
      prodName: 'Metal Candle Holder',
      field: 'Size / Dimensions',
      currentValue: '14L × 7W × 2? × H?',
      issueDesc: 'Dimensions handwritten and uncertain in source notes ("approximately 14L × 7W × 2? × H? — Needs Confirmation").',
      action: 'Measure the height and base width of small, medium, and large stands.',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-16',
      prodId: 'PROD-010',
      prodName: 'Decorative Flower Vase / Pot',
      field: 'SKU Code',
      currentValue: 'AGC-DEC-005',
      issueDesc: 'Flagged in source notes as Needs Confirmation; duplicates SKU with Product 9 (Metal Tissue Box – Gold Edition).',
      action: 'Assign dedicated vase/pot SKU (e.g., AGC-POT-010).',
      status: 'Needs Confirmation',
    },
    {
      issueId: 'ISSUE-17',
      prodId: 'PROD-011',
      prodName: '3D Floral Wall Decor Frame',
      field: 'SKU Code',
      currentValue: 'Not Provided',
      issueDesc: 'SKU Code is completely absent ("Not Provided") in source data.',
      action: 'Assign new unique SKU code (e.g., AGC-WDF-011).',
      status: 'Not Provided',
    },
  ];

  verificationIssues.forEach((v) => {
    const row = wsVer.addRow(v);
    row.alignment = { vertical: 'top', wrapText: true };
    const statusCell = row.getCell('status');
    if (v.status === 'Needs Confirmation') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF3CD' }, // Light Amber
      };
      statusCell.font = { color: { argb: 'FF856404' }, bold: true };
    } else {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8D7DA' }, // Light Red
      };
      statusCell.font = { color: { argb: 'FF721C24' }, bold: true };
    }
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = borderStyle;
    });
  });

  wsVer.getRow(1).eachCell((cell) => {
    cell.fill = alertHeaderFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = borderStyle;
  });
  wsVer.getRow(1).height = 26;
  wsVer.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: verificationIssues.length + 1, column: 8 },
  };

  // Ensure output directory in public folder and workspace root
  const outputPathRoot = path.join('c:', 'Users', 'HP', 'Desktop', 'sadiaproject', 'Complete_Product_Catalogue.xlsx');
  const outputPathPublic = path.join('c:', 'Users', 'HP', 'Desktop', 'sadiaproject', 'public', 'Complete_Product_Catalogue.xlsx');

  await workbook.xlsx.writeFile(outputPathRoot);
  await workbook.xlsx.writeFile(outputPathPublic);

  console.log(`Excel created successfully at:\n- ${outputPathRoot}\n- ${outputPathPublic}`);
}

createMasterCatalogue().catch(console.error);
