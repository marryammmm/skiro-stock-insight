/**
 * SKIRO SMART FILE READER
 * AI-Powered file reader yang bisa baca CSV dan XLSX
 * Mendeteksi struktur data secara OTOMATIS dari ISI, bukan cuma nama kolom
 * 
 * FITUR:
 * - Auto-detect file type (CSV/XLSX)
 * - Smart column detection dari pattern data
 * - Multi-format support (Indonesian & English)
 * - Intelligent data type inference
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { parseSmartNumber } from './numberParser';

export interface SmartColumnMapping {
  product: number;      // Index kolom produk
  category?: number;    // Index kolom kategori
  variant?: number;     // Index kolom variasi/size/warna
  price: number;        // Index kolom harga
  quantity: number;     // Index kolom jumlah terjual
  revenue?: number;     // Index kolom total penjualan (prioritas utama untuk revenue)
  sku?: number;         // Index kolom SKU
  date?: number;        // Index kolom tanggal
  confidence: number;   // Confidence level (0-100)
}

export interface SmartReadResult {
  data: any[];
  mapping: SmartColumnMapping;
  fileType: 'csv' | 'xlsx';
  rawHeaders: string[];
  detectionLog: string[];
}

/**
 * Deteksi apakah string adalah nama produk
 * Ciri-ciri: Huruf kapital, brand names, descriptive text
 */
function isLikelyProductName(value: any): boolean {
  if (typeof value !== 'string') return false;
  const str = value.toString().trim();
  
  // Terlalu pendek atau terlalu panjang
  if (str.length < 3 || str.length > 200) return false;
  
  // Pattern produk fashion: brand + item type + details
  const fashionPatterns = [
    /jersey|shirt|celana|kaos|dress|jacket|hoodie|sweater|pants|trackpants/i,
    /DMNT|adidas|nike|puma|reebok/i,  // Brand names
    /black|white|blue|red|grey|navy|hitam|putih|biru/i,  // Warna
  ];
  
  const hasPattern = fashionPatterns.some(pattern => pattern.test(str));
  
  // Harus ada huruf
  const hasLetters = /[a-zA-Z]/.test(str);
  
  // Tidak boleh pure number
  const isPureNumber = /^\d+$/.test(str.replace(/[.,\s]/g, ''));
  
  return hasLetters && !isPureNumber && (hasPattern || str.split(' ').length >= 2);
}

/**
 * Deteksi apakah string adalah kategori
 * Ciri-ciri: Singkat, deskriptif, repetitive
 */
function isLikelyCategory(value: any, allValues: any[]): boolean {
  if (typeof value !== 'string') return false;
  const str = value.toString().trim();
  
  // Kategori biasanya singkat
  if (str.length < 2 || str.length > 50) return false;
  
  // Hitung berapa kali value ini muncul (kategori repetitive)
  const count = allValues.filter(v => v === value).length;
  const repetitiveness = count / allValues.length;
  
  // Jika lebih dari 5% data sama, kemungkinan kategori
  return repetitiveness > 0.05;
}

/**
 * Deteksi apakah value adalah variasi/size
 * Ciri-ciri: S, M, L, XL, XXL, XXXL, atau kombinasi dengan warna
 */
function isLikelyVariant(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  const str = value.toString().trim().toUpperCase();
  
  // Size patterns - ENHANCED untuk UMKM pakaian
  const sizePatterns = [
    /^(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL)$/,  // Pure sizes
    /^[SMLX]$/,  // Single letter sizes (S, M, L, X)
    /^X+$/,  // Multiple X (XX, XXX)
    /^(ALL\s*SIZE|ALLSIZE|ALL)$/i,  // ALL SIZE - universal size
    /^[0-9]{2}$/,  // Ukuran celana 2 digit (27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 40)
    /^(2[7-9]|3[0-9]|40)$/,  // Specific pants sizes (27-40)
    /^(SHORT|LONG)$/i,  // Sleeve length
  ];
  
  const isSize = sizePatterns.some(pattern => pattern.test(str));
  
  // Color patterns (untuk variasi warna)
  const colorPatterns = [
    /BLACK|WHITE|RED|BLUE|GREEN|YELLOW|NAVY|GREY|GRAY/i,
    /HITAM|PUTIH|MERAH|BIRU|HIJAU|KUNING/i,
  ];
  
  const isColor = colorPatterns.some(pattern => pattern.test(str));
  
  // Kombinasi size + color (e.g., "M.Dixie Black", "L Black", "X Red")
  const isSizeColorCombo = /^(XXS|XS|S|M|L|X|XL|XXL|XXXL)\s*[.-]?\s*\w+/i.test(str);
  
  return isSize || isColor || isSizeColorCombo;
}

/**
 * Deteksi apakah value adalah harga
 * Ciri-ciri: Angka besar (>1000), format mata uang
 */
function isLikelyPrice(value: any, allValues: any[]): boolean {
  // Parse number dengan SMART PARSER
  const num = parseSmartNumber(value);
  
  if (num === 0 || isNaN(num)) return false;
  
  // Harga biasanya > 1000 (untuk rupiah) - tapi lebih fleksibel
  if (num < 50) return false;
  
  // Hitung average - harga biasanya konsisten dalam range tertentu
  const numbers = allValues
    .map(v => parseSmartNumber(v))
    .filter(n => !isNaN(n) && n >= 50);
  
  if (numbers.length === 0) return false;
  
  const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  
  // Harga biasanya dalam range yang wajar (lebih toleran)
  return num >= avg * 0.05 && num <= avg * 20;
}

/**
 * Deteksi apakah value adalah quantity/jumlah
 * Ciri-ciri: Angka kecil (1-1000), integer
 */
function isLikelyQuantity(value: any, allValues: any[]): boolean {
  // Parse number dengan SMART PARSER
  const num = parseSmartNumber(value);
  
  if (num === 0 || isNaN(num)) return false;
  
  // Quantity biasanya 0-100000 (lebih fleksibel untuk fashion retail)
  if (num < 0 || num > 100000000) return false;
  
  // Hitung statistics
  const numbers = allValues
    .map(v => parseSmartNumber(v))
    .filter(n => !isNaN(n) && n >= 0 && n <= 100000000);
  
  if (numbers.length === 0) return false;
  
  const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  
  // Accept semua angka valid
  return true;
}

/**
 * Deteksi apakah value adalah total revenue/amount
 * Ciri-ciri: Angka besar, biasanya > harga, hasil dari price × quantity
 */
function isLikelyRevenue(value: any, allValues: any[]): boolean {
  // Parse number dengan SMART PARSER
  const num = parseSmartNumber(value);
  
  if (num === 0 || isNaN(num)) return false;
  
  // Revenue biasanya > 1000 (untuk rupiah)
  if (num < 100) return false;
  
  // Hitung average - revenue bisa sangat bervariasi
  const numbers = allValues
    .map(v => parseSmartNumber(v))
    .filter(n => !isNaN(n) && n >= 100);
  
  if (numbers.length === 0) return false;
  
  const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const max = Math.max(...numbers);
  
  // Revenue biasanya lebih besar dari price (karena bisa multiple quantity)
  // dan lebih besar dari quantity
  return num >= avg * 0.01 && num <= avg * 100;
}

/**
 * Deteksi apakah value adalah SKU/kode produk
 * Ciri-ciri: Alphanumeric, format konsisten, unik
 */
function isLikelySKU(value: any, allValues: any[]): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  const str = value.toString().trim();
  
  // SKU biasanya 5-50 karakter
  if (str.length < 5 || str.length > 50) return false;
  
  // Harus ada kombinasi huruf dan angka, atau pure angka dengan format
  const hasAlphanumeric = /^[A-Z0-9-_]+$/i.test(str);
  if (!hasAlphanumeric) return false;
  
  // SKU biasanya unique - hitung uniqueness
  const uniqueValues = new Set(allValues.filter(v => v !== null && v !== undefined && v !== ''));
  const uniqueness = uniqueValues.size / allValues.length;
  
  // Jika > 80% unique, kemungkinan SKU
  return uniqueness > 0.8;
}

/**
 * Deteksi apakah value adalah tanggal
 */
function isLikelyDate(value: any): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  const str = value.toString().trim();
  
  // Pattern tanggal
  const datePatterns = [
    /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/,  // DD/MM/YYYY or DD-MM-YYYY
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/,    // YYYY-MM-DD
    /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
  ];
  
  return datePatterns.some(pattern => pattern.test(str));
}

/**
 * SMART COLUMN DETECTION
 * Analisis semua kolom dan deteksi tipe data dari ISI, bukan nama kolom
 */
function detectColumnsFromContent(data: any[], headers: string[]): SmartColumnMapping {
  const log: string[] = [];
  const columnScores: { [key: string]: { [index: number]: number } } = {
    product: {},
    category: {},
    variant: {},
    price: {},
    quantity: {},
    revenue: {},
    sku: {},
    date: {},
  };
  
  // Analisis setiap kolom
  headers.forEach((header, colIndex) => {
    log.push(`\n=== Analyzing Column ${colIndex}: "${header}" ===`);
    
    // Ambil sample values (skip row pertama karena mungkin header)
    const sampleSize = Math.min(50, data.length);
    const columnValues = data.slice(0, sampleSize).map(row => row[colIndex]);
    const allColumnValues = data.map(row => row[colIndex]);
    
    // Skip empty columns
    const nonEmptyValues = columnValues.filter(v => v !== null && v !== undefined && v !== '');
    if (nonEmptyValues.length === 0) {
      log.push(`  ❌ Empty column, skipped`);
      return;
    }
    
    log.push(`  Sample values: ${JSON.stringify(nonEmptyValues.slice(0, 3))}`);
    
    // Test untuk setiap type
    let productScore = 0;
    let categoryScore = 0;
    let variantScore = 0;
    let priceScore = 0;
    let quantityScore = 0;
    let revenueScore = 0;
    let skuScore = 0;
    let dateScore = 0;
    
    nonEmptyValues.forEach(value => {
      if (isLikelyProductName(value)) productScore++;
      if (isLikelyCategory(value, allColumnValues)) categoryScore++;
      if (isLikelyVariant(value)) variantScore++;
      if (isLikelyPrice(value, allColumnValues)) priceScore++;
      if (isLikelyQuantity(value, allColumnValues)) quantityScore++;
      if (isLikelyRevenue(value, allColumnValues)) revenueScore++;
      if (isLikelySKU(value, allColumnValues)) skuScore++;
      if (isLikelyDate(value)) dateScore++;
    });
    
    // Normalisasi scores (0-100)
    const total = nonEmptyValues.length;
    columnScores.product[colIndex] = (productScore / total) * 100;
    columnScores.category[colIndex] = (categoryScore / total) * 100;
    columnScores.variant[colIndex] = (variantScore / total) * 100;
    columnScores.price[colIndex] = (priceScore / total) * 100;
    columnScores.quantity[colIndex] = (quantityScore / total) * 100;
    columnScores.revenue[colIndex] = (revenueScore / total) * 100;
    columnScores.sku[colIndex] = (skuScore / total) * 100;
    columnScores.date[colIndex] = (dateScore / total) * 100;
    
    log.push(`  Scores: Product=${columnScores.product[colIndex].toFixed(0)}% Category=${columnScores.category[colIndex].toFixed(0)}% Variant=${columnScores.variant[colIndex].toFixed(0)}% Price=${columnScores.price[colIndex].toFixed(0)}% Qty=${columnScores.quantity[colIndex].toFixed(0)}% Revenue=${columnScores.revenue[colIndex].toFixed(0)}% SKU=${columnScores.sku[colIndex].toFixed(0)}%`);
  });
  
  // SMART SELECTION: Pilih kolom dengan strategi pintar
  // Untuk numeric columns, pisahkan Price vs Quantity berdasarkan magnitude
  const numericColumns: Array<{index: number, avg: number, max: number}> = [];
  
  headers.forEach((header, colIndex) => {
    const columnValues = data.map(row => row[colIndex]);
    const numbers = columnValues
      .map(v => {
        const s = String(v).trim().replace(/\./g, '').replace(/,/g, '');
        return parseFloat(s);
      })
      .filter(n => !isNaN(n) && n > 0);
    
    if (numbers.length > data.length * 0.5) { // Kolom mayoritas angka
      const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      const max = Math.max(...numbers);
      numericColumns.push({ index: colIndex, avg, max });
    }
  });
  
  // Sort by average value
  numericColumns.sort((a, b) => b.avg - a.avg);
  
  log.push(`\n=== Numeric Columns Analysis ===`);
  numericColumns.forEach(nc => {
    log.push(`Column ${nc.index}: avg=${nc.avg.toFixed(0)}, max=${nc.max.toFixed(0)}`);
  });
  
  // NEW STRATEGY: Prioritas deteksi Revenue dulu (kolom total/amount)
  // Revenue biasanya kolom terbesar (hasil price × quantity)
  // Lalu Price (kedua terbesar), lalu Quantity (terkecil)
  let revenueCol = -1;
  let priceCol = -1;
  let quantityCol = -1;
  
  if (numericColumns.length >= 3) {
    // 3+ kolom numeric: Revenue (terbesar) > Price (kedua) > Quantity (ketiga)
    revenueCol = numericColumns[0].index;
    priceCol = numericColumns[1].index;
    quantityCol = numericColumns[2].index;
    log.push(`\n💡 Smart assignment (3+ columns): Revenue=Col${revenueCol}, Price=Col${priceCol}, Quantity=Col${quantityCol}`);
  } else if (numericColumns.length === 2) {
    // 2 kolom numeric: Cek apakah ada yang cocok pattern revenue
    // Jika avg kolom pertama >> kolom kedua, kemungkinan: Revenue & Quantity
    // Jika ratio lebih kecil: Price & Quantity
    const ratio = numericColumns[0].avg / numericColumns[1].avg;
    if (ratio > 10) {
      // Kemungkinan Revenue & Quantity (tanpa kolom price terpisah)
      revenueCol = numericColumns[0].index;
      quantityCol = numericColumns[1].index;
      log.push(`\n💡 Smart assignment (2 columns, high ratio): Revenue=Col${revenueCol}, Quantity=Col${quantityCol}`);
    } else {
      // Kemungkinan Price & Quantity (data lama tanpa kolom revenue)
      priceCol = numericColumns[0].index;
      quantityCol = numericColumns[1].index;
      log.push(`\n💡 Smart assignment (2 columns): Price=Col${priceCol}, Quantity=Col${quantityCol}`);
    }
  } else if (numericColumns.length === 1) {
    // Hanya ada 1 kolom numeric - anggap sebagai quantity
    quantityCol = numericColumns[0].index;
    log.push(`\n💡 Only 1 numeric column: Quantity=Col${quantityCol}`);
  }
  
  // Pilih kolom lainnya dengan score tertinggi
  const getTopColumn = (type: string, excludeIndices: number[] = []): number => {
    const scores = columnScores[type];
    const entries = Object.entries(scores)
      .filter(([idx]) => !excludeIndices.includes(parseInt(idx)));
    
    if (entries.length === 0) return -1;
    
    const sorted = entries.sort(([, a], [, b]) => (b as number) - (a as number));
    const topScore = sorted[0][1] as number;
    
    // Require minimum confidence - lower untuk lebih fleksibel
    const minConfidence = type === 'product' ? 20 : 10;
    if (topScore < minConfidence) return -1;
    
    return parseInt(sorted[0][0]);
  };
  
  const productCol = getTopColumn('product');
  const categoryCol = getTopColumn('category');
  const variantCol = getTopColumn('variant');
  const skuCol = getTopColumn('sku');
  const dateCol = getTopColumn('date');
  
  // Fallback: Jika revenue/price/quantity tidak terdeteksi, coba dengan threshold lebih rendah
  if (revenueCol < 0) {
    revenueCol = getTopColumn('revenue');
  }
  if (priceCol < 0) {
    priceCol = getTopColumn('price', revenueCol >= 0 ? [revenueCol] : []);
  }
  if (quantityCol < 0) {
    const excludeIndices = [revenueCol, priceCol].filter(col => col >= 0);
    quantityCol = getTopColumn('quantity', excludeIndices);
  }
  
  log.push(`\n=== FINAL MAPPING ===`);
  log.push(`Product: Column ${productCol} (${columnScores.product[productCol]?.toFixed(0) || 0}%)`);
  log.push(`Category: Column ${categoryCol} (${columnScores.category[categoryCol]?.toFixed(0) || 0}%)`);
  log.push(`Variant: Column ${variantCol} (${columnScores.variant[variantCol]?.toFixed(0) || 0}%)`);
  log.push(`Revenue: Column ${revenueCol} (${columnScores.revenue[revenueCol]?.toFixed(0) || 0}%)`);
  log.push(`Price: Column ${priceCol} (${columnScores.price[priceCol]?.toFixed(0) || 0}%)`);
  log.push(`Quantity: Column ${quantityCol} (${columnScores.quantity[quantityCol]?.toFixed(0) || 0}%)`);
  log.push(`SKU: Column ${skuCol} (${columnScores.sku[skuCol]?.toFixed(0) || 0}%)`);
  
  console.log(log.join('\n'));
  
  // Calculate overall confidence
  const avgConfidence = [
    columnScores.product[productCol] || 0,
    columnScores.price[priceCol] || 0,
    columnScores.quantity[quantityCol] || 0,
  ].reduce((a, b) => a + b, 0) / 3;
  
  return {
    product: productCol,
    category: categoryCol >= 0 ? categoryCol : undefined,
    variant: variantCol >= 0 ? variantCol : undefined,
    revenue: revenueCol >= 0 ? revenueCol : undefined,
    price: priceCol,
    quantity: quantityCol,
    sku: skuCol >= 0 ? skuCol : undefined,
    date: dateCol >= 0 ? dateCol : undefined,
    confidence: avgConfidence,
  };
}

/**
 * READ EXCEL FILE
 */
async function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Ambil sheet pertama
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON - header akan jadi index (0, 1, 2, ...)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        resolve(jsonData as any[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}

/**
 * READ CSV FILE
 */
async function readCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve(results.data as any[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * MAIN SMART FILE READER
 * Baca file apapun (CSV/XLSX) dan deteksi struktur otomatis
 */
export async function smartReadFile(file: File): Promise<SmartReadResult> {
  const fileName = file.name.toLowerCase();
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
  const isCSV = fileName.endsWith('.csv');
  
  if (!isExcel && !isCSV) {
    throw new Error('Format file tidak didukung. Gunakan CSV atau XLSX');
  }
  
  console.log(`📁 Reading file: ${file.name}`);
  console.log(`📊 File type: ${isExcel ? 'XLSX' : 'CSV'}`);
  
  // Read file
  let rawData: any[];
  if (isExcel) {
    rawData = await readExcelFile(file);
  } else {
    rawData = await readCSVFile(file);
  }
  
  console.log(`✅ File loaded: ${rawData.length} rows`);
  
  // Deteksi apakah row pertama adalah header atau data
  const firstRow = rawData[0];
  const secondRow = rawData[1];
  
  console.log('🔍 First row sample:', firstRow?.slice(0, 5));
  console.log('🔍 Second row sample:', secondRow?.slice(0, 5));
  
  // Jika row pertama semua string dan row kedua ada angka, kemungkinan row pertama = header
  const firstRowAllStrings = firstRow.every((v: any) => typeof v === 'string' || v === undefined || v === null);
  const secondRowHasNumbers = secondRow?.some((v: any) => typeof v === 'number' || !isNaN(parseFloat(String(v))));
  
  let headers: string[];
  let dataRows: any[];
  
  if (firstRowAllStrings && secondRowHasNumbers) {
    // Row pertama adalah header
    headers = firstRow.map((h: any, i: number) => h || `Column ${i}`);
    dataRows = rawData.slice(1);
    console.log(`📋 Header detected: ${headers.slice(0, 5).join(', ')}...`);
  } else {
    // Tidak ada header, generate
    headers = firstRow.map((_: any, i: number) => `Column ${i}`);
    dataRows = rawData;
    console.log(`📋 No header detected, using: ${headers.slice(0, 5).join(', ')}...`);
  }
  
  // Filter empty rows
  dataRows = dataRows.filter(row => 
    row.some((cell: any) => cell !== null && cell !== undefined && cell !== '')
  );
  
  console.log(`📊 Data rows: ${dataRows.length}`);
  console.log(`📊 Columns: ${headers.length}`);
  
  // Show first data row for debugging
  if (dataRows.length > 0) {
    console.log(`📊 First data row:`, dataRows[0]);
  }
  
  // 🔴 PRIORITY 1: ALWAYS try header-based detection FIRST!
  console.log(`\n🧠 Starting HEADER-BASED column detection (Priority 1)...`);
  const mapping = { 
    product: -1, 
    price: -1, 
    quantity: -1, 
    category: undefined, 
    variant: undefined, 
    revenue: undefined,
    sku: undefined,
    confidence: 0 
  };
  
  // Deteksi dari nama header FIRST
  headers.forEach((header, idx) => {
    const h = String(header || '').toLowerCase().trim();
    const headerOriginal = String(header || '').trim();
    
    console.log(`🔍 Scanning header [${idx}]: "${headerOriginal}" (normalized: "${h}")`);
    
    // Product patterns
    if (mapping.product < 0) {
      if (h.includes('produk') || h.includes('product') || h.includes('nama') || h.includes('name') || h.includes('item')) {
        mapping.product = idx;
        console.log(`  ✅ Found PRODUCT at index ${idx}`);
      }
    }
    
    // Price patterns
    if (mapping.price < 0) {
      if (h.includes('harga') || h.includes('price') || h.includes('satuan') || h.includes('unit price')) {
        mapping.price = idx;
        console.log(`  ✅ Found PRICE at index ${idx}`);
      }
    }
    
    // 🔴🔴🔴 QUANTITY - HIGHEST PRIORITY!
    if (mapping.quantity < 0) {
      // EXACT MATCH (case-sensitive)
      if (headerOriginal === 'Qty' || headerOriginal === 'QTY' || headerOriginal === 'qty') {
        mapping.quantity = idx;
        console.log(`  ✅✅✅ EXACT MATCH: Found QTY at index ${idx}`);
      }
      // Pattern matching
      else if (h.includes('qty') || h.includes('quantity') || h.includes('jumlah') || 
               h.includes('terjual') || h.includes('sold') || h.includes('penjualan') || 
               h.includes('kuantitas') || h.includes('amount') || h.includes('count') || 
               h.includes('units') || h.includes('unit') || h.includes('pcs') || h.includes('pieces')) {
        mapping.quantity = idx;
        console.log(`  ✅ Found QUANTITY at index ${idx}`);
      }
    }
    
    // Category patterns
    if (mapping.category === undefined) {
      if (h.includes('kategori') || h.includes('category') || h.includes('jenis') || h.includes('type')) {
        mapping.category = idx;
        console.log(`  ✅ Found CATEGORY at index ${idx}`);
      }
    }
    
    // Variant/Size patterns
    if (mapping.variant === undefined) {
      if (h.includes('variasi') || h.includes('variant') || h.includes('size') || h.includes('ukuran') || h.includes('warna') || h.includes('color')) {
        mapping.variant = idx;
        console.log(`  ✅ Found VARIANT/SIZE at index ${idx}`);
      }
    }
    
    // Revenue/Total patterns
    if (mapping.revenue === undefined) {
      if (h.includes('total') || h.includes('revenue') || h.includes('pendapatan') || h.includes('omzet') || h.includes('penjualan')) {
        mapping.revenue = idx;
        console.log(`  ✅ Found REVENUE/TOTAL at index ${idx}`);
      }
    }
    
    // 🔴 CRITICAL: NEVER assign DATE, CHANNEL, or LOCATION columns!
    const isExcludedColumn = h.includes('date') || h.includes('tanggal') || h.includes('waktu') || 
                             h.includes('time') || h.includes('channel') || h.includes('platform') ||
                             h.includes('city') || h.includes('kota') || h.includes('buyer') ||
                             h.includes('order') || h.includes('id');
    
    if (isExcludedColumn) {
      if (mapping.quantity === idx) {
        console.error(`  ❌ CRITICAL: Excluded column assigned as quantity! Resetting...`);
        mapping.quantity = -1;
      }
    }
  });
  
  console.log(`\n📊 HEADER DETECTION SUMMARY:`);
  console.log(`  Product: ${mapping.product >= 0 ? `✅ Index ${mapping.product}` : '❌ Not found'}`);
  console.log(`  Price: ${mapping.price >= 0 ? `✅ Index ${mapping.price}` : '❌ Not found'}`);
  console.log(`  Quantity: ${mapping.quantity >= 0 ? `✅ Index ${mapping.quantity}` : '⚠️ Not found (optional)'}`);
  console.log(`  Category: ${mapping.category !== undefined ? `✅ Index ${mapping.category}` : '⚠️ Not found (optional)'}`);
  console.log(`  Variant: ${mapping.variant !== undefined ? `✅ Index ${mapping.variant}` : '⚠️ Not found (optional)'}`);
  console.log(`  Revenue: ${mapping.revenue !== undefined ? `✅ Index ${mapping.revenue}` : '⚠️ Not found (optional)'}`);
  
  // Set confidence based on what we found
  mapping.confidence = 100;
  
  // 🔴 Fallback only if Product or Price not found (Quantity is optional)
  if (mapping.product < 0 || mapping.price < 0) {
    console.log(`\n⚠️ FALLBACK: Product or Price not found via headers, trying content analysis...`);
    
    const columnTypes = headers.map((_, colIdx) => {
      const values = dataRows.slice(0, 10).map(row => row[colIdx]);
      const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '');
      
      if (nonEmpty.length === 0) return 'empty';
      
      // Check if mostly numbers
      const numbers = nonEmpty.filter(v => {
        const parsed = parseSmartNumber(v);
        return !isNaN(parsed) && parsed !== 0;
      });
      
      if (numbers.length / nonEmpty.length > 0.8) return 'number';
      
      // Check if long text (product names)
      const avgLength = nonEmpty.reduce((sum, v) => sum + String(v).length, 0) / nonEmpty.length;
      if (avgLength > 15) return 'text-long';
      
      return 'text-short';
    });
    
    console.log('📊 Column types:', columnTypes);
    
    // Find first long text column = product
    if (mapping.product < 0) {
      const productIdx = columnTypes.findIndex(t => t === 'text-long');
      if (productIdx >= 0) {
        mapping.product = productIdx;
        console.log(`✅ Assigned product column by type: ${productIdx}`);
      }
    }
    
    // Find numeric columns
    const numericIndices = columnTypes
      .map((t, i) => ({ type: t, index: i }))
      .filter(c => c.type === 'number')
      .map(c => c.index);
    
    console.log('📊 Numeric columns:', numericIndices);
    
    if (numericIndices.length >= 2) {
      // Calculate averages to distinguish price vs quantity
      const numericStats = numericIndices.map(idx => {
        const values = dataRows.slice(0, 20).map(row => {
          const v = row[idx];
          return parseSmartNumber(v);
        }).filter(n => !isNaN(n) && n > 0);
        
        const avg = values.length > 0 
          ? values.reduce((a, b) => a + b, 0) / values.length 
          : 0;
        
        return { index: idx, avg, count: values.length };
      }).filter(s => s.count > 0);
      
      // Sort by average (highest = price)
      numericStats.sort((a, b) => b.avg - a.avg);
      
      console.log('📊 Numeric stats:', numericStats);
      
      if (mapping.price < 0 && numericStats.length > 0) {
        mapping.price = numericStats[0].index;
        console.log(`✅ Assigned price column by average: ${mapping.price} (avg: ${numericStats[0].avg})`);
      }
      
      // ⚠️ QUANTITY IS OPTIONAL - Don't assign if not found!
      // User demand: "Kalo gada quantity, jangan ngarang! Skip analisis unit!"
      if (mapping.quantity < 0 && numericStats.length > 1) {
        // Only assign if it's clearly different from price AND not a date column
        const potentialQty = numericStats[1];
        const potentialHeader = headers[potentialQty.index]?.toLowerCase() || '';
        
        // 🔴 CRITICAL: Skip if looks like date column
        const isDateColumn = potentialHeader.includes('date') || 
                            potentialHeader.includes('tanggal') || 
                            potentialHeader.includes('waktu') || 
                            potentialHeader.includes('time') ||
                            potentialQty.avg > 10000000; // Dates become very large numbers
        
        if (!isDateColumn && potentialQty.avg < numericStats[0].avg * 0.8 && potentialQty.avg < 1000) {
          mapping.quantity = potentialQty.index;
          console.log(`✅ Assigned quantity column by average: ${mapping.quantity} (avg: ${potentialQty.avg})`);
        } else {
          console.log(`⚠️ No clear quantity column detected - will skip quantity analysis`);
          if (isDateColumn) {
            console.log(`   Rejected potential column ${potentialQty.index} (looks like date: "${potentialHeader}")`);
          }
        }
      } else if (mapping.quantity < 0) {
        console.log(`⚠️ No quantity column found - quantity analysis will be skipped`);
      }
      
      // If only one numeric column and price not assigned, use it for price ONLY
      if (mapping.price < 0 && numericIndices.length === 1) {
        mapping.price = numericIndices[0];
        console.log(`✅ Assigned single numeric column to price: ${mapping.price}`);
      }
    }
  }
  
  console.log(`\n=== FINAL DETECTION RESULTS ===`);
  console.log(`Product Column: ${mapping.product} (${mapping.product >= 0 ? '✅' : '❌'})`);
  console.log(`Price Column: ${mapping.price} (${mapping.price >= 0 ? '✅' : '❌'})`);
  console.log(`Quantity Column: ${mapping.quantity} (${mapping.quantity >= 0 ? '✅ FOUND' : '⚠️ OPTIONAL - NOT FOUND'})`);
  console.log(`Confidence: ${mapping.confidence.toFixed(1)}%`);
  
  // 🔴 FINAL VALIDATION: Check if quantity column contains reasonable values
  if (mapping.quantity >= 0) {
    console.log(`\n🔍 VALIDATING QUANTITY COLUMN VALUES...`);
    const qtyHeader = headers[mapping.quantity];
    const sampleValues = dataRows.slice(0, 5).map(row => row[mapping.quantity]);
    
    console.log(`  Qty Column: Index ${mapping.quantity} = "${qtyHeader}"`);
    console.log(`  Sample values: ${sampleValues.join(', ')}`);
    
    // Check if values are reasonable (should be small numbers like 1-100)
    const hasUnreasonableValues = sampleValues.some(val => {
      const str = String(val);
      // Check for date patterns
      if (str.includes('-') && str.length > 8) return true;
      // Check for very large numbers
      const num = parseInt(str.replace(/[^\d]/g, ''), 10);
      return num > 10000;
    });
    
    if (hasUnreasonableValues) {
      console.error(`❌❌❌ QUANTITY VALIDATION FAILED!`);
      console.error(`  Values look suspicious: ${sampleValues.join(', ')}`);
      console.error(`  These look like DATES or PRICES, not quantities!`);
      console.error(`  DISABLING quantity column to prevent errors...`);
      mapping.quantity = -1;
    } else {
      console.log(`✅ Quantity values look correct (small numbers expected for unit sales)`);
    }
  }
  
  // 🔴 DEBUG: Show ALL headers for troubleshooting
  console.log(`\n📋 ALL DETECTED COLUMNS:`);
  headers.forEach((header, idx) => {
    let tag = '';
    if (idx === mapping.product) tag = '← PRODUCT';
    if (idx === mapping.price) tag = '← PRICE';
    if (idx === mapping.quantity) tag = '← QUANTITY ⭐';
    if (idx === mapping.revenue) tag = '← REVENUE/TOTAL';
    if (idx === mapping.variant) tag = '← SIZE/VARIANT';
    if (idx === mapping.category) tag = '← CATEGORY';
    console.log(`  [${idx}] "${header}" ${tag}`);
  });
  
  // ⚠️ CRITICAL: Only product and price are REQUIRED, quantity is OPTIONAL
  if (mapping.product < 0 || mapping.price < 0) {
    const missingColumns = [];
    if (mapping.product < 0) missingColumns.push('PRODUK');
    if (mapping.price < 0) missingColumns.push('HARGA/REVENUE');
    
    console.error('❌ Detection failed!');
    console.error('Missing REQUIRED columns:', missingColumns.join(', '));
    console.error('Note: QUANTITY column is OPTIONAL');
    console.error('Available headers:', headers);
    console.error('Sample data row 1:', dataRows[0]);
    
    throw new Error(
      `Gagal mendeteksi kolom: ${missingColumns.join(', ')}.\n\n` +
      `Kolom yang terdeteksi:\n` +
      headers.map((h, i) => `${i}: ${h}`).join('\n') + '\n\n' +
      `Pastikan file Excel/CSV Anda memiliki:\n` +
      `• Kolom nama produk (teks)\n` +
      `• Kolom harga (angka besar, contoh: 100.000)\n` +
      `• Kolom jumlah terjual (angka, contoh: 50)\n\n` +
      `Tip: Buka Console Browser (F12) untuk melihat detail deteksi.`
    );
  }
  
  console.log(`\n✅ SMART detection complete!`);
  console.log(`   Confidence: ${mapping.confidence.toFixed(1)}%`);
  
  return {
    data: dataRows,
    mapping,
    fileType: isExcel ? 'xlsx' : 'csv',
    rawHeaders: headers,
    detectionLog: [],
  };
}
