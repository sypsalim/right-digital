# Digital Printing Press Cost Estimator

A modern, responsive, and bilingual (English/Arabic) web-based pricing cost estimator application designed for digital printing presses. Features live sheet layout arrangement visualizations, sheet wastage calculations, lamination/plotter service additions, and a specialized Business Card print estimation workflow.

## Project Structure

The project follows a standard frontend architecture layout:

```
├── index.html                  # Main application UI entrypoint
├── index_standalone.html       # Zero-dependency, offline standalone bundle
├── build.py                    # Standalone packaging compiler script
├── package.json                # NPM dependency and script management
├── vite.config.js              # Vite bundler and development server config
├── .gitignore                  # Git source control file ignores
└── src/                        # Main codebase assets
    ├── assets/
    │   └── logo.png            # Transparent brand logo with golden gradient
    ├── css/
    │   └── index.css           # Design system tokens and styling rules
    └── js/
        └── app.js              # State logic, pricing models, and computations
```

---

## Features

- **Standard Paper vs. Sticker Modes**: Separate GSM pricing tables and adhesive option selects.
- **Visual Sheet Layout Calculator**: Draws dynamic SVGs of cards/sheets showing exact alignment directions (Landscape vs. Portrait comparison) and wastage areas.
- **Bilingual Estimate Invoices**: Live cost breakdown cards that sync with print layout options, suitable for printing directly or exporting as PDF.
- **Customized Business Card Workflow**: Lock dimensions to standard size (9x5.5 cm), enforce A3 sheet calculations on 300 GSM, disable standard plotter cutters, and apply specialized Polar Guillotine cutting costs.
- **Tiered Discounts**: Sheet volume and card volume discount overrides.

---

## Development Guide

### Prerequisites
- Node.js & npm (for modern bundlers)
- Python 3 (for offline stand-alone compiler)

### 1. Development Server
Start the local server with hot module reloading:
```bash
npm run dev
```
Open [http://localhost:8081](http://localhost:8081) to view the application.

### 2. Standard Production Build
Compile and minify code into `/dist`:
```bash
npm run build
```

---

## Standalone Offline Distribution

To generate the single-file, zero-dependency offline bundle (where CSS, JS, and transparent logo assets are directly inlined as Base64 strings):
```bash
python3 build.py
```
This updates the root `index_standalone.html`, allowing print shop assistants to run the estimator offline on any device with a simple double-click.
