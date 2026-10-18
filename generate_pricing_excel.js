
// Right Printers | Pricing Configuration Manager — Excel Export
// Run: node generate_pricing_excel.js

const XLSX = require('/tmp/xlsx_temp/node_modules/xlsx');
const path = require('path');

// ─── PRICING DATA (mirrored from app.js DEFAULT_PRICING) ───────────────────

const paperGsmRates = {
  '350': { '100x70': 1.44, '90x64': 1.40, '50x70': 1.00, '70x33': 1.50, '50x33': 1.40, 'A3': 4.50, 'A4': 2.50, 'Back Side': 2.50 },
  '300': { '100x70': 1.25, '90x64': 1.35, '50x70': 0.90, '70x33': 1.40, '50x33': 1.30, 'A3': 4.00, 'A4': 2.00, 'Back Side': 2.00 },
  '250': { '100x70': 1.00, '90x64': 1.00, '50x70': 0.55, '70x33': 1.20, '50x33': 1.00, 'A3': 3.50, 'A4': 2.50, 'Back Side': 2.00 },
  '150': { '100x70': 0.80, '90x64': 0.75, '50x70': 0.55, '70x33': 1.00, '50x33': 0.90, 'A3': 3.00, 'A4': 2.00, 'Back Side': 1.50 },
  '100': { '100x70': 0.70, '90x64': 0.65, '50x70': 0.45, '70x33': 0.95, '50x33': 0.80, 'A3': 2.50, 'A4': 2.00, 'Back Side': 1.50 }
};

const stickerRates = {
  'Paper Sticker': {
    '4 Color CYMK':    { '100x70': 24.00, '90x64': 20.00, '50x70': 16.00, '70x33': 12.00, '50x33': 9.00,  'A3': 6.00, 'A4': 4.00 },
    '5 Color CYMK+W':  { '100x70': 32.00, '90x64': 26.00, '50x70': 20.00, '70x33': 16.00, '50x33': 12.00, 'A3': 8.00, 'A4': 5.00 },
    'Clear Color':     { '100x70': 28.00, '90x64': 22.00, '50x70': 18.00, '70x33': 14.00, '50x33': 10.50, 'A3': 7.00, 'A4': 4.50 }
  },
  'PVC White': {
    '4 Color CYMK':    { '100x70': 48.00, '90x64': 40.00, '50x70': 32.00, '70x33': 24.00, '50x33': 18.00, 'A3': 12.00, 'A4': 8.00  },
    '5 Color CYMK+W':  { '100x70': 56.00, '90x64': 46.00, '50x70': 36.00, '70x33': 28.00, '50x33': 21.00, 'A3': 14.00, 'A4': 10.00 },
    'Clear Color':     { '100x70': 52.00, '90x64': 42.00, '50x70': 34.00, '70x33': 26.00, '50x33': 19.50, 'A3': 13.00, 'A4': 9.00  }
  },
  'PVC Transparent': {
    '4 Color CYMK':    { '100x70': 60.00, '90x64': 50.00, '50x70': 40.00, '70x33': 30.00, '50x33': 22.50, 'A3': 15.00, 'A4': 10.00 },
    '5 Color CYMK+W':  { '100x70': 60.00, '90x64': 50.00, '50x70': 40.00, '70x33': 30.00, '50x33': 22.50, 'A3': 15.00, 'A4': 10.00 },
    'Clear Color':     { '100x70': 60.00, '90x64': 50.00, '50x70': 40.00, '70x33': 30.00, '50x33': 22.50, 'A3': 15.00, 'A4': 10.00 }
  }
};

const laminationRates = {
  '100x70': 0.55, '90x64': 0.50, '50x70': 0.45,
  '50x35':  0.55, '70x33': 0.35, '50x33': 0.50,
  'A3':     0.40, 'A4':    0.30
};

const plotterTierRates = {
  'Tier 1 (1–24 sheets)':    3.50,
  'Tier 2 (25–149 sheets)':  3.00,
  'Tier 3 (150+ sheets)':    2.50
};

const uvRates = {
  '100x70': { 'Up to 500 Sheets': 275.00, 'Up to 1000 Sheets': 400.00 },
  '90x64':  { 'Up to 500 Sheets': 250.00, 'Up to 1000 Sheets': 375.00 },
  '50x70':  { 'Up to 500 Sheets': 185.00, 'Up to 1000 Sheets': 300.00 },
  '70x33':  { 'Up to 500 Sheets': 150.00, 'Up to 1000 Sheets': 250.00 },
  '50x33':  { 'Up to 500 Sheets': 150.00, 'Up to 1000 Sheets': 250.00 },
  '50x35':  { 'Up to 500 Sheets': 150.00, 'Up to 1000 Sheets': 250.00 },
  'A3':     { 'Up to 500 Sheets': 150.00, 'Up to 1000 Sheets': 250.00 },
  'A4':     { 'Up to 500 Sheets': 150.00, 'Up to 1000 Sheets': 250.00 }
};

const profitTiers = [
  { range: '1 – 99 pcs',        margin: 40 },
  { range: '100 – 324 pcs',     margin: 38 },
  { range: '325 – 449 pcs',     margin: 36 },
  { range: '450 – 1000 pcs',    margin: 30 },
  { range: '1250 – 3000 pcs',   margin: 27 },
  { range: '3500+ pcs',         margin: 25 }
];

const discountTiers = [
  { min: 0,    max: 450,   discount: 0 },
  { min: 500,  max: 1000,  discount: 0 },
  { min: 2500, max: 5000,  discount: 0 },
  { min: 6000, max: 10000, discount: 0 }
];

const quantityTiers = [
  { min: 1,    max: 3,        multiplier: 2.5  },
  { min: 4,    max: 10,       multiplier: 2.0  },
  { min: 11,   max: 25,       multiplier: 1.8  },
  { min: 26,   max: 50,       multiplier: 1.5  },
  { min: 51,   max: 75,       multiplier: 1.3  },
  { min: 76,   max: 99,       multiplier: 1.1  },
  { min: 100,  max: 249,      multiplier: 1.0  },
  { min: 250,  max: 500,      multiplier: 0.95 },
  { min: 501,  max: 1000,     multiplier: 0.90 },
  { min: 1001, max: 5000,     multiplier: 0.85 },
  { min: 5001, max: 'Infinity', multiplier: 0.80 }
];

const fixedRates = [
  { service: 'Design Charge',                  rate: 50.00,   unit: 'SR (per job)' },
  { service: 'Folding',                        rate: 0.30,    unit: 'SR / piece' },
  { service: 'Pasting',                        rate: 0.25,    unit: 'SR / piece' },
  { service: 'Bag Handle Rope',                rate: 0.12,    unit: 'SR / bag' },
  { service: 'Bag Ribbons Only',               rate: 1.00,    unit: 'SR / bag' },
  { service: 'Bag Ribbons with Print',         rate: 2.00,    unit: 'SR / bag (min 10 bags)' },
  { service: 'Packing',                        rate: 1.00,    unit: 'SR / 100 pcs packet' },
  { service: 'Business Card Print',            rate: 0.012,   unit: 'SR / piece' },
  { service: 'Business Card A3 Sheet (300G)',  rate: 0.75,    unit: 'SR / sheet' },
  { service: 'Business Card Polar Cut',        rate: 8.50,    unit: 'SR / 100 pcs pack' },
  { service: 'Cylinder Die Cutting',           rate: 0.35,    unit: 'SR / sheet' },
  { service: 'Manual Die Cutting',             rate: 0.40,    unit: 'SR / sheet' },
  { service: 'Die Board',                      rate: 150.00,  unit: 'SR / part' },
  { service: 'Offset Setup',                   rate: 250.00,  unit: 'SR (default)' },
  { service: 'Hot Foil Cleche',                rate: 0.81,    unit: 'SR / SQCM' },
  { service: 'Gold Foil Material',             rate: 0.0015,  unit: 'SR / SQCM' },
  { service: 'Rainbow Foil Material',          rate: 0.0038,  unit: 'SR / SQCM' },
  { service: 'Foil Impression',                rate: 0.25,    unit: 'SR / sheet' }
];

const offsetSetupRates = [
  { size: '100x70 cm', rate: 250.00 },
  { size: '90x64 cm',  rate: 250.00 },
  { size: '50x70 cm',  rate: 150.00 },
  { size: '50x35 cm',  rate: 100.00 }
];

const tshirtLaserRates  = { 'A3 Size': 50.00, 'A4 Size': 30.00 };
const tshirtTransferRates = { 'A3': 25.00, 'A4': 20.00, 'A5': 15.00, 'A6': 10.00 };
const tshirtClothSizeRates = {
  'Cotton':    { 'S': 20, 'M': 25, 'L': 30, 'XL': 35, 'XXL': 40, 'XXXL': 45 },
  'Polyester': { 'S': 15, 'M': 18, 'L': 22, 'XL': 26, 'XXL': 30, 'XXXL': 35 },
  'Linen':     { 'S': 25, 'M': 30, 'L': 35, 'XL': 40, 'XXL': 45, 'XXXL': 50 },
  'Flannel':   { 'S': 22, 'M': 27, 'L': 32, 'XL': 37, 'XXL': 42, 'XXXL': 47 },
  'Silk':      { 'S': 35, 'M': 42, 'L': 50, 'XL': 58, 'XXL': 65, 'XXXL': 75 },
  'Blends':    { 'S': 18, 'M': 22, 'L': 26, 'XL': 30, 'XXL': 35, 'XXXL': 40 }
};
const cupRates = [
  { type: 'Cup Base Cost',          rate: 15.00, unit: 'SR / cup' },
  { type: 'Full Part Transfer',     rate: 15.00, unit: 'SR / cup' },
  { type: 'Small Cup Transfer',     rate: 18.00, unit: 'SR / cup' }
];

// ─── HELPER: apply header style ─────────────────────────────────────────────
function hStyle(bold = true, bg = '0C153B', fg = 'FFFFFF', sz = 11) {
  return {
    font:      { bold, color: { rgb: fg }, sz },
    fill:      { fgColor: { rgb: bg } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
      right:  { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };
}

function numStyle(highlight = false) {
  return {
    font:      { sz: 10, bold: highlight, color: { rgb: highlight ? '7B3F00' : '1A1A1A' } },
    fill:      highlight ? { fgColor: { rgb: 'FFF9E6' } } : { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center' },
    numFmt:    '0.00##',
    border: {
      top:    { style: 'thin', color: { rgb: 'E5E5E5' } },
      bottom: { style: 'thin', color: { rgb: 'E5E5E5' } },
      left:   { style: 'thin', color: { rgb: 'E5E5E5' } },
      right:  { style: 'thin', color: { rgb: 'E5E5E5' } }
    }
  };
}

function labelStyle() {
  return {
    font:      { sz: 10, bold: true, color: { rgb: '1A1A1A' } },
    fill:      { fgColor: { rgb: 'F5F5F5' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top:    { style: 'thin', color: { rgb: 'E5E5E5' } },
      bottom: { style: 'thin', color: { rgb: 'E5E5E5' } },
      left:   { style: 'thin', color: { rgb: 'E5E5E5' } },
      right:  { style: 'thin', color: { rgb: 'E5E5E5' } }
    }
  };
}

function cell(v, s) { return { v, s, t: typeof v === 'number' ? 'n' : 's' }; }

// ─── SHEET 1: Paper GSM Rates ────────────────────────────────────────────────
function buildPaperSheet() {
  const sizes  = ['100x70', '90x64', '50x70', '70x33', '50x33', 'A3', 'A4', 'Back Side'];
  const gsms   = ['350', '300', '250', '150', '100'];
  const aoa    = [];
  const titleRow = ['GSM \\ Paper Size (cm)', ...sizes.map(s => s + ' cm')];
  aoa.push(titleRow.map(v => cell(v, hStyle(true, '0C153B', 'FFC800', 12))));
  gsms.forEach((gsm, i) => {
    const bg = i % 2 === 0 ? 'F9F9F9' : 'FFFFFF';
    const row = [cell(`${gsm} GSM`, { ...labelStyle(), fill: { fgColor: { rgb: bg } } })];
    sizes.forEach(s => {
      const v = paperGsmRates[gsm][s] ?? '';
      row.push(cell(v, { ...numStyle(), fill: { fgColor: { rgb: bg } } }));
    });
    aoa.push(row);
  });
  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(c => c.v)));
  // Apply cell styles
  aoa.forEach((row, R) => row.forEach((c, C) => {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[addr]) ws[addr] = {};
    ws[addr].s = c.s;
  }));
  ws['!cols'] = [{ wch: 22 }, ...sizes.map(() => ({ wch: 12 }))];
  return ws;
}

// ─── SHEET 2: Sticker Rates ──────────────────────────────────────────────────
function buildStickerSheet() {
  const sizes  = ['100x70', '90x64', '50x70', '70x33', '50x33', 'A3', 'A4'];
  const aoa    = [];
  const titleRow = ['Material', 'Print Type', ...sizes.map(s => s + ' cm (SR)')];
  aoa.push(titleRow.map(v => cell(v, hStyle(true, '0C153B', 'FFC800', 12))));
  Object.entries(stickerRates).forEach(([mat, colors]) => {
    Object.entries(colors).forEach(([clr, rates]) => {
      const row = [cell(mat, labelStyle()), cell(clr, labelStyle())];
      sizes.forEach(s => row.push(cell(rates[s] ?? '', numStyle())));
      aoa.push(row);
    });
  });
  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(c => c.v)));
  aoa.forEach((row, R) => row.forEach((c, C) => {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[addr]) ws[addr] = {};
    ws[addr].s = c.s;
  }));
  ws['!cols'] = [{ wch: 18 }, { wch: 18 }, ...sizes.map(() => ({ wch: 14 }))];
  return ws;
}

// ─── SHEET 3: Lamination & Plotter & UV ─────────────────────────────────────
function buildFinishingSheet() {
  const aoa = [];
  // Section A — Lamination
  aoa.push([cell('LAMINATION RATES — Cost per Sheet (SR)', hStyle(true, '1B4332', 'FFFFFF', 12))].concat(Array(Object.keys(laminationRates).length - 1).fill(cell('', hStyle(true, '1B4332', 'FFFFFF')))));
  aoa.push(Object.keys(laminationRates).map(s => cell(s + ' cm', hStyle(true, '40916C', 'FFFFFF'))));
  aoa.push(Object.values(laminationRates).map(v => cell(v, numStyle())));

  aoa.push([cell('', {})]);

  // Section B — Plotter
  aoa.push([cell('PLOTTER CUT RATES — Per Sheet (SR)', hStyle(true, '1B4332', 'FFFFFF', 12)), cell('', hStyle()), cell('', hStyle())]);
  aoa.push([cell('Quantity Tier', hStyle()), cell('Cost per Sheet (SR)', hStyle())]);
  Object.entries(plotterTierRates).forEach(([tier, rate]) => {
    aoa.push([cell(tier, labelStyle()), cell(rate, numStyle())]);
  });

  aoa.push([cell('', {})]);

  // Section C — UV Coating
  const uvSizes = Object.keys(uvRates);
  aoa.push([cell('UV COATING RATES (SR per Job)', hStyle(true, '1B4332', 'FFFFFF', 12))].concat(Array(uvSizes.length).fill(cell('', hStyle(true, '1B4332', 'FFFFFF')))));
  aoa.push([cell('Sheet Size'), ...uvSizes.map(s => cell(s + ' cm', hStyle()))]);
  ['Up to 500 Sheets', 'Up to 1000 Sheets'].forEach(tier => {
    const row = [cell(tier, labelStyle())];
    uvSizes.forEach(s => row.push(cell(uvRates[s][tier], numStyle())));
    aoa.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(c => c.v)));
  aoa.forEach((row, R) => row.forEach((c, C) => {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[addr]) ws[addr] = {};
    if (c.s) ws[addr].s = c.s;
  }));
  ws['!cols'] = [{ wch: 26 }, ...Array(10).fill({ wch: 14 })];
  return ws;
}

// ─── SHEET 4: Discounts & Profit Margins ────────────────────────────────────
function buildDiscountsSheet() {
  const aoa = [];
  aoa.push([cell('SHEET-BASED DISCOUNT TIERS', hStyle(true, '6B2737', 'FFC800', 12)), cell('', hStyle()), cell('', hStyle())]);
  aoa.push(['Min Sheets', 'Max Sheets', 'Discount %'].map(v => cell(v, hStyle())));
  discountTiers.forEach(t => aoa.push([cell(t.min, numStyle()), cell(t.max, numStyle()), cell(t.discount + '%', labelStyle())]));

  aoa.push([cell('', {})]);

  aoa.push([cell('PROFIT MARGIN TIERS (% added to final cost)', hStyle(true, '6B2737', 'FFC800', 12)), cell('', hStyle())]);
  aoa.push(['Quantity Range', 'Profit Margin %'].map(v => cell(v, hStyle())));
  profitTiers.forEach(t => aoa.push([cell(t.range, labelStyle()), cell(t.margin + '%', numStyle())]));

  aoa.push([cell('', {})]);

  aoa.push([cell('QUANTITY MULTIPLIER TIERS (Base: 100 pcs)', hStyle(true, '6B2737', 'FFC800', 12)), cell('', hStyle()), cell('', hStyle())]);
  aoa.push(['Min Qty', 'Max Qty', 'Multiplier'].map(v => cell(v, hStyle())));
  quantityTiers.forEach(t => aoa.push([cell(t.min, numStyle()), cell(String(t.max), numStyle()), cell(t.multiplier, numStyle())]));

  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(c => c.v)));
  aoa.forEach((row, R) => row.forEach((c, C) => {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[addr]) ws[addr] = {};
    if (c.s) ws[addr].s = c.s;
  }));
  ws['!cols'] = [{ wch: 24 }, { wch: 18 }, { wch: 16 }];
  return ws;
}

// ─── SHEET 5: Fixed Service Rates ───────────────────────────────────────────
function buildFixedRatesSheet() {
  const aoa = [];
  aoa.push([cell('FIXED SERVICE RATES', hStyle(true, '0C153B', 'FFC800', 12)), cell('', hStyle()), cell('', hStyle())]);
  aoa.push(['Service', 'Rate (SR)', 'Unit / Notes'].map(v => cell(v, hStyle())));
  fixedRates.forEach((r, i) => {
    const bg = i % 2 === 0 ? 'F9F9F9' : 'FFFFFF';
    aoa.push([
      cell(r.service, { ...labelStyle(), fill: { fgColor: { rgb: bg } } }),
      cell(r.rate,    { ...numStyle(),   fill: { fgColor: { rgb: bg } } }),
      cell(r.unit,    { ...labelStyle(), fill: { fgColor: { rgb: bg } } })
    ]);
  });

  aoa.push([cell('', {})]);
  aoa.push([cell('OFFSET SETUP RATES BY SIZE', hStyle(true, '0C153B', 'FFC800', 12)), cell('', hStyle())]);
  aoa.push(['Paper Size', 'Setup Cost (SR)'].map(v => cell(v, hStyle())));
  offsetSetupRates.forEach(r => aoa.push([cell(r.size, labelStyle()), cell(r.rate, numStyle())]));

  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(c => c.v)));
  aoa.forEach((row, R) => row.forEach((c, C) => {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[addr]) ws[addr] = {};
    if (c.s) ws[addr].s = c.s;
  }));
  ws['!cols'] = [{ wch: 32 }, { wch: 14 }, { wch: 30 }];
  return ws;
}

// ─── SHEET 6: T-Shirt & Cup Rates ───────────────────────────────────────────
function buildTshirtSheet() {
  const aoa = [];
  // Laser Print
  aoa.push([cell('T-SHIRT & CUP PRICING RATES', hStyle(true, '7C3AED', 'FFFFFF', 13)), cell('', hStyle(true, '7C3AED', 'FFFFFF'))]);
  aoa.push([cell('LASER PRINT COST', hStyle()), cell('Rate (SR)', hStyle())]);
  Object.entries(tshirtLaserRates).forEach(([sz, v]) => aoa.push([cell(sz, labelStyle()), cell(v, numStyle())]));

  aoa.push([cell('', {})]);

  // Transfer
  aoa.push([cell('T-SHIRT TRANSFER COST', hStyle()), cell('Rate (SR)', hStyle())]);
  Object.entries(tshirtTransferRates).forEach(([sz, v]) => aoa.push([cell(sz + ' Size', labelStyle()), cell(v, numStyle())]));

  aoa.push([cell('', {})]);

  // Cloth Size Rates
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  aoa.push([cell('GARMENT COST BY CLOTH TYPE & SIZE (SR)', hStyle(true, '7C3AED', 'FFFFFF', 12))].concat(sizes.map(() => cell('', hStyle(true, '7C3AED', 'FFFFFF')))));
  aoa.push([cell('Cloth Type', hStyle()), ...sizes.map(s => cell(s, hStyle()))]);
  Object.entries(tshirtClothSizeRates).forEach(([cloth, rates]) => {
    aoa.push([cell(cloth, labelStyle()), ...sizes.map(s => cell(rates[s], numStyle()))]);
  });

  aoa.push([cell('', {})]);

  // Cup Rates
  aoa.push([cell('CUP RATES', hStyle()), cell('Rate (SR)', hStyle()), cell('Unit', hStyle())]);
  cupRates.forEach(r => aoa.push([cell(r.type, labelStyle()), cell(r.rate, numStyle()), cell(r.unit, labelStyle())]));

  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(c => c.v)));
  aoa.forEach((row, R) => row.forEach((c, C) => {
    const addr = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[addr]) ws[addr] = {};
    if (c.s) ws[addr].s = c.s;
  }));
  ws['!cols'] = [{ wch: 28 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 18 }];
  return ws;
}

// ─── BUILD WORKBOOK ──────────────────────────────────────────────────────────
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, buildPaperSheet(),     '📄 Paper GSM Rates');
XLSX.utils.book_append_sheet(wb, buildStickerSheet(),   '🏷️ Sticker Rates');
XLSX.utils.book_append_sheet(wb, buildFinishingSheet(), '✨ Lamination-Plotter-UV');
XLSX.utils.book_append_sheet(wb, buildDiscountsSheet(), '💰 Discounts & Margins');
XLSX.utils.book_append_sheet(wb, buildFixedRatesSheet(),'🔧 Fixed Service Rates');
XLSX.utils.book_append_sheet(wb, buildTshirtSheet(),    '👕 T-Shirt & Cup');

const outPath = path.join(__dirname, 'Right_Printers_Pricing_Config.xlsx');
XLSX.writeFile(wb, outPath, { cellStyles: true, bookType: 'xlsx' });
console.log('✅  Excel file generated:', outPath);
