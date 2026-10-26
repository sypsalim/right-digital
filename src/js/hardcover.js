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

  // Update Section 3 Dedicated Visual Sheet Layout Panel
  renderWrappingVisualLayout(wrapLayout, wrapL, wrapH);

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

  // Update Visual Sheet Layout Preview (Right Pane)
  renderVisualSheetPreview(
    activePreviewTab === 'board' ? boardLayout : wrapLayout,
    activePreviewTab === 'board' ? boardL : wrapL,
    activePreviewTab === 'board' ? boardH : wrapH,
    activePreviewTab === 'board' ? 'Rigid Board (100x70 cm)' : 'Wrapping 150 GSM (100x70 cm)',
    activePreviewTab === 'board' ? 'board' : 'wrap'
  );
}

// Build Precision SVG for Sheet Layout Preview (100x70 cm)
function createSheetLayoutSvg({ layout, itemW, itemH, type = 'wrap' }) {
  const isLight = document.body.getAttribute('data-theme') === 'light' || document.documentElement.getAttribute('data-theme') === 'light';

  // Check validity
  if (!layout || layout.ups <= 0 || itemW <= 0 || itemH <= 0 || (itemW > 100 && itemH > 100) || (itemW > 70 && itemH > 70 && (itemW > 100 || itemH > 100))) {
    return `
      <div style="padding: 24px 16px; text-align: center; color: #f43f5e; font-weight: 700;">
        ⚠️ Piece size (${itemW} × ${itemH} cm) exceeds 100×70 cm sheet capacity!
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Please reduce Length or Height to fit on a standard 100×70 cm sheet.</div>
      </div>
    `;
  }

  const sheetW = 100;
  const sheetH = 70;
  const totalSheetArea = sheetW * sheetH; // 7,000 cm2

  const ups = layout.ups;
  const cols = layout.cols;
  const rows = layout.rows;
  const fitW = layout.fitW;
  const fitH = layout.fitH;
  const orientation = layout.orientation;

  const usedArea = ups * itemW * itemH;
  const wasteArea = Math.max(0, totalSheetArea - usedArea);
  const wastePercent = (wasteArea / totalSheetArea) * 100;
  const usedPercent = (usedArea / totalSheetArea) * 100;

  const fittedWidthCm = cols * fitW;
  const fittedHeightCm = rows * fitH;
  const scrapRightCm = Math.max(0, sheetW - fittedWidthCm);
  const scrapBottomCm = Math.max(0, sheetH - fittedHeightCm);

  // SVG dimensions & coordinate system
  const svgW = 560;
  const svgH = 410;
  const x0 = 42; // margin for left height ruler
  const y0 = 30; // margin for top width ruler
  const drawW = 490; // sheet width in px (4.9 px / cm)
  const drawH = 343; // sheet height in px (4.9 px / cm)
  const scale = drawW / sheetW; // 4.90

  // Colors & styles based on theme & type
  const isWrap = type === 'wrap';
  
  // Theme styling
  const rulerColor = isLight ? '#475569' : '#94a3b8';
  const rulerTextColor = isLight ? '#0f172a' : '#cbd5e1';
  const sheetBg = isLight ? '#ffffff' : '#0b111a';
  const sheetStroke = isWrap
    ? (isLight ? '#0891b2' : 'rgba(6, 182, 212, 0.7)')
    : (isLight ? '#5c4527' : 'rgba(212, 175, 55, 0.7)');

  const pieceFill = isWrap
    ? (isLight ? 'rgba(8, 145, 178, 0.12)' : 'rgba(6, 182, 212, 0.16)')
    : (isLight ? 'rgba(92, 69, 39, 0.12)' : 'rgba(212, 175, 55, 0.20)');
  const pieceStroke = isWrap
    ? (isLight ? '#0891b2' : '#06b6d4')
    : (isLight ? '#5c4527' : '#d4af37');
  const pieceTextMain = isWrap
    ? (isLight ? '#0e7490' : '#22d3ee')
    : (isLight ? '#5c4527' : '#fbbf24');
  const pieceTextSub = isLight ? '#1e293b' : '#f1f5f9';

  const scrapHatchColor = isLight ? 'rgba(239, 68, 68, 0.45)' : 'rgba(244, 63, 94, 0.4)';
  const scrapBg = isLight ? 'rgba(239, 68, 68, 0.06)' : 'rgba(244, 63, 94, 0.08)';
  const scrapTextColor = isLight ? '#be123c' : '#fb7185';

  const patternId = `waste_hatch_${type}_${Math.floor(Math.random() * 100000)}`;

  // Generate Cut Piece Rectangles
  let piecesSvg = '';
  let pieceIndex = 1;
  const piecePxW = fitW * scale;
  const piecePxH = fitH * scale;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x0 + c * piecePxW;
      const py = y0 + r * piecePxH;
      const idx = pieceIndex++;

      const isCompact = piecePxW < 90 || piecePxH < 60;
      const isTiny = piecePxW < 55 || piecePxH < 35;

      let labelSvg = '';
      if (!isTiny) {
        if (isCompact) {
          labelSvg = `
            <text x="${px + piecePxW / 2}" y="${py + piecePxH / 2 + 4}" font-size="11" font-weight="800" fill="${pieceTextMain}" text-anchor="middle">
              #${idx} (${fitW}×${fitH})
            </text>
          `;
        } else {
          labelSvg = `
            <text x="${px + piecePxW / 2}" y="${py + piecePxH / 2 - 4}" font-size="12" font-weight="800" fill="${pieceTextMain}" text-anchor="middle">
              ${isWrap ? 'Wrap' : 'Board'} #${idx}
            </text>
            <text x="${px + piecePxW / 2}" y="${py + piecePxH / 2 + 12}" font-size="10.5" font-weight="700" fill="${pieceTextSub}" text-anchor="middle">
              ${fitW} × ${fitH} cm
            </text>
          `;
        }
      }

      piecesSvg += `
        <g class="sheet-piece-group">
          <rect x="${px + 1}" y="${py + 1}" width="${piecePxW - 2}" height="${piecePxH - 2}" rx="4"
                fill="${pieceFill}" stroke="${pieceStroke}" stroke-width="${isLight ? 1.5 : 1.3}" />
          ${labelSvg}
        </g>
      `;
    }
  }

  // Wastage scrap areas
  let scrapSvg = '';
  const fittedPxW = fittedWidthCm * scale;
  const fittedPxH = fittedHeightCm * scale;
  const scrapRightPx = scrapRightCm * scale;
  const scrapBottomPx = scrapBottomCm * scale;

  // Right Margin Waste
  if (scrapRightCm > 0.05) {
    const rx = x0 + fittedPxW;
    const ry = y0;
    const rw = scrapRightPx;
    const rh = drawH;
    const showLabel = rw >= 28;

    scrapSvg += `
      <g class="sheet-waste-right">
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="url(#${patternId})" />
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${scrapBg}" stroke="${scrapHatchColor}" stroke-dasharray="3,3" stroke-width="1" />
        ${showLabel ? `
          <text x="${rx + rw / 2}" y="${ry + rh / 2}" font-size="10" font-weight="700" fill="${scrapTextColor}" text-anchor="middle" transform="rotate(-90 ${rx + rw / 2} ${ry + rh / 2})">
            Scrap: ${scrapRightCm.toFixed(1)} cm
          </text>
        ` : ''}
      </g>
    `;
  }

  // Bottom Margin Waste
  if (scrapBottomCm > 0.05) {
    const bx = x0;
    const by = y0 + fittedPxH;
    const bw = fittedPxW;
    const bh = scrapBottomPx;
    const showLabel = bh >= 16;

    scrapSvg += `
      <g class="sheet-waste-bottom">
        <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#${patternId})" />
        <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${scrapBg}" stroke="${scrapHatchColor}" stroke-dasharray="3,3" stroke-width="1" />
        ${showLabel ? `
          <text x="${bx + bw / 2}" y="${by + bh / 2 + 3.5}" font-size="10" font-weight="700" fill="${scrapTextColor}" text-anchor="middle">
            Scrap: ${scrapBottomCm.toFixed(1)} cm
          </text>
        ` : ''}
      </g>
    `;
  }

  // Corner Intersection Waste
  if (scrapRightCm > 0.05 && scrapBottomCm > 0.05) {
    const cx = x0 + fittedPxW;
    const cy = y0 + fittedPxH;
    const cw = scrapRightPx;
    const ch = scrapBottomPx;
    scrapSvg += `
      <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="url(#${patternId})" />
      <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="${scrapBg}" stroke="${scrapHatchColor}" stroke-dasharray="3,3" stroke-width="1" />
    `;
  }

  return `
    <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="${patternId}" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="12" stroke="${scrapHatchColor}" stroke-width="1.6" />
        </pattern>
      </defs>

      <!-- TOP RULER (100 cm) -->
      <g class="ruler-top">
        <line x1="${x0}" y1="16" x2="${x0 + drawW}" y2="16" stroke="${rulerColor}" stroke-width="1.2" />
        <line x1="${x0}" y1="11" x2="${x0}" y2="21" stroke="${rulerColor}" stroke-width="1.2" />
        <line x1="${x0 + drawW}" y1="11" x2="${x0 + drawW}" y2="21" stroke="${rulerColor}" stroke-width="1.2" />
        <text x="${x0 + drawW / 2}" y="14" fill="${rulerTextColor}" font-size="10.5" font-weight="800" text-anchor="middle" letter-spacing="0.02em">
          100 cm (Sheet Width / عرض الفرخ)
        </text>
      </g>

      <!-- LEFT RULER (70 cm) -->
      <g class="ruler-left">
        <line x1="20" y1="${y0}" x2="20" y2="${y0 + drawH}" stroke="${rulerColor}" stroke-width="1.2" />
        <line x1="15" y1="${y0}" x2="25" y2="${y0}" stroke="${rulerColor}" stroke-width="1.2" />
        <line x1="15" y1="${y0 + drawH}" x2="25" y2="${y0 + drawH}" stroke="${rulerColor}" stroke-width="1.2" />
        <text x="14" y="${y0 + drawH / 2}" fill="${rulerTextColor}" font-size="10.5" font-weight="800" text-anchor="middle" transform="rotate(-90 14 ${y0 + drawH / 2})" letter-spacing="0.02em">
          70 cm (Sheet Height / ارتفاع الفرخ)
        </text>
      </g>

      <!-- SHEET BACKGROUND -->
      <rect x="${x0}" y="${y0}" width="${drawW}" height="${drawH}" rx="4"
            fill="${sheetBg}" stroke="${sheetStroke}" stroke-width="2" />

      <!-- WASTAGE HATCHING -->
      ${scrapSvg}

      <!-- CUT PIECES -->
      ${piecesSvg}

      <!-- BOTTOM LEGEND & SPECS -->
      <g class="sheet-legend" transform="translate(${x0}, ${y0 + drawH + 18})">
        <!-- Fitted Pill -->
        <rect x="0" y="0" width="14" height="12" rx="3" fill="${pieceFill}" stroke="${pieceStroke}" stroke-width="1.5" />
        <text x="20" y="10" font-size="10.5" font-weight="700" fill="${rulerTextColor}">
          Cut Pieces: <tspan font-weight="800" fill="${pieceTextMain}">${ups} UPS</tspan> (${fitW}×${fitH} cm, ${usedPercent.toFixed(1)}% used)
        </text>

        <!-- Scrap Pill -->
        <rect x="270" y="0" width="14" height="12" rx="3" fill="url(#${patternId})" stroke="${scrapHatchColor}" stroke-width="1.2" />
        <text x="290" y="10" font-size="10.5" font-weight="700" fill="${rulerTextColor}">
          Paper Waste: <tspan font-weight="800" fill="${scrapTextColor}">${wastePercent.toFixed(1)}%</tspan> (${Math.round(wasteArea).toLocaleString()} cm²)
        </text>
      </g>
    </svg>
  `;
}

// Render Section 3 Dedicated Visual Sheet Layout Panel
function renderWrappingVisualLayout(wrapLayout, wrapL, wrapH) {
  const container = document.getElementById('wrapInlineSvgWrapper');
  if (!container) return;

  const totalSheetArea = 100 * 70; // 7,000 cm2
  const ups = Math.max(0, wrapLayout.ups || 0);
  const usedArea = ups * wrapL * wrapH;
  const wasteArea = Math.max(0, totalSheetArea - usedArea);
  const usedPercent = (usedArea / totalSheetArea) * 100;
  const wastePercent = Math.max(0, wrapLayout.wastePercent || 0);

  // Update SVG
  container.innerHTML = createSheetLayoutSvg({
    layout: wrapLayout,
    itemW: wrapL,
    itemH: wrapH,
    type: 'wrap'
  });

  // Update Badge
  const fitBadge = document.getElementById('wrapLayoutFitBadge');
  if (fitBadge) {
    fitBadge.innerText = `${ups} UPS (${wrapLayout.cols}×${wrapLayout.rows} ${wrapLayout.orientation})`;
  }

  // Update Metric Items
  const metricUps = document.getElementById('wrapMetricUps');
  if (metricUps) {
    metricUps.innerText = `${ups} UPS`;
  }

  const metricGrid = document.getElementById('wrapMetricGrid');
  if (metricGrid) {
    metricGrid.innerText = `${wrapLayout.cols}×${wrapLayout.rows} (${wrapLayout.orientation.toUpperCase()})`;
  }

  const metricUsed = document.getElementById('wrapMetricUsed');
  if (metricUsed) {
    metricUsed.innerText = `${usedPercent.toFixed(1)}% (${Math.round(usedArea).toLocaleString()} cm²)`;
  }

  const metricWaste = document.getElementById('wrapMetricWaste');
  if (metricWaste) {
    metricWaste.innerText = `${wastePercent.toFixed(1)}%`;
  }

  const metricWasteArea = document.getElementById('wrapMetricWasteArea');
  if (metricWasteArea) {
    metricWasteArea.innerText = `${Math.round(wasteArea).toLocaleString()} cm²`;
  }
}

// Render Interactive Visual Sheet Preview SVG in Right Pane
function renderVisualSheetPreview(layout, itemW, itemH, title, type = 'board') {
  const container = document.getElementById('hardcoverLayoutContainer');
  if (!container) return;

  const isLight = document.body.getAttribute('data-theme') === 'light' || document.documentElement.getAttribute('data-theme') === 'light';
  const titleColor = type === 'wrap'
    ? (isLight ? '#0e7490' : '#22d3ee')
    : (isLight ? '#5c4527' : 'var(--primary-gold)');
  const statColor = isLight ? '#1A1510' : 'var(--text-muted)';
  const boxBorder = type === 'wrap'
    ? (isLight ? '2px solid #0891b2' : '2px dashed rgba(6, 182, 212, 0.45)')
    : (isLight ? '2px solid #5c4527' : '2px dashed rgba(212, 175, 55, 0.45)');
  const boxBg = isLight ? '#ffffff' : 'rgba(10, 15, 24, 0.5)';

  const svgMarkup = createSheetLayoutSvg({
    layout,
    itemW,
    itemH,
    type
  });

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-weight: 800; color: ${titleColor}; font-size: 0.95rem;">${title}</span>
      <span style="font-size: 0.85rem; color: ${statColor}; font-weight: 700;">${layout.ups} UPS • Wastage: ${layout.wastePercent.toFixed(1)}%</span>
    </div>
    <div class="layout-svg-wrap" style="border: ${boxBorder}; border-radius: 8px; padding: 8px; background: ${boxBg}; display: flex; justify-content: center; box-shadow: ${isLight ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'};">
      ${svgMarkup}
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
