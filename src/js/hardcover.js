/**
 * Digital Printing Press Cost Estimator - Right Printers
 * Hardcover Luxury Boxes Estimator Logic (src/js/hardcover.js)
 */

const DEFAULT_HARDCOVER_PRICING = {
  rigidBoardRates: {
    '800': 3.50,   // 800 GSM = 3.50 SR / sheet (100x70)
    '1000': 4.50,  // 1000 GSM = 4.50 SR / sheet (100x70)
    '1200': 5.00,  // 1200 GSM = 5.00 SR / sheet (100x70)
    '2000': 6.00   // 2000 GSM = 6.00 SR / sheet (100x70)
  },
  wrappingPaper150: 0.75, // per 100x70 cm sheet
  wrappingPrint: {
    '100x70': { setup: 250.00, run1000: 200.00 },
    '50x70':  { setup: 150.00, run1000: 100.00 }
  },
  manualLabor: {
    hourlyRate: 15.00, // SR per hour (labor + glue)
    defaultSpeed: 20   // boxes per hour per worker
  },
  machineLabor: {
    setupCost: 250.00, // SR setup
    hourlyRate: 100.00,// SR per hour (machine + operator + glue)
    defaultSpeed: 300  // boxes per hour
  },
  profitMargin: 30 // default 30% profit margin
};

let hardcoverPricing = JSON.parse(JSON.stringify(DEFAULT_HARDCOVER_PRICING));
let selectedRigidGsm = '1200';
let selectedBoxMakingMethod = 'manual'; // 'manual' or 'machine'
let selectedWrappingPrintSize = '100x70'; // '100x70' or '50x70'
let activePreviewTab = 'board'; // 'board' or 'wrapping'

// Load stored pricing from localStorage
function loadHardcoverPricing() {
  const stored = localStorage.getItem('right_printers_hardcover_pricing_v1');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      hardcoverPricing = Object.assign({}, DEFAULT_HARDCOVER_PRICING, parsed);
    } catch (e) {
      console.error("Error reading stored hardcover pricing:", e);
      hardcoverPricing = JSON.parse(JSON.stringify(DEFAULT_HARDCOVER_PRICING));
    }
  }
}

function saveHardcoverPricing() {
  localStorage.setItem('right_printers_hardcover_pricing_v1', JSON.stringify(hardcoverPricing));
}

// Calculate Best Fit UPS on 100x70 cm sheet
function calculateSheetUps(sheetW, sheetH, itemW, itemH) {
  if (itemW <= 0 || itemH <= 0 || sheetW <= 0 || sheetH <= 0) {
    return { ups: 0, orientation: 'horizontal', cols: 0, rows: 0, wastePercent: 100 };
  }

  // Option 1: Horizontal (no rotation)
  const cols_H = Math.floor(sheetW / itemW);
  const rows_H = Math.floor(sheetH / itemH);
  const ups_H = Math.max(0, cols_H * rows_H);

  // Option 2: Vertical (rotated 90 deg)
  const cols_V = Math.floor(sheetW / itemH);
  const rows_V = Math.floor(sheetH / itemW);
  const ups_V = Math.max(0, cols_V * rows_V);

  const totalSheetArea = sheetW * sheetH;

  if (ups_V > ups_H) {
    const usedArea = ups_V * itemW * itemH;
    const wastePercent = ((totalSheetArea - usedArea) / totalSheetArea) * 100;
    return {
      ups: ups_V,
      orientation: 'vertical',
      cols: cols_V,
      rows: rows_V,
      fitW: itemH,
      fitH: itemW,
      wastePercent: Math.max(0, wastePercent)
    };
  } else {
    const usedArea = ups_H * itemW * itemH;
    const wastePercent = ((totalSheetArea - usedArea) / totalSheetArea) * 100;
    return {
      ups: ups_H,
      orientation: 'horizontal',
      cols: cols_H,
      rows: rows_H,
      fitW: itemW,
      fitH: itemH,
      wastePercent: Math.max(0, wastePercent)
    };
  }
}

// Main Calculation Function
function calculateHardcover() {
  const boxQty = Math.max(1, parseInt(document.getElementById('boxQty')?.value) || 1);
  const profitMarginPercent = parseFloat(document.getElementById('profitMarginInput')?.value) || 0;

  // 1. RIGID BOARD CALCULATION
  const boardL = parseFloat(document.getElementById('boardLength')?.value) || 1;
  const boardH = parseFloat(document.getElementById('boardHeight')?.value) || 1;
  const boardPcsPerBox = parseInt(document.getElementById('boardPcsPerBox')?.value) || 1;
  const totalBoardPieces = boxQty * boardPcsPerBox;

  // Standard sheet is 100x70 cm
  const boardLayout = calculateSheetUps(100, 70, boardL, boardH);
  const boardUps = Math.max(1, boardLayout.ups);
  const boardSheetsNeeded = Math.ceil(totalBoardPieces / boardUps);

  // Sheet rate from input or pricing
  const customBoardRate = parseFloat(document.getElementById('rigidBoardRateInput')?.value);
  const boardSheetRate = (!isNaN(customBoardRate) && customBoardRate > 0)
    ? customBoardRate
    : (hardcoverPricing.rigidBoardRates[selectedRigidGsm] || 5.00);

  const totalBoardCost = boardSheetsNeeded * boardSheetRate;
  const unitBoardCost = totalBoardCost / boxQty;

  // Update Rigid Board UI badges
  const boardUpsBadge = document.getElementById('boardUpsBadge');
  if (boardUpsBadge) {
    boardUpsBadge.innerText = `${boardUps} UPS (${boardLayout.cols}×${boardLayout.rows} ${boardLayout.orientation})`;
  }
  const boardSheetsBadge = document.getElementById('boardSheetsBadge');
  if (boardSheetsBadge) {
    boardSheetsBadge.innerText = `${boardSheetsNeeded} sheets (${boardSheetRate.toFixed(2)} SR/sh)`;
  }
  const boardCostBadge = document.getElementById('boardCostBadge');
  if (boardCostBadge) {
    boardCostBadge.innerText = `${totalBoardCost.toFixed(2)} SR (${unitBoardCost.toFixed(2)} SR/box)`;
  }

  // 2. WRAPPING 150 GSM PAPER CALCULATION
  const wrapL = parseFloat(document.getElementById('wrapLength')?.value) || 1;
  const wrapH = parseFloat(document.getElementById('wrapHeight')?.value) || 1;
  const wrapPcsPerBox = parseInt(document.getElementById('wrapPcsPerBox')?.value) || 1;
  const totalWrapPieces = boxQty * wrapPcsPerBox;

  const wrapLayout = calculateSheetUps(100, 70, wrapL, wrapH);
  const wrapUps = Math.max(1, wrapLayout.ups);
  const wrapSheetsNeeded = Math.ceil(totalWrapPieces / wrapUps);

  const customWrapPaperRate = parseFloat(document.getElementById('wrapPaperRateInput')?.value);
  const wrapSheetRate = (!isNaN(customWrapPaperRate) && customWrapPaperRate > 0)
    ? customWrapPaperRate
    : (hardcoverPricing.wrappingPaper150 || 0.75);

  const totalWrapPaperCost = wrapSheetsNeeded * wrapSheetRate;
  const unitWrapPaperCost = totalWrapPaperCost / boxQty;

  // Update Wrapping Paper UI badges
  const wrapUpsBadge = document.getElementById('wrapUpsBadge');
  if (wrapUpsBadge) {
    wrapUpsBadge.innerText = `${wrapUps} UPS (${wrapLayout.cols}×${wrapLayout.rows} ${wrapLayout.orientation})`;
  }
  const wrapSheetsBadge = document.getElementById('wrapSheetsBadge');
  if (wrapSheetsBadge) {
    wrapSheetsBadge.innerText = `${wrapSheetsNeeded} sheets (${wrapSheetRate.toFixed(2)} SR/sh)`;
  }
  const wrapPaperCostBadge = document.getElementById('wrapPaperCostBadge');
  if (wrapPaperCostBadge) {
    wrapPaperCostBadge.innerText = `${totalWrapPaperCost.toFixed(2)} SR (${unitWrapPaperCost.toFixed(2)} SR/box)`;
  }

  // Wrapping Paper Printing Calculation
  const isWrapPrinted = document.getElementById('enableWrapPrint')?.checked;
  const wrapPrintDetailsEl = document.getElementById('wrapPrintDetailsRow');
  if (wrapPrintDetailsEl) {
    if (isWrapPrinted) wrapPrintDetailsEl.classList.remove('hidden');
    else wrapPrintDetailsEl.classList.add('hidden');
  }

  let wrapPrintSetupCost = 0;
  let wrapPrintRunCost = 0;
  let wrapPrintTotalCost = 0;
  let printSheets = wrapSheetsNeeded;

  if (isWrapPrinted) {
    if (selectedWrappingPrintSize === '50x70') {
      // 1 sheet of 100x70 yields 2 sheets of 50x70
      printSheets = wrapSheetsNeeded * 2;
      wrapPrintSetupCost = 150.00;
      const thousandUnits = Math.max(1, Math.ceil(printSheets / 1000));
      wrapPrintRunCost = thousandUnits * 100.00;
    } else {
      // 100x70 cm Paper
      printSheets = wrapSheetsNeeded;
      wrapPrintSetupCost = 250.00;
      const thousandUnits = Math.max(1, Math.ceil(printSheets / 1000));
      wrapPrintRunCost = thousandUnits * 200.00;
    }
    wrapPrintTotalCost = wrapPrintSetupCost + wrapPrintRunCost;
  }

  const wrapPrintTotalBadge = document.getElementById('wrapPrintTotalBadge');
  if (wrapPrintTotalBadge) {
    wrapPrintTotalBadge.innerText = isWrapPrinted
      ? `${wrapPrintTotalCost.toFixed(2)} SR (Setup: ${wrapPrintSetupCost.toFixed(2)} SR + Run: ${wrapPrintRunCost.toFixed(2)} SR [${printSheets} sh])`
      : '0.00 SR (Plain / No Print)';
  }

  const totalWrappingCost = totalWrapPaperCost + wrapPrintTotalCost;

  // 3. BOX MAKING METHOD (MANUAL VS MACHINE)
  // Calculate Manual
  const manualHourlyRate = parseFloat(document.getElementById('manualLaborHourlyInput')?.value) || hardcoverPricing.manualLabor.hourlyRate;
  const manualSpeed = parseFloat(document.getElementById('manualSpeedInput')?.value) || hardcoverPricing.manualLabor.defaultSpeed;
  const manualOverrideHours = parseFloat(document.getElementById('manualHoursOverrideInput')?.value);
  const manualHours = (!isNaN(manualOverrideHours) && manualOverrideHours > 0)
    ? manualOverrideHours
    : (boxQty / Math.max(1, manualSpeed));
  const totalManualMakingCost = manualHours * manualHourlyRate;

  // Calculate Machine
  const machineSetup = parseFloat(document.getElementById('machineSetupInput')?.value) || hardcoverPricing.machineLabor.setupCost;
  const machineHourlyRate = parseFloat(document.getElementById('machineHourlyInput')?.value) || hardcoverPricing.machineLabor.hourlyRate;
  const machineSpeed = parseFloat(document.getElementById('machineSpeedInput')?.value) || hardcoverPricing.machineLabor.defaultSpeed;
  const machineOverrideHours = parseFloat(document.getElementById('machineHoursOverrideInput')?.value);
  const machineHours = (!isNaN(machineOverrideHours) && machineOverrideHours > 0)
    ? machineOverrideHours
    : (boxQty / Math.max(1, machineSpeed));
  const totalMachineMakingCost = machineSetup + (machineHours * machineHourlyRate);

  // Update Manual & Machine Badges
  const manualTotalBadge = document.getElementById('manualTotalBadge');
  if (manualTotalBadge) {
    manualTotalBadge.innerText = `${totalManualMakingCost.toFixed(2)} SR (${manualHours.toFixed(1)} hrs @ ${manualHourlyRate.toFixed(2)} SR/hr)`;
  }
  const machineTotalBadge = document.getElementById('machineTotalBadge');
  if (machineTotalBadge) {
    machineTotalBadge.innerText = `${totalMachineMakingCost.toFixed(2)} SR (Setup: ${machineSetup.toFixed(2)} SR + ${machineHours.toFixed(1)} hrs @ ${machineHourlyRate.toFixed(2)} SR/hr)`;
  }

  // Active Making Cost based on toggle
  const activeMakingCost = selectedBoxMakingMethod === 'manual' ? totalManualMakingCost : totalMachineMakingCost;
  const unitMakingCost = activeMakingCost / boxQty;

  // Method Comparison Badge
  const makingComparisonNotice = document.getElementById('makingComparisonNotice');
  if (makingComparisonNotice) {
    const diff = Math.abs(totalManualMakingCost - totalMachineMakingCost);
    const cheaper = totalManualMakingCost < totalMachineMakingCost ? 'Manual' : 'Machine';
    makingComparisonNotice.innerHTML = `
      <strong>💡 Method Cost Comparison / مقارنة التكاليف:</strong> 
      Manual: <strong>${totalManualMakingCost.toFixed(2)} SR</strong> (${(totalManualMakingCost / boxQty).toFixed(2)} SR/box) | 
      Machine: <strong>${totalMachineMakingCost.toFixed(2)} SR</strong> (${(totalMachineMakingCost / boxQty).toFixed(2)} SR/box)<br>
      <span class="cheaper-msg" style="font-weight: 800;">
        ✓ ${cheaper} Making is more cost-effective by ${diff.toFixed(2)} SR (${(diff / boxQty).toFixed(2)} SR/box) for ${boxQty} boxes.
      </span>
    `;
  }

  // 4. OPTIONAL LUXURY FINISHES (GOLD FOIL, SPOT UV, DIE CUTTING)
  // Gold Foil
  const optFoil = document.getElementById('hardcoverFoil')?.checked;
  const foilDetails = document.getElementById('hardcoverFoilDetails');
  if (foilDetails) {
    if (optFoil) foilDetails.classList.remove('hidden');
    else foilDetails.classList.add('hidden');
  }
  let foilCost = 0;
  if (optFoil) {
    const foilL = parseFloat(document.getElementById('hcFoilL')?.value) || 10;
    const foilH = parseFloat(document.getElementById('hcFoilH')?.value) || 10;
    const foilArea = foilL * foilH;
    const clecheCost = foilArea * 0.81;
    const foilMatCost = boxQty * (foilArea * 0.0015);
    const impressionCost = wrapSheetsNeeded * 0.25;
    foilCost = clecheCost + foilMatCost + impressionCost;
    const hcFoilSummary = document.getElementById('hcFoilSummary');
    if (hcFoilSummary) {
      hcFoilSummary.innerText = `${foilCost.toFixed(2)} SR (Cleche: ${clecheCost.toFixed(2)} SR + Film: ${foilMatCost.toFixed(2)} SR + Stamp: ${impressionCost.toFixed(2)} SR)`;
    }
  }

  // Spot UV
  const optUv = document.getElementById('hardcoverUv')?.checked;
  const uvDetails = document.getElementById('hardcoverUvDetails');
  if (uvDetails) {
    if (optUv) uvDetails.classList.remove('hidden');
    else uvDetails.classList.add('hidden');
  }
  let uvCost = 0;
  if (optUv) {
    const uvL = parseFloat(document.getElementById('hcUvL')?.value) || 40;
    const uvH = parseFloat(document.getElementById('hcUvH')?.value) || 25;
    const uvArea = uvL * uvH;
    const areaRatio = Math.min(1, uvArea / 7000);
    const ratePer1000 = 500.00 * areaRatio;
    const processCost = 100 + 200 + 50; // 350.00 SR
    const effSheets = Math.max(1000, wrapSheetsNeeded);
    const runCost = (effSheets / 1000) * ratePer1000;
    uvCost = processCost + runCost;
    const hcUvSummary = document.getElementById('hcUvSummary');
    if (hcUvSummary) {
      hcUvSummary.innerText = `${uvCost.toFixed(2)} SR (Area: ${uvArea.toFixed(0)} cm² - Process: 350.00 SR + Run: ${runCost.toFixed(2)} SR)`;
    }
  }

  // Die Cutting Board
  const optDie = document.getElementById('hardcoverDieBoard')?.checked;
  const dieDetails = document.getElementById('hardcoverDieDetails');
  if (dieDetails) {
    if (optDie) dieDetails.classList.remove('hidden');
    else dieDetails.classList.add('hidden');
  }
  let dieCost = 0;
  if (optDie) {
    const dieBoardFee = 150.00;
    const dieCutRun = wrapSheetsNeeded * 0.35;
    dieCost = dieBoardFee + dieCutRun;
    const hcDieSummary = document.getElementById('hcDieSummary');
    if (hcDieSummary) {
      hcDieSummary.innerText = `${dieCost.toFixed(2)} SR (Die Board: ${dieBoardFee.toFixed(2)} SR + Cylinder Cut: ${dieCutRun.toFixed(2)} SR)`;
    }
  }

  const totalFinishesCost = foilCost + uvCost + dieCost;

  // 5. TOTALS & PROFIT MARGIN
  const rawBaseProductionCost = totalBoardCost + totalWrappingCost + activeMakingCost + totalFinishesCost;
  const profitMarginAmount = (rawBaseProductionCost * (profitMarginPercent / 100));
  const grandTotalCost = rawBaseProductionCost + profitMarginAmount;
  const grandUnitCost = grandTotalCost / boxQty;

  // Update Right Pane Summary Cards
  document.getElementById('summaryTotalCost').innerText = `${grandTotalCost.toFixed(2)} SR`;
  document.getElementById('summaryUnitCost').innerText = `${grandUnitCost.toFixed(2)} SR / box`;
  document.getElementById('summaryBoxQty').innerText = `${boxQty} Boxes`;

  // Itemized breakdown in summary card
  document.getElementById('sumBoardCost').innerText = `${totalBoardCost.toFixed(2)} SR (${selectedRigidGsm} GSM, ${boardSheetsNeeded} sh)`;
  document.getElementById('sumWrapPaperCost').innerText = `${totalWrapPaperCost.toFixed(2)} SR (${wrapSheetsNeeded} sh 150 GSM)`;
  document.getElementById('sumWrapPrintCost').innerText = isWrapPrinted ? `${wrapPrintTotalCost.toFixed(2)} SR (${selectedWrappingPrintSize})` : '0.00 SR (Plain)';
  document.getElementById('sumMakingCost').innerText = `${activeMakingCost.toFixed(2)} SR (${selectedBoxMakingMethod.toUpperCase()})`;
  document.getElementById('sumFinishesCost').innerText = `${totalFinishesCost.toFixed(2)} SR`;
  document.getElementById('sumBaseCost').innerText = `${rawBaseProductionCost.toFixed(2)} SR`;
  document.getElementById('sumProfitAmount').innerText = `+${profitMarginAmount.toFixed(2)} SR (${profitMarginPercent}%)`;

  // Update Visual Sheet Layout Preview
  renderVisualSheetPreview(
    activePreviewTab === 'board' ? boardLayout : wrapLayout,
    activePreviewTab === 'board' ? boardL : wrapL,
    activePreviewTab === 'board' ? boardH : wrapH,
    activePreviewTab === 'board' ? 'Rigid Board (100x70 cm)' : 'Wrapping 150 GSM (100x70 cm)'
  );
}

// Render Interactive Visual Sheet Preview SVG
function renderVisualSheetPreview(layout, itemW, itemH, title) {
  const container = document.getElementById('hardcoverLayoutContainer');
  if (!container) return;

  const isLight = document.body.getAttribute('data-theme') === 'light' || document.documentElement.getAttribute('data-theme') === 'light';

  const sheetW = 100;
  const sheetH = 70;
  const svgW = 460;
  const svgH = 322; // maintains 100:70 aspect ratio

  const scale = svgW / sheetW;

  const cols = layout.cols;
  const rows = layout.rows;
  const fitW = layout.fitW;
  const fitH = layout.fitH;
  const ups = layout.ups;

  const rectFill = isLight ? 'rgba(92, 69, 39, 0.12)' : 'rgba(212, 175, 55, 0.22)';
  const rectStroke = isLight ? '#5c4527' : '#d4af37';
  const textFill = isLight ? '#1A1510' : '#fbbf24';
  const sheetFill = isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.03)';
  const sheetStroke = isLight ? '#5c4527' : 'rgba(255, 255, 255, 0.25)';
  const boxBorder = isLight ? '2px solid #5c4527' : '2px dashed rgba(212, 175, 55, 0.4)';
  const boxBg = isLight ? '#ffffff' : 'rgba(0,0,0,0.2)';
  const titleColor = isLight ? '#78350f' : 'var(--primary-gold)';
  const statColor = isLight ? '#1A1510' : 'var(--text-muted)';

  let rectsSvg = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * fitW * scale;
      const y = r * fitH * scale;
      const w = fitW * scale;
      const h = fitH * scale;
      rectsSvg += `
        <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="3" 
              fill="${rectFill}" stroke="${rectStroke}" stroke-width="${isLight ? 1.5 : 1.2}" />
        <text x="${x + w / 2}" y="${y + h / 2 + 4}" font-size="11" font-weight="800" fill="${textFill}" text-anchor="middle">
          ${itemW}×${itemH}
        </text>
      `;
    }
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-weight: 800; color: ${titleColor}; font-size: 0.95rem;">${title}</span>
      <span style="font-size: 0.85rem; color: ${statColor}; font-weight: 700;">${ups} UPS • Wastage: ${layout.wastePercent.toFixed(1)}%</span>
    </div>
    <div class="layout-svg-wrap" style="border: ${boxBorder}; border-radius: 8px; padding: 6px; background: ${boxBg}; display: flex; justify-content: center; box-shadow: ${isLight ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'};">
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto;">
        <!-- Sheet outline -->
        <rect x="0" y="0" width="${svgW}" height="${svgH}" fill="${sheetFill}" stroke="${sheetStroke}" stroke-width="2" rx="4"/>
        ${rectsSvg}
      </svg>
    </div>
  `;
}

// Initialize UI & Event Listeners
function initHardcoverUI() {
  loadHardcoverPricing();

  // GSM button group
  const gsmBtns = document.querySelectorAll('.rigid-gsm-btn');
  gsmBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      gsmBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      selectedRigidGsm = target.getAttribute('data-gsm');
      
      const rateInput = document.getElementById('rigidBoardRateInput');
      if (rateInput && hardcoverPricing.rigidBoardRates[selectedRigidGsm]) {
        rateInput.value = hardcoverPricing.rigidBoardRates[selectedRigidGsm].toFixed(2);
      }
      calculateHardcover();
    });
  });

  // Box Making Method Toggle
  const methodBtns = document.querySelectorAll('.making-method-btn');
  methodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      methodBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      selectedBoxMakingMethod = target.getAttribute('data-method');

      const manualCard = document.getElementById('manualMakingCardDetails');
      const machineCard = document.getElementById('machineMakingCardDetails');
      if (selectedBoxMakingMethod === 'manual') {
        if (manualCard) manualCard.classList.remove('hidden');
        if (machineCard) machineCard.classList.add('hidden');
      } else {
        if (manualCard) manualCard.classList.add('hidden');
        if (machineCard) machineCard.classList.remove('hidden');
      }
      calculateHardcover();
    });
  });

  // Wrapping Print Size Toggle
  const printSizeBtns = document.querySelectorAll('.print-size-btn');
  printSizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      printSizeBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      selectedWrappingPrintSize = target.getAttribute('data-size');
      calculateHardcover();
    });
  });

  // Layout Preview Tab Switcher
  const previewTabBtns = document.querySelectorAll('.preview-tab-btn');
  previewTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      previewTabBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      activePreviewTab = target.getAttribute('data-target');
      calculateHardcover();
    });
  });

  // Inputs Auto-calculate
  const inputIds = [
    'boxQty', 'profitMarginInput',
    'boardLength', 'boardHeight', 'boardPcsPerBox', 'rigidBoardRateInput',
    'wrapLength', 'wrapHeight', 'wrapPcsPerBox', 'wrapPaperRateInput',
    'enableWrapPrint',
    'manualLaborHourlyInput', 'manualSpeedInput', 'manualHoursOverrideInput',
    'machineSetupInput', 'machineHourlyInput', 'machineSpeedInput', 'machineHoursOverrideInput',
    'hardcoverFoil', 'hcFoilL', 'hcFoilH',
    'hardcoverUv', 'hcUvL', 'hcUvH',
    'hardcoverDieBoard'
  ];

  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => calculateHardcover());
      el.addEventListener('change', () => calculateHardcover());
    }
  });

  // WhatsApp Quote Copy
  const copyBtn = document.getElementById('copyQuoteBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const qty = document.getElementById('boxQty')?.value || 500;
      const total = document.getElementById('summaryTotalCost')?.innerText || '0.00 SR';
      const unit = document.getElementById('summaryUnitCost')?.innerText || '0.00 SR';
      const gsm = selectedRigidGsm;
      const text = `*Right Printers - Hardcover Luxury Box Quotation*\n📦 Quantity: ${qty} Boxes\n🔹 Rigid Board: ${gsm} GSM (100x70)\n🔹 Box Making: ${selectedBoxMakingMethod.toUpperCase()}\n💰 Unit Price: ${unit}\n💵 Total Price: ${total}\n\nValid for 7 days.`;
      navigator.clipboard.writeText(text).then(() => {
        alert("Quotation copied to clipboard!");
      });
    });
  }

  // Print Button
  const printBtn = document.getElementById('printQuoteBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Theme Toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cur = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = cur === 'light' ? 'dark' : 'light';
      if (next === 'light') {
        document.body.setAttribute('data-theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.body.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('theme', next);
      const textSpan = document.getElementById('themeToggleText');
      if (textSpan) textSpan.innerText = next === 'light' ? 'Dark Theme' : 'Light Theme';
      calculateHardcover();
    });
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      const textSpan = document.getElementById('themeToggleText');
      if (textSpan) textSpan.innerText = 'Dark Theme';
    }
  }

  // Initial Calculation
  calculateHardcover();
}

window.addEventListener('DOMContentLoaded', () => {
  initHardcoverUI();
});
