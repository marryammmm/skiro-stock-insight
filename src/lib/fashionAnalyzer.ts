/**
 * SKIRO Fashion Analytics - ANTI-KEBANGKRUTAN SYSTEM
 * 
 * MISI: Membantu UMKM Fashion menghindari kebangkrutan akibat DEADSTOCK
 * 
 * MASALAH UMUM UMKM:
 * ❌ Kebanyakan stock produk yang TIDAK LAKU (deadstock)
 * ❌ Kekurangan stock produk yang LARIS (stockout)
 * ❌ Modal terbuang untuk produk slow moving
 * ❌ Tidak tau kapan harus STOP produksi
 * 
 * SOLUSI SKIRO:
 * ✅ Deteksi otomatis kolom CSV/XLSX dengan AI
 * ✅ Analisis revenue-based (bukan cuma quantity)
 * ✅ Financial health scoring untuk setiap produk
 * ✅ Cash flow impact analysis
 * ✅ ROI calculation per product
 * ✅ Urgent action recommendations
 * ✅ Deadstock prevention alerts
 * 
 * Powered by SKIRO INTELLIGENCE ENGINE V2
 */
import Papa from 'papaparse';
import { generateIntelligenceReport, type SkiroIntelligenceReport } from './skiroIntelligence';
import { generateUltraSmartReport, type SkiroIntelligenceV2Report } from './skiroIntelligenceV2';
import { generateSupremeAIReport, type SkiroSupremeAIReport } from './skiroSupremeAI';
import { smartReadFile, type SmartColumnMapping } from './smartFileReader';
import { parseSmartNumber } from './numberParser';

export interface FashionProduct {
  name: string;
  category?: string;
  size?: string;
  price: number;
  quantity: number;
  revenue: number;
}

export interface SizeAnalysis {
  size: string;
  totalSold: number;
  revenue: number;
  productCount: number;
  percentage: number;
  status: 'hot' | 'normal' | 'slow';
}

export interface CategoryAnalysis {
  category: string;
  totalSold: number;
  revenue: number;
  productCount: number;
  percentage: number;
  avgPrice: number;
}

export interface StockRecommendation {
  productName: string;
  category?: string;
  size?: string;
  currentSold: number;
  action: 'INCREASE' | 'MAINTAIN' | 'REDUCE' | 'DISCONTINUE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  quantityRecommendation: string;
  deadstockRisk: number;
}

export interface DeadstockProduct {
  name: string;
  category?: string;
  size?: string;
  soldUnits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  reason?: string; // Detailed explanation why it's deadstock
  deadstockPercentage?: number; // Risk percentage
}

export interface SizePerformance {
  size: string;
  totalProducts: number;
  totalSold: number;
  totalRevenue: number;
  avgSoldPerProduct: number;
  revenuePerUnit: number;
}

export interface DeadstockAnalysis {
  totalDeadstockRisk: number;
  productsAtRisk: DeadstockProduct[];
  estimatedDeadstockValue: number;
  sizePerformance?: SizePerformance[]; // Performance by size
  slowMovingSizes?: string[]; // List of slow-moving sizes
}

// === FINANCIAL HEALTH & ANTI-BANKRUPTCY FEATURES ===

export interface ProductFinancialHealth {
  productName: string;
  size?: string;
  healthScore: number; // 0-100 (100 = sangat sehat)
  roi: number; // Return on Investment %
  velocityScore: number; // Kecepatan penjualan (0-100)
  cashFlowImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  riskLevel: 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';
  estimatedStockDays: number; // Estimasi berapa hari stock habis terjual
  recommendation: string;
  actionPriority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FinancialHealthReport {
  overallHealthScore: number; // 0-100
  totalCashAtRisk: number; // Total modal tertahan di slow movers
  healthyProducts: number; // Produk dengan health score > 70
  riskyProducts: number; // Health score 40-70
  criticalProducts: number; // Health score < 40
  bankruptcyRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  urgentActionNeeded: boolean;
  urgentActions: string[];
  productHealth: ProductFinancialHealth[];
  cashFlowEfficiency: number; // 0-100%
  recommendedFocus: string[]; // Top products to focus on
}

export interface FashionAnalysisResult {
  products: FashionProduct[];
  sizeAnalysis: SizeAnalysis[];
  categoryAnalysis: CategoryAnalysis[];
  stockRecommendations: StockRecommendation[];
  deadstockAnalysis: DeadstockAnalysis;
  insights: string[];
  conclusion: string;
  totalRevenue: number;
  totalUnits: number;
  averagePrice: number;
  // SKIRO INTELLIGENCE ENGINE - Enhanced Analytics
  intelligenceReport?: SkiroIntelligenceReport;
  // SKIRO INTELLIGENCE ENGINE V2 - Ultra Smart Edition
  ultraSmartReport?: SkiroIntelligenceV2Report;
  // SKIRO SUPREME AI - The Ultimate All-in-One Business Consultant
  supremeAIReport?: SkiroSupremeAIReport;
  // FINANCIAL HEALTH - Anti-Bankruptcy System
  financialHealth?: FinancialHealthReport;
}

/**
 * AI-POWERED SIZE DETECTION - ULTRA SMART VERSION
 * Robot terpintar sedunia untuk deteksi ukuran
 * TIDAK AKAN PERNAH salah membaca harga sebagai size!
 */
function isLikelySize(value: string): boolean {
  if (!value || value.length === 0) return false;
  
  const cleaned = value.toLowerCase().trim();
  const original = value.trim();
  
  // ========================================
  // CRITICAL: NEGATIVE PATTERNS FIRST!
  // Cek dulu apa yang BUKAN size
  // ========================================
  
  // 1. HARGA - Angka besar (>1000) atau ada format harga
  if (/^\d+$/.test(cleaned)) {
    const num = parseInt(cleaned);
    // Jika angka > 1000 = PASTI HARGA, bukan size!
    if (num > 1000) return false;
  }
  
  // 2. Format harga dengan separator (75.000, 75,000, 750000)
  if (/^\d{3,}[.,]?\d*$/.test(cleaned)) {
    const num = parseInt(cleaned.replace(/[.,]/g, ''));
    if (num > 1000) return false; // Pasti harga
  }
  
  // 3. Ada kata "harga", "price", "rupiah", "idr", "rp"
  if (/harga|price|rupiah|idr|rp/i.test(cleaned)) return false;
  
  // 4. Ada currency symbols
  if (/[$€£¥₹]/i.test(original)) return false;
  
  // 5. Terlalu panjang (>12 karakter) = nama produk
  if (cleaned.length > 12) return false;
  
  // 6. Mengandung kata produk
  const productWords = [
    'baju', 'celana', 'kemeja', 'kaos', 'dress', 'shirt', 'pants', 
    'jacket', 'hoodie', 'sweater', 'jaket', 'rok', 'blouse'
  ];
  if (productWords.some(word => cleaned.includes(word))) return false;
  
  // 7. Quantity patterns (qty, jumlah, pcs, pieces, unit)
  if (/qty|jumlah|pcs|pieces|unit|total/i.test(cleaned)) return false;
  
  // ========================================
  // POSITIVE PATTERNS - Ini adalah SIZE
  // ========================================
  
  // Pattern 1: Standard clothing sizes (PRIORITAS TERTINGGI)
  const standardSizes = [
    'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 
    '2xl', '3xl', '4xl', '5xl',
    'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'
  ];
  if (standardSizes.includes(cleaned)) return true;
  
  // Pattern 2: All size / Free size / One size
  if (/^(all|free|one)\s*(size)?$/i.test(cleaned)) return true;
  
  // Pattern 3: Single letter sizes (PERSIS S, M, L, X saja - tanpa angka)
  // PENTING: Deteksi X dan L sebagai size clothing
  if (/^[smlx]$/i.test(cleaned)) return true;
  
  // Pattern 4: Multiple X's (XX, XXX) sebagai size
  if (/^x+$/i.test(cleaned)) return true;
  
  // Pattern 5: Combo letter sizes (S/M, M/L, L/X, X/L)
  if (/^[smlx]+[\/\-][smlx]+$/i.test(cleaned)) return true;
  
  // Pattern 5: Pure numbers KECIL (hanya untuk ukuran sepatu/jeans)
  if (/^\d+$/.test(cleaned)) {
    const num = parseInt(cleaned);
    // CRITICAL: Angka 1-10 bisa jadi quantity, BUKAN size!
    // Hanya terima sebagai size jika dalam range SPESIFIK:
    // - Ukuran anak: SKIP (terlalu ambiguous dengan quantity)
    // - Ukuran jeans: 27-32
    // - Ukuran sepatu: 36-46
    // REJECT angka 1-10 karena kemungkinan besar adalah QUANTITY!
    if (num >= 1 && num <= 10) {
      return false; // REJECT! Ini kemungkinan besar QUANTITY
    }
    if ((num >= 27 && num <= 32) || (num >= 36 && num <= 46)) {
      return true;
    }
  }
  
  // Pattern 6: Number dengan unit jeans (27", 28", 30")
  if (/^(2[7-9]|3[0-2])["']$/i.test(cleaned)) return true;
  
  // Pattern 7: Age-based sizes (2T, 3T, 4Y)
  if (/^[1-9][ty]$/i.test(cleaned)) return true;
  
  // Pattern 8: European combo sizes (36/38, 40/42) - HATI-HATI!
  if (/^\d+\/\d+$/.test(cleaned)) {
    const parts = cleaned.split('/').map(p => parseInt(p));
    // Hanya terima jika KEDUA angka dalam range sepatu (35-46)
    if (parts.every(p => p >= 35 && p <= 46 && p < 100)) return true;
  }
  
  // Pattern 9: Numeric ranges untuk size (27-28, 29-30)
  if (/^(\d+)-(\d+)$/.test(cleaned)) {
    const match = cleaned.match(/^(\d+)-(\d+)$/);
    if (match) {
      const [_, num1, num2] = match;
      const n1 = parseInt(num1);
      const n2 = parseInt(num2);
      // Range kecil untuk jeans (27-32)
      if (n1 >= 27 && n1 <= 32 && n2 >= 27 && n2 <= 32 && n2 - n1 <= 2) {
        return true;
      }
    }
  }
  
  // Jika tidak match semua pattern = BUKAN size
  return false;
}

/**
 * ULTRA SMART COLUMN DETECTION - Deteksi kolom dengan AI-like logic
 * Sistem akan menganalisis ISI CSV, bukan hanya nama kolom
 * Cocok untuk SEMUA jenis bisnis, tidak hanya fashion
 */
function detectColumnByContent(data: any[], columnName: string): 'product' | 'category' | 'size' | 'price' | 'quantity' | 'revenue' | 'date' | null {
  if (!data || data.length === 0) return null;
  
  // Ambil 30 sample untuk akurasi maksimal
  const sampleSize = Math.min(30, data.length);
  const samples = data.slice(0, sampleSize).map(row => String(row[columnName] || '').trim());
  const validSamples = samples.filter(s => s.length > 0);
  
  if (validSamples.length === 0) return null;
  
  // Get column name early for checking
  const col = columnName.toLowerCase();
  
  // ========================================
  // STEP 1: QUANTITY & PRICE & REVENUE DETECTION FIRST!
  // CRITICAL: Detect numeric columns BEFORE size detection
  // Karena angka kecil (1,2,3) bisa salah dibaca sebagai size
  // ========================================
  
  // STEP 2: NUMERIC DETECTION - ENHANCED (revenue vs price vs quantity)
  const lowerSamples = validSamples.map(s => s.toLowerCase());
  const numericValues = lowerSamples
    .map(s => {
      const cleaned = s.replace(/[^0-9.]/g, ''); // Hapus semua kecuali angka
      return Number(cleaned);
    })
    .filter(n => !isNaN(n) && n > 0);
  
  const numericRatio = numericValues.length / validSamples.length;
  
  if (numericRatio > 0.7) { // >70% adalah angka
    const avgValue = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    const maxValue = Math.max(...numericValues);
    const minValue = Math.min(...numericValues);
    
    // SUPER SMART LOGIC untuk bedakan Revenue vs Price vs Quantity:
    
    // 0. REVENUE/TOTAL PASTI jika:
    //    - Ada kata "total", "revenue", "omzet", "pendapatan", "subtotal", "amount"
    //    - Biasanya nilai terbesar (hasil price × quantity)
    if (col.includes('total') || col.includes('revenue') || col.includes('omzet') || 
        col.includes('pendapatan') || col.includes('subtotal') || col.includes('amount') ||
        col.includes('sales') && !col.includes('quantity')) {
      return 'revenue';
    }
    // Revenue biasanya punya range sangat besar dan nilai rata-rata tinggi
    if (avgValue > 50000 && (maxValue / (minValue || 1)) > 20) {
      return 'revenue';
    }
    
    // 1. HARGA PASTI jika:
    //    - Ada kata "harga", "price", "rupiah", "satuan" di nama kolom
    //    - Rata-rata > 10000 (harga fashion minimal 10rb)
    //    - Max value > 50000 (ada harga mahal)
    if (col.includes('harga') || col.includes('price') || col.includes('rupiah') || col.includes('biaya') || col.includes('cost') || col.includes('satuan')) {
      return 'price';
    }
    if (avgValue > 10000 && avgValue < 500000 && maxValue > 50000) {
      return 'price';
    }
    
    // 2. QUANTITY PASTI jika:
    //    - Ada kata "jumlah", "qty", "quantity", "terjual", "sold"
    //    - Rata-rata < 100 DAN max < 500
    //    - Semua nilai integer kecil (1-100)
    if (col.includes('jumlah') || col.includes('qty') || col.includes('quantity') || col.includes('terjual') || col.includes('sold') || col.includes('unit') || col.includes('stock')) {
      return 'quantity';
    }
    if (avgValue < 100 && maxValue < 500) {
      return 'quantity';
    }
    
    // 3. HEURISTIC untuk grey area (500-10000):
    //    - Range besar (max/min > 10) = kemungkinan harga
    //    - Range kecil (max/min < 5) = kemungkinan quantity
    const valueRange = maxValue / (minValue || 1);
    if (valueRange > 10 && avgValue > 1000) {
      return 'price'; // Variasi harga tinggi
    }
    if (valueRange < 5 && maxValue < 1000) {
      return 'quantity'; // Variasi quantity rendah
    }
    
    // 4. DEFAULT: jika masih grey, gunakan threshold
    //    - > 5000 = price
    //    - <= 5000 = quantity
    return avgValue > 5000 ? 'price' : 'quantity';
  }
  
  // ========================================
  // STEP 2: SIZE DETECTION (AFTER numeric detection!)
  // Gunakan AI-powered size detector
  // ONLY if column is NOT numeric (quantity/price already handled)
  // ========================================
  const sizeMatchCount = validSamples.filter(sample => isLikelySize(sample)).length;
  const sizeRatio = sizeMatchCount / validSamples.length;
  
  // CRITICAL: Pastikan ini BUKAN kolom numeric (quantity/price)!
  // Jika sudah terdeteksi sebagai numeric di atas, skip size detection
  const hasLargeNumbers = validSamples.some(sample => {
    const cleaned = sample.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned);
    return !isNaN(num) && num > 1000;
  });
  
  // Jika ada angka besar, ini BUKAN size column!
  if (!hasLargeNumbers) {
    // Jika >70% samples adalah size, ini kolom size!
    if (sizeRatio > 0.7) return 'size';
    
    // Jika 50-70% adalah size DAN kolom namanya mengandung keywords, ini size
    if (sizeRatio > 0.5 && (col.includes('size') || col.includes('ukuran') || col.includes('varian'))) return 'size';
  }
  
  // STEP 4: DATE DETECTION
  const datePatterns = [
    /\d{4}-\d{2}-\d{2}/,
    /\d{2}\/\d{2}\/\d{4}/,
    /\d{2}-\d{2}-\d{4}/,
    /\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i
  ];
  
  const dateMatchCount = lowerSamples.filter(sample =>
    datePatterns.some(pattern => pattern.test(sample))
  ).length;
  
  if (dateMatchCount / validSamples.length > 0.5) return 'date';
  
  // STEP 5: CATEGORY DETECTION
  const categoryKeywords = [
    // Fashion
    'atasan', 'bawahan', 'outer', 'outerwear', 'dress', 'aksesoris', 'accessories',
    'sepatu', 'shoes', 'tas', 'bags', 'pakaian', 'clothing', 'fashion', 'apparel',
    'top', 'bottom', 'footwear', 'hijab', 'muslim',
    // General
    'elektronik', 'makanan', 'minuman', 'alat', 'peralatan',
    'electronics', 'food', 'beverage', 'tools', 'equipment',
    'jenis', 'tipe', 'type', 'group', 'kelas', 'class'
  ];
  
  const categoryMatchCount = lowerSamples.filter(sample =>
    categoryKeywords.some(keyword => sample === keyword || sample.includes(keyword))
  ).length;
  
  if (categoryMatchCount / validSamples.length > 0.3) return 'category';
  
  // STEP 6: PRODUCT NAME DETECTION
  const avgLength = validSamples.reduce((sum, s) => sum + s.length, 0) / validSamples.length;
  const uniqueRatio = new Set(validSamples).size / validSamples.length;
  
  // Check if column name suggests product name
  if (col.includes('nama') && (col.includes('produk') || col.includes('product') || col.includes('barang'))) {
    return 'product';
  }
  
  const productKeywords = [
    // Fashion
    'baju', 'celana', 'kemeja', 'kaos', 'dress', 'rok', 'jaket', 'sweater', 'hoodie',
    'blazer', 'cardigan', 'polo', 'tunik', 'blus', 'gamis', 'mukena', 'jilbab',
    'kerudung', 'pashmina', 'scarf', 'sepatu', 'sandal', 'tas', 'dompet', 'belt',
    'topi', 'kaus kaki', 'legging', 'training', 'sport', 'outer', 'vest',
    'shirt', 'pants', 'jeans', 'skirt', 'jacket', 'coat', 'blouse', 't-shirt',
    'top', 'bottom', 'suit', 'shoes', 'bag', 'wallet', 'hat', 'socks',
    // General
    'produk', 'product', 'item', 'barang', 'nama', 'name'
  ];
  
  const productMatchCount = lowerSamples.filter(sample =>
    productKeywords.some(keyword => sample.includes(keyword))
  ).length;
  
  if (productMatchCount / validSamples.length > 0.3) return 'product';
  
  // Heuristic: panjang dan unique = kemungkinan product name
  if (avgLength > 8 && uniqueRatio > 0.7) return 'product';
  
  // STEP 7: FALLBACK - Cek nama kolom dengan Indonesian support
  
  // Product name variations
  if (col.includes('product') || col.includes('nama') || col.includes('item') || col.includes('barang') || col.includes('produk')) return 'product';
  
  // Category variations
  if (col.includes('category') || col.includes('kategori') || col.includes('jenis') || col.includes('type') || col.includes('kelompok')) return 'category';
  
  // Size variations
  if (col.includes('size') || col.includes('ukuran') || col.includes('variasi') || col.includes('varian')) return 'size';
  
  // Price variations - CRITICAL: Check 'satuan' for unit price!
  if (col.includes('price') || col.includes('harga') || col.includes('cost') || col.includes('satuan')) return 'price';
  
  // Quantity variations
  if (col.includes('qty') || col.includes('quantity') || col.includes('jumlah') || col.includes('terjual') || col.includes('stock') || col.includes('total')) return 'quantity';
  
  // Date variations
  if (col.includes('date') || col.includes('tanggal') || col.includes('time') || col.includes('waktu')) return 'date';
  
  return null;
}

/**
 * AI ULTRA SMART - Ekstrak Size dari Nama Produk
 * Contoh: "Kaos Putih M" → size = "M", cleanName = "Kaos Putih"
 * Contoh: "Celana Jeans Navy, L" → size = "L", cleanName = "Celana Jeans Navy"
 */
function extractSizeFromProductName(productName: string): { cleanName: string; size: string | null } {
  if (!productName) return { cleanName: productName, size: null };
  
  const original = productName.trim();
  let cleanName = original;
  let extractedSize: string | null = null;
  
  // Pattern 1: Size di akhir dengan separator (koma, dash, spasi)
  // "Kaos Putih, M" atau "Kaos Putih - XL" atau "Kaos Putih M" atau "Kaos X" atau "Kaos L"
  const endPatterns = [
    /[,\-\s]+([xX]{0,3}[sSlLmMxX]|[xX][lL]{1,3}|2[xX][lL]|3[xX][lL]|4[xX][lL]|5[xX][lL])$/i,
    /[,\-\s]+(all\s*size|free\s*size|one\s*size)$/i,
    /[,\-\s]+(\d{2,3})$/, // Size sepatu/jeans di akhir
    /\s+([SMLX])$/,  // Single letter size at the end (S, M, L, X)
  ];
  
  for (const pattern of endPatterns) {
    const match = original.match(pattern);
    if (match) {
      extractedSize = match[1].trim().toUpperCase();
      cleanName = original.replace(pattern, '').trim();
      
      // Validasi dengan isLikelySize
      if (isLikelySize(extractedSize)) {
        return { cleanName, size: extractedSize };
      }
    }
  }
  
  // Pattern 2: Size di tengah dengan separator jelas
  // "Hoodie Ov Cream, M Hoddie" → ambil M atau "Jersey X Black" → ambil X
  const middlePattern = /[,\-]\s*([xX]{0,3}[sSlLmMxX]|[xX][lL]{1,3}|[SMLX])\s+/i;
  const middleMatch = original.match(middlePattern);
  if (middleMatch) {
    extractedSize = middleMatch[1].trim().toUpperCase();
    if (isLikelySize(extractedSize)) {
      cleanName = original.replace(middleMatch[0], ' ').trim();
      return { cleanName, size: extractedSize };
    }
  }
  
  // Pattern 3: Size dalam tanda kurung
  // "Kaos Polos (M)" atau "Celana (XL)" atau "Jersey (X)"
  const bracketPattern = /\s*\(([xX]{0,3}[sSlLmMxX]|[xX][lL]{1,3}|2[xX][lL]|3[xX][lL]|[SMLX])\)/i;
  const bracketMatch = original.match(bracketPattern);
  if (bracketMatch) {
    extractedSize = bracketMatch[1].trim().toUpperCase();
    if (isLikelySize(extractedSize)) {
      cleanName = original.replace(bracketPattern, '').trim();
      return { cleanName, size: extractedSize };
    }
  }
  
  // Pattern 4: Scan kata per kata, cari yang match size pattern
  const words = original.split(/[\s,\-]+/);
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i].trim();
    if (isLikelySize(word)) {
      extractedSize = word.toUpperCase();
      // Hapus word ini dari nama
      words.splice(i, 1);
      cleanName = words.join(' ').trim();
      return { cleanName, size: extractedSize };
    }
  }
  
  // Jika tidak ada size ditemukan
  return { cleanName: original, size: null };
}

/**
 * Deteksi SEMUA kolom yang ada di CSV
 */
function detectAllColumns(data: any[]): {
  product: string | null;
  category: string | null;
  size: string | null;
  price: string | null;
  quantity: string | null;
  revenue: string | null;
  date: string | null;
} {
  if (!data || data.length === 0) {
    return { product: null, category: null, size: null, price: null, quantity: null, revenue: null, date: null };
  }
  
  const headers = Object.keys(data[0]);
  const detected: any = {
    product: null,
    category: null,
    size: null,
    price: null,
    quantity: null,
    revenue: null,
    date: null
  };
  
  // Cek setiap kolom satu per satu
  for (const header of headers) {
    const type = detectColumnByContent(data, header);
    
    if (type && !detected[type]) {
      detected[type] = header;
    }
  }
  
  return detected;
}

/**
 * Analisis SIZE performance
 * FLEKSIBEL: Return array kosong jika tidak ada data size
 */
function analyzeSizes(products: FashionProduct[]): SizeAnalysis[] {
  // Check apakah ada produk dengan size
  const productsWithSize = products.filter(p => p.size && p.size.trim() !== '');
  
  if (productsWithSize.length === 0) {
    console.log('ℹ️ No size data found - skipping size analysis');
    return []; // Return empty jika tidak ada data size
  }
  
  console.log(`📏 Analyzing sizes for ${productsWithSize.length} products with size info...`);
  
  const sizeMap = new Map<string, { totalSold: number; revenue: number; productCount: number }>();
  
  productsWithSize.forEach(product => {
    const size = product.size!.toUpperCase();
    const current = sizeMap.get(size) || { totalSold: 0, revenue: 0, productCount: 0 };
    sizeMap.set(size, {
      totalSold: current.totalSold + product.quantity,
      revenue: current.revenue + product.revenue,
      productCount: current.productCount + 1
    });
  });
  
  // Log detected sizes
  console.log(`✅ Detected ${sizeMap.size} unique sizes:`, Array.from(sizeMap.keys()).join(', '));
  
  const totalSold = Array.from(sizeMap.values()).reduce((sum, s) => sum + s.totalSold, 0);
  const totalRevenue = Array.from(sizeMap.values()).reduce((sum, s) => sum + s.revenue, 0);
  
  if (totalSold === 0) return [];
  
  const sizeAnalysis: SizeAnalysis[] = Array.from(sizeMap.entries()).map(([size, data]) => {
    const percentage = (data.totalSold / totalSold) * 100;
    const revenuePercent = (data.revenue / totalRevenue) * 100;
    let status: 'hot' | 'normal' | 'slow' = 'normal';
    
    // More accurate status based on both quantity AND revenue
    if (percentage >= 20 || revenuePercent >= 20) status = 'hot';     
    else if (percentage < 12 && revenuePercent < 12) status = 'slow'; 
    
    return {
      size,
      totalSold: data.totalSold,
      revenue: data.revenue,
      productCount: data.productCount,
      percentage,
      status
    };
  });
  
  // Sort by revenue (more important than quantity)
  const sorted = sizeAnalysis.sort((a, b) => b.revenue - a.revenue);
  
  console.log(`\n📏 Size Analysis (${sizeAnalysis.length} sizes):`);
  sorted.forEach((s, idx) => {
    const revPercent = (s.revenue / totalRevenue) * 100;
    console.log(`  ${idx + 1}. Size ${s.size}: ${s.totalSold} units (${s.percentage.toFixed(1)}%) | Revenue: Rp ${s.revenue.toLocaleString('id-ID')} (${revPercent.toFixed(1)}%) - ${s.status.toUpperCase()}`);
  });
  
  return sorted;
}

/**
 * AUTO-CATEGORIZATION: Extract keywords from product names
 * Extract brand names, product types, and common words
 */
function extractKeywords(productName: string): string[] {
  // Remove special characters and normalize
  const cleaned = productName
    .toLowerCase()
    .replace(/[_\-\/]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split into words
  const words = cleaned.split(/\s+/).filter(word => word.length > 2);
  
  // Remove common stopwords (expanded list)
  const stopwords = [
    'dan', 'atau', 'untuk', 'dengan', 'yang', 'dari', 'ini', 'itu', 
    'the', 'and', 'or', 'for', 'with', 'belum', 'termasuk', 'nama',
    'nomor', 'punggung', 'list', 'series', 'size'
  ];
  const filtered = words.filter(word => !stopwords.includes(word));
  
  return filtered;
}

/**
 * Calculate similarity between two product names (0-100%)
 * Enhanced algorithm for better grouping
 */
function calculateProductSimilarity(name1: string, name2: string): number {
  const keywords1 = extractKeywords(name1);
  const keywords2 = extractKeywords(name2);
  
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  // Count common keywords
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const commonKeywords = keywords1.filter(kw => set2.has(kw));
  
  // Enhanced similarity: Give more weight to first 2-3 keywords (brand/type)
  let weightedScore = 0;
  const maxWeight = Math.min(keywords1.length, keywords2.length, 3);
  
  for (let i = 0; i < maxWeight; i++) {
    if (keywords2.includes(keywords1[i])) {
      weightedScore += (3 - i); // First word = 3 points, second = 2, third = 1
    }
  }
  
  // Calculate Jaccard similarity
  const union = new Set([...keywords1, ...keywords2]);
  const jaccardSimilarity = (commonKeywords.length / union.size) * 100;
  
  // Combine weighted score and Jaccard similarity
  const finalScore = (jaccardSimilarity * 0.6) + (weightedScore * 10);
  
  return Math.min(100, finalScore);
}

/**
 * AUTO-CATEGORIZATION: Group similar products based on product names
 * SMART ALGORITHM: Detects brand + product type automatically
 * Example: 
 *   - "DMNT Jersey Setelan..." + "DMNT Jersey Fantasy..." → "DMNT Jersey"
 *   - "DMNT Trackpants..." + "DMNT Celana..." → "DMNT Celana"
 */
function autoCategorizeProducts(products: FashionProduct[]): FashionProduct[] {
  console.log(`\n🤖 SMART CATEGORIZATION: Analyzing ${products.length} products...`);
  
  const SIMILARITY_THRESHOLD = 35; // Lower threshold for better grouping
  const categoryGroups: Map<string, FashionProduct[]> = new Map();
  
  // STEP 1: Group products by similarity
  products.forEach(product => {
    let assigned = false;
    let bestMatch = { categoryName: '', score: 0 };
    
    // Find best matching category
    for (const [categoryName, group] of categoryGroups.entries()) {
      // Check similarity with first 3 products in group (representatives)
      const similarities = group.slice(0, 3).map(p => 
        calculateProductSimilarity(product.name, p.name)
      );
      const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
      
      if (avgSimilarity >= SIMILARITY_THRESHOLD && avgSimilarity > bestMatch.score) {
        bestMatch = { categoryName, score: avgSimilarity };
        assigned = true;
      }
    }
    
    // Add to best matching group
    if (assigned && bestMatch.categoryName) {
      categoryGroups.get(bestMatch.categoryName)!.push(product);
    } else {
      // Create new category group
      const keywords = extractKeywords(product.name);
      // Use first 2 keywords as category name (usually brand + type)
      const categoryName = keywords.slice(0, 2)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Other Products';
      
      if (!categoryGroups.has(categoryName)) {
        categoryGroups.set(categoryName, []);
      }
      categoryGroups.get(categoryName)!.push(product);
    }
  });
  
  // STEP 2: Refine category names based on most common keywords
  console.log(`\n✨ Generated ${categoryGroups.size} smart categories:`);
  
  const finalCategories = new Map<string, FashionProduct[]>();
  
  for (const [originalName, group] of categoryGroups.entries()) {
    // Extract all keywords from products in this group
    const allKeywords: string[] = [];
    group.forEach(p => {
      allKeywords.push(...extractKeywords(p.name));
    });
    
    // Count keyword frequency
    const keywordFreq = new Map<string, number>();
    allKeywords.forEach(kw => {
      keywordFreq.set(kw, (keywordFreq.get(kw) || 0) + 1);
    });
    
    // Get top 2 most frequent keywords (brand + type)
    const topKeywords = Array.from(keywordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([kw]) => kw.charAt(0).toUpperCase() + kw.slice(1));
    
    // Generate smart category name
    let categoryName = topKeywords.join(' ') || originalName;
    
    // Handle case: if both keywords appear in >50% products, use both
    // Otherwise just use the most common one
    const threshold = group.length * 0.5;
    const validKeywords = topKeywords.filter((_, idx) => {
      const freq = Array.from(keywordFreq.entries())
        .sort((a, b) => b[1] - a[1])[idx]?.[1] || 0;
      return freq >= threshold;
    });
    
    if (validKeywords.length === 1) {
      categoryName = validKeywords[0];
    } else if (validKeywords.length >= 2) {
      categoryName = validKeywords.join(' ');
    }
    
    // Assign category to all products
    group.forEach(product => {
      product.category = categoryName;
    });
    
    finalCategories.set(categoryName, group);
    
    const totalRevenue = group.reduce((sum, p) => sum + p.revenue, 0);
    const totalQty = group.reduce((sum, p) => sum + p.quantity, 0);
    console.log(`  📦 "${categoryName}": ${group.length} products | ${totalQty} units | Rp ${totalRevenue.toLocaleString('id-ID')}`);
  }
  
  return products; // Return with updated categories
}

/**
 * Analisis CATEGORY performance
 * ALWAYS auto-categorize from product names (NEVER use category column)
 */
function analyzeCategories(products: FashionProduct[]): CategoryAnalysis[] {
  // FORCE AUTO-CATEGORIZATION: Always use product names, ignore category column
  console.log(`\n🤖 SMART AUTO-CATEGORIZATION: Analyzing product names...`);
  const productsToAnalyze = autoCategorizeProducts(products);
  
  const categoryMap = new Map<string, { totalSold: number; revenue: number; productCount: number }>();
  
  productsToAnalyze.forEach(product => {
    const category = product.category || 'Uncategorized';
    const current = categoryMap.get(category) || { totalSold: 0, revenue: 0, productCount: 0 };
    categoryMap.set(category, {
      totalSold: current.totalSold + product.quantity,
      revenue: current.revenue + product.revenue,
      productCount: current.productCount + 1
    });
  });
  
  const totalSold = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.totalSold, 0);
  const totalRevenue = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.revenue, 0);
  
  if (totalSold === 0) return [];
  
  const categoryAnalysis: CategoryAnalysis[] = Array.from(categoryMap.entries()).map(([category, data]) => {
    const percentage = (data.totalSold / totalSold) * 100;
    const avgPrice = data.revenue / data.totalSold;
    
    return {
      category,
      totalSold: data.totalSold,
      revenue: data.revenue,
      productCount: data.productCount,
      percentage,
      avgPrice
    };
  });
  
  // Sort by revenue (most important metric for business)
  const sorted = categoryAnalysis.sort((a, b) => b.revenue - a.revenue);
  
  console.log(`\n🎯 Category Analysis (${categoryAnalysis.length} categories):`);
  sorted.forEach((c, idx) => {
    const revPercent = (c.revenue / totalRevenue) * 100;
    console.log(`  ${idx + 1}. ${c.category}: ${c.totalSold} units (${c.percentage.toFixed(1)}%) | Revenue: Rp ${c.revenue.toLocaleString('id-ID')} (${revPercent.toFixed(1)}%) | Avg Price: Rp ${c.avgPrice.toLocaleString('id-ID')}`);
  });
  
  return sorted;
}

/**
 * Generate STOCK RECOMMENDATIONS - CORE LOGIC DEADSTOCK PREVENTION
 */
function generateStockRecommendations(
  products: FashionProduct[],
  sizeAnalysis: SizeAnalysis[]
): StockRecommendation[] {
  const recommendations: StockRecommendation[] = [];
  
  // Calculate median and average for better benchmarking
  const sortedQuantities = [...products].sort((a, b) => a.quantity - b.quantity).map(p => p.quantity);
  const medianQty = sortedQuantities[Math.floor(sortedQuantities.length / 2)];
  const avgQty = products.reduce((sum, p) => sum + p.quantity, 0) / products.length;
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  
  console.log(`\n📊 Recommendation Benchmarks:`);
  console.log(`  Average Quantity: ${avgQty.toFixed(1)} units`);
  console.log(`  Median Quantity: ${medianQty} units`);
  
  products.forEach(product => {
    const soldUnits = product.quantity;
    const revenue = product.revenue;
    const revenuePercent = (revenue / totalRevenue) * 100;
    
    let action: 'INCREASE' | 'MAINTAIN' | 'REDUCE' | 'DISCONTINUE' = 'MAINTAIN';
    let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    let reason = '';
    let quantityRec = '';
    let deadstockRisk = 20; // Default 20%
    
    // === SMARTER LOGIC: Consider both QUANTITY and REVENUE ===
    
    // Top performers: High quantity OR high revenue contribution
    if (soldUnits >= avgQty * 1.5 || revenuePercent >= 5) {
      action = 'INCREASE';
      priority = 'HIGH';
      const increasePercent = Math.min(50, Math.floor(soldUnits / 10)); // Max 50%
      quantityRec = `Tambah stok ${increasePercent}% (estimasi +${Math.ceil(soldUnits * increasePercent / 100)} unit)`;
      reason = `⭐ TOP PERFORMER! Terjual ${soldUnits} unit (${revenuePercent.toFixed(1)}% dari total revenue). Tingkatkan stok untuk maksimalkan profit.`;
      deadstockRisk = 5;
      
    } else if (soldUnits >= avgQty * 0.7 || revenuePercent >= 2) {
      // Good performers
      action = 'MAINTAIN';
      priority = 'MEDIUM';
      quantityRec = `Pertahankan stok saat ini (${soldUnits} unit/periode)`;
      reason = `✅ Performa baik: ${soldUnits} unit terjual (${revenuePercent.toFixed(1)}% revenue). Maintain current level.`;
      deadstockRisk = 20;
      
    } else if (soldUnits >= avgQty * 0.3 || revenuePercent >= 0.5) {
      // Underperformers
      action = 'REDUCE';
      priority = 'MEDIUM';
      quantityRec = `Kurangi stok 40% atau buat promo diskon 20-30%`;
      reason = `⚠️ Penjualan di bawah rata-rata (${soldUnits} unit, ${revenuePercent.toFixed(1)}% revenue). Pertimbangkan promosi atau kurangi produksi.`;
      deadstockRisk = 60;
      
    } else {
      // Poor performers - high risk
      action = 'DISCONTINUE';
      priority = 'HIGH';
      quantityRec = `CLEARANCE SALE 50-70% atau STOP produksi`;
      reason = `🚨 DEADSTOCK RISK! Hanya ${soldUnits} unit terjual (${revenuePercent.toFixed(2)}% revenue). Segera ambil tindakan untuk hindari kerugian!`;
      deadstockRisk = 90;
    }
    
    // === ADJUSTMENT BERDASARKAN SIZE (jika ada) ===
    if (product.size && sizeAnalysis.length > 0) {
      const sizeInfo = sizeAnalysis.find(s => s.size === product.size.toUpperCase());
      
      if (sizeInfo) {
        if (sizeInfo.status === 'hot') {
          // Size populer - boost recommendation
          if (action === 'INCREASE') {
            quantityRec += ` (Size ${product.size} sedang HOT! 🔥)`;
          } else if (action === 'MAINTAIN') {
            action = 'INCREASE';
            quantityRec = `Tingkatkan stok 20% karena size ${product.size} populer (${sizeInfo.percentage.toFixed(1)}% market share)`;
          }
          deadstockRisk = Math.max(0, deadstockRisk - 10);
          
        } else if (sizeInfo.status === 'slow') {
          // Size tidak populer - increase risk
          if (action === 'MAINTAIN') {
            action = 'REDUCE';
            quantityRec = `Kurangi stok untuk size ${product.size} (hanya ${sizeInfo.percentage.toFixed(1)}% market share)`;
          }
          deadstockRisk = Math.min(100, deadstockRisk + 15);
          reason += ` Size ${product.size} kurang populer di pasar.`;
        }
      }
    }
    
    recommendations.push({
      productName: product.name,
      category: product.category,
      size: product.size,
      currentSold: soldUnits,
      action,
      priority,
      reason,
      quantityRecommendation: quantityRec,
      deadstockRisk
    });
  });
  
  // Sort: HIGH priority first, then by deadstock risk
  return recommendations.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'HIGH' ? -1 : 1;
    }
    return b.deadstockRisk - a.deadstockRisk;
  });
}

/**
 * Analisis DEADSTOCK RISK
 */
function analyzeDeadstock(
  products: FashionProduct[],
  recommendations: StockRecommendation[]
): DeadstockAnalysis {
  console.log('\n\n📦 === ANALISIS DEADSTOCK ULTRA DETAIL ===');
  console.log(`Mengecek ${recommendations.length} rekomendasi untuk identifikasi risiko...`);
  
  // Produk dengan risiko >60% = berisiko
  const riskyProducts = recommendations
    .filter(rec => rec.deadstockRisk > 60)
    .map(rec => {
      const product = products.find(p => p.name === rec.productName);
      
      // Detailed reason untuk deadstock
      let reason = '';
      if (rec.currentSold === 0) {
        reason = 'Tidak ada penjualan sama sekali! STOP produksi segera.';
      } else if (rec.currentSold < 5) {
        reason = `Hanya ${rec.currentSold} unit terjual - sangat lambat. Pertimbangkan diskon besar atau bundle.`;
      } else if (rec.deadstockRisk > 80) {
        reason = `Performa sangat buruk (${rec.currentSold} unit). Jauh di bawah rata-rata kategori.`;
      } else {
        reason = `Penjualan lambat (${rec.currentSold} unit). Kurangi stok ke level minimal.`;
      }
      
      return {
        name: rec.productName,
        category: rec.category,
        size: rec.size,
        soldUnits: rec.currentSold,
        riskLevel: rec.deadstockRisk > 80 ? 'HIGH' : rec.deadstockRisk > 70 ? 'MEDIUM' : 'LOW' as 'HIGH' | 'MEDIUM' | 'LOW',
        recommendation: rec.quantityRecommendation,
        reason: reason, // Added detailed reason
        deadstockPercentage: rec.deadstockRisk
      };
    });
  
  console.log(`🔴 Produk berisiko: ${riskyProducts.length}`);
  riskyProducts.slice(0, 5).forEach(p => {
    console.log(`   - ${p.name} ${p.size ? `(Size: ${p.size})` : ''}: ${p.soldUnits} unit - ${p.reason}`);
  });
  
  // === SIZE-SPECIFIC ANALYSIS ===
  const sizePerformance = new Map<string, { total: number; sold: number; revenue: number }>();
  
  products.forEach(product => {
    if (product.size) {
      const current = sizePerformance.get(product.size) || { total: 0, sold: 0, revenue: 0 };
      sizePerformance.set(product.size, {
        total: current.total + 1,
        sold: current.sold + product.quantity,
        revenue: current.revenue + product.revenue
      });
    }
  });
  
  // Identify slow-moving sizes
  const sizes = Array.from(sizePerformance.entries()).map(([size, data]) => ({
    size,
    totalProducts: data.total,
    totalSold: data.sold,
    totalRevenue: data.revenue,
    avgSoldPerProduct: data.sold / data.total,
    revenuePerUnit: data.sold > 0 ? data.revenue / data.sold : 0
  })).sort((a, b) => b.totalSold - a.totalSold);
  
  const slowSizes = sizes.filter(s => s.totalSold < (sizes[0]?.totalSold || 0) * 0.3); // Less than 30% of best-selling size
  
  console.log('\n📏 === SIZE PERFORMANCE ===');
  sizes.slice(0, 5).forEach(s => {
    const status = slowSizes.includes(s) ? '⚠️ LAMBAT' : '✅ BAGUS';
    console.log(`   ${status} Size ${s.size}: ${s.totalSold} unit (${s.totalProducts} produk)`);
  });
  
  if (slowSizes.length > 0) {
    console.log(`\n⚠️ UKURAN LAMBAT (${slowSizes.length}): ${slowSizes.map(s => s.size).join(', ')}`);
    console.log(`💡 Rekomendasi: Kurangi produksi ukuran-ukuran ini!`);
  }
  
  const totalRisk = recommendations.length > 0
    ? recommendations.reduce((sum, r) => sum + r.deadstockRisk, 0) / recommendations.length
    : 0;
  
  const estimatedValue = riskyProducts.reduce((sum, p) => {
    const product = products.find(pr => pr.name === p.name);
    return sum + (product ? product.revenue * 0.5 : 0); // 50% dari revenue = estimated loss
  }, 0);
  
  console.log(`\n💰 Total Risiko: ${totalRisk.toFixed(1)}%`);
  console.log(`💸 Estimasi Nilai Terikat: Rp ${estimatedValue.toLocaleString('id-ID')}`);
  
  return {
    totalDeadstockRisk: totalRisk,
    productsAtRisk: riskyProducts,
    estimatedDeadstockValue: estimatedValue,
    sizePerformance: sizes, // Added size analysis
    slowMovingSizes: slowSizes.map(s => s.size) // Added slow size list
  };
}

/**
 * === FINANCIAL HEALTH ANALYZER ===
 * ANTI-KEBANGKRUTAN SYSTEM - Core Function
 * 
 * Menganalisis kesehatan finansial setiap produk untuk mencegah:
 * - Modal tertahan di deadstock
 * - Stockout produk laris
 * - Cash flow negatif
 */
function analyzeFinancialHealth(
  products: FashionProduct[],
  recommendations: StockRecommendation[]
): FinancialHealthReport {
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);
  const avgQty = totalQty / products.length;
  
  console.log('\n\n💰 === ANALISIS KESEHATAN KEUANGAN ===');
  console.log(`Lagi ngecek ${products.length} produk buat deteksi risiko bangkrut...`);
  
  const productHealth: ProductFinancialHealth[] = products.map(product => {
    const rec = recommendations.find(r => r.productName === product.name);
    const revenueContribution = (product.revenue / totalRevenue) * 100;
    const qtyRatio = product.quantity / avgQty;
    
    // === HEALTH SCORE CALCULATION (0-100) ===
    let healthScore = 50; // Base score
    
    // Revenue contribution (0-40 points)
    if (revenueContribution >= 5) healthScore += 40;
    else if (revenueContribution >= 2) healthScore += 30;
    else if (revenueContribution >= 1) healthScore += 20;
    else if (revenueContribution >= 0.5) healthScore += 10;
    else healthScore -= 10;
    
    // Quantity performance (0-30 points)
    if (qtyRatio >= 1.5) healthScore += 30;
    else if (qtyRatio >= 1.0) healthScore += 20;
    else if (qtyRatio >= 0.5) healthScore += 10;
    else healthScore -= 20;
    
    // Deadstock risk penalty (-30 to +20 points)
    const deadstockRisk = rec?.deadstockRisk || 50;
    if (deadstockRisk < 20) healthScore += 20;
    else if (deadstockRisk < 40) healthScore += 10;
    else if (deadstockRisk >= 80) healthScore -= 30;
    else if (deadstockRisk >= 60) healthScore -= 20;
    
    healthScore = Math.max(0, Math.min(100, healthScore));
    
    // === ROI CALCULATION ===
    // Assume cost = 60% of price, ROI = (revenue - cost) / cost * 100
    const estimatedCost = product.price * 0.6 * product.quantity;
    const profit = product.revenue - estimatedCost;
    const roi = (profit / estimatedCost) * 100;
    
    // === VELOCITY SCORE (0-100) ===
    // Based on quantity sold relative to average
    const velocityScore = Math.min(100, (qtyRatio / 2) * 100);
    
    // === CASH FLOW IMPACT ===
    let cashFlowImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    if (healthScore >= 70) cashFlowImpact = 'POSITIVE';
    else if (healthScore >= 40) cashFlowImpact = 'NEUTRAL';
    else cashFlowImpact = 'NEGATIVE';
    
    // === RISK LEVEL ===
    let riskLevel: 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';
    if (healthScore >= 70) riskLevel = 'SAFE';
    else if (healthScore >= 50) riskLevel = 'CAUTION';
    else if (healthScore >= 30) riskLevel = 'DANGER';
    else riskLevel = 'CRITICAL';
    
    // === ESTIMATED STOCK DAYS ===
    // Assume current rate continues: days = (quantity * 30) / current sales
    // For simplicity: higher quantity = more days
    const estimatedStockDays = product.quantity < avgQty ? 30 : product.quantity / avgQty * 30;
    
    // === ACTION PRIORITY ===
    let actionPriority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    if (riskLevel === 'CRITICAL') actionPriority = 'URGENT';
    else if (riskLevel === 'DANGER') actionPriority = 'HIGH';
    else if (riskLevel === 'CAUTION') actionPriority = 'MEDIUM';
    else actionPriority = 'LOW';
    
    // === RECOMMENDATION ===
    let recommendation = '';
    if (healthScore >= 80) {
      recommendation = `⭐ MANTAP BANGET! Ini jagoan kamu nih. Tambahin stock & fokuskan promosi. ROI udah ${roi.toFixed(0)}%. Ini yang namanya sapi perah!`;
    } else if (healthScore >= 60) {
      recommendation = `✅ BAGUS! Performanya oke. Pertahankan level sekarang aja. Pantau terus biar bisa lebih mantap lagi.`;
    } else if (healthScore >= 40) {
      recommendation = `⚠️ KURANG OKE NIH. Coba kasih promo atau bundling deh. Modal yang tertahan sekitar Rp ${(product.revenue * 0.4).toLocaleString('id-ID')}`;
    } else {
      recommendation = `🚨 BAHAYA! HARUS ACTION SEKARANG! Stop produksi dulu. Obral aja 50-70%. Kalo diterusin bisa bahaya buat bisnis!`;
    }
    
    return {
      productName: product.name,
      size: product.size,
      healthScore,
      roi,
      velocityScore,
      cashFlowImpact,
      riskLevel,
      estimatedStockDays,
      recommendation,
      actionPriority
    };
  });
  
  // === OVERALL ANALYSIS ===
  const overallHealthScore = productHealth.reduce((sum, p) => sum + p.healthScore, 0) / productHealth.length;
  
  const healthyProducts = productHealth.filter(p => p.healthScore >= 70).length;
  const riskyProducts = productHealth.filter(p => p.healthScore >= 40 && p.healthScore < 70).length;
  const criticalProducts = productHealth.filter(p => p.healthScore < 40).length;
  
  // Calculate cash at risk (from products with negative cash flow)
  const cashAtRisk = products
    .filter((p, idx) => productHealth[idx].cashFlowImpact === 'NEGATIVE')
    .reduce((sum, p) => sum + p.revenue, 0);
  
  // Calculate cash flow efficiency
  const positiveRevenue = products
    .filter((p, idx) => productHealth[idx].cashFlowImpact === 'POSITIVE')
    .reduce((sum, p) => sum + p.revenue, 0);
  const cashFlowEfficiency = (positiveRevenue / totalRevenue) * 100;
  
  // === BANKRUPTCY RISK ASSESSMENT ===
  let bankruptcyRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (overallHealthScore >= 70 && criticalProducts === 0) bankruptcyRisk = 'LOW';
  else if (overallHealthScore >= 55 && criticalProducts <= 2) bankruptcyRisk = 'MEDIUM';
  else if (overallHealthScore >= 40 || criticalProducts <= 5) bankruptcyRisk = 'HIGH';
  else bankruptcyRisk = 'CRITICAL';
  
  // === URGENT ACTIONS ===
  const urgentActions: string[] = [];
  const criticalHealthProducts = productHealth.filter(p => p.riskLevel === 'CRITICAL');
  const dangerHealthProducts = productHealth.filter(p => p.riskLevel === 'DANGER');
  
  if (criticalHealthProducts.length > 0) {
    urgentActions.push(`🚨 GAWAT: ${criticalHealthProducts.length} produk lagi kritis banget! Modal yang nganggur: Rp ${cashAtRisk.toLocaleString('id-ID')}`);
    criticalHealthProducts.slice(0, 3).forEach(p => {
      const label = p.size ? `${p.productName} (${p.size})` : p.productName;
      urgentActions.push(`   ⛔ STOP dulu produksi "${label}" SEKARANG! Skor Kesehatan: ${p.healthScore.toFixed(0)}`);
    });
  }
  
  if (dangerHealthProducts.length > 0) {
    urgentActions.push(`⚠️ PERHATIAN: ${dangerHealthProducts.length} produk lagi dalam zona bahaya. Harus ambil tindakan dalam 1-2 minggu ya!`);
  }
  
  if (cashFlowEfficiency < 60) {
    urgentActions.push(`💸 Arus kas cuma efisien ${cashFlowEfficiency.toFixed(0)}%. Kebanyakan modal nganggur di produk yang jalannya lelet!`);
  }
  
  // === RECOMMENDED FOCUS ===
  const recommendedFocus = productHealth
    .filter(p => p.healthScore >= 70)
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5)
    .map(p => p.size ? `${p.productName} (${p.size})` : p.productName);
  
  console.log(`\n💯 Skor Kesehatan Keseluruhan: ${overallHealthScore.toFixed(1)}/100`);
  console.log(`📊 Sehat: ${healthyProducts} | Berisiko: ${riskyProducts} | Kritis: ${criticalProducts}`);
  console.log(`💰 Modal Tertahan: Rp ${cashAtRisk.toLocaleString('id-ID')}`);
  console.log(`🏦 Efisiensi Arus Kas: ${cashFlowEfficiency.toFixed(1)}%`);
  console.log(`⚠️  Risiko Bangkrut: ${bankruptcyRisk}`);
  
  return {
    overallHealthScore,
    totalCashAtRisk: cashAtRisk,
    healthyProducts,
    riskyProducts,
    criticalProducts,
    bankruptcyRisk,
    urgentActionNeeded: criticalProducts > 0 || bankruptcyRisk === 'CRITICAL',
    urgentActions,
    productHealth: productHealth.sort((a, b) => a.healthScore - b.healthScore), // Sort by health (worst first)
    cashFlowEfficiency,
    recommendedFocus
  };
}

/**
 * Generate INSIGHTS - Kesimpulan pintar dengan analisis per-size
 */
function generateInsights(
  products: FashionProduct[],
  sizeAnalysis: SizeAnalysis[],
  categoryAnalysis: CategoryAnalysis[],
  stockRecs: StockRecommendation[],
  deadstockAnalysis: DeadstockAnalysis
): string[] {
  const insights: string[] = [];
  
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);
  const hasQuantityData = totalQty > 0;
  const hasSizeData = sizeAnalysis.length > 0;
  
  // === BUSINESS INTELLIGENCE INSIGHTS - FLEKSIBEL ===
  
  // 1. Revenue Performance Analysis - FOKUS NAMA PRODUK
  const top5Revenue = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const top5RevenueTotal = top5Revenue.reduce((sum, p) => sum + p.revenue, 0);
  const top5Percentage = (top5RevenueTotal / totalRevenue) * 100;
  
  insights.push(`💰 TOP 5 PRODUK PALING LAKU menghasilkan ${top5Percentage.toFixed(1)}% dari total revenue (Rp ${top5RevenueTotal.toLocaleString('id-ID')}):`);
  
  // List top 5 dengan format fleksibel (dengan/tanpa quantity & size)
  const top5List = top5Revenue.map((p, idx) => {
    const productLabel = p.size ? `${p.name} Size ${p.size}` : p.name;
    const revPercent = (p.revenue / totalRevenue) * 100;
    // Tampilkan quantity hanya jika data quantity valid
    const qtyInfo = hasQuantityData ? `${p.quantity} unit terjual, ` : '';
    return `   ${idx + 1}. "${productLabel}" - ${qtyInfo}Rp ${p.revenue.toLocaleString('id-ID')} (${revPercent.toFixed(1)}%)`;
  }).join('\n');
  
  insights.push(top5List);
  
  // Show top performer dengan format fleksibel
  const topProduct = top5Revenue[0];
  const topLabel = topProduct.size ? `${topProduct.name} Size ${topProduct.size}` : topProduct.name;
  insights.push(`🏆 PRODUK TERLARIS: "${topLabel}" @ Rp ${topProduct.price.toLocaleString('id-ID')}. JANGAN SAMPAI KEHABISAN STOK!`);
  
  // 2. Product Specific Analysis - FLEKSIBEL berdasarkan data
  if (hasSizeData) {
    // Jika ada data size, tampilkan analisis per size
    const hotProducts = [...products]
      .filter(p => p.size)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
    
    if (hotProducts.length > 0) {
      insights.push(`🔥 TOP 3 PRODUK BERDASARKAN SIZE:`);
      hotProducts.forEach((p, idx) => {
        const revPercent = (p.revenue / totalRevenue) * 100;
        const qtyInfo = hasQuantityData ? `${p.quantity} unit terjual, ` : '';
        insights.push(`   ${idx + 1}. "${p.name} Size ${p.size}" - ${qtyInfo}${revPercent.toFixed(1)}% revenue @ Rp ${p.price.toLocaleString('id-ID')}`);
      });
    }
  } else {
    // Jika tidak ada data size, fokus ke nama produk saja
    console.log('ℹ️ No size data - focusing on product names only');
  }
  
  // Show slow moving products - FLEKSIBEL tanpa quantity
  const slowProducts = [...products]
    .filter(p => {
      const revPercent = (p.revenue / totalRevenue) * 100;
      // Filter berdasarkan revenue saja jika tidak ada data quantity
      if (hasQuantityData) {
        return revPercent < 0.5 && p.quantity < totalQty / products.length * 0.3;
      } else {
        return revPercent < 0.5; // Hanya berdasarkan revenue
      }
    })
    .sort((a, b) => a.revenue - b.revenue)
    .slice(0, 5);
  
  if (slowProducts.length > 0) {
    insights.push(`⚠️ ${slowProducts.length} PRODUK KURANG LAKU (BUTUH ACTION):`);
    slowProducts.slice(0, 3).forEach((p, idx) => {
      const productLabel = p.size ? `${p.name} Size ${p.size}` : p.name;
      const qtyInfo = hasQuantityData ? `Hanya ${p.quantity} unit terjual. ` : '';
      insights.push(`   ${idx + 1}. "${productLabel}" - ${qtyInfo}Revenue rendah (Rp ${p.revenue.toLocaleString('id-ID')}). ACTION: Diskon 40-60% atau bundling!`);
    });
  }
  
  // 3. Category Performance with Revenue Focus
  if (categoryAnalysis.length > 0 && categoryAnalysis[0].category !== 'Uncategorized') {
    const topCat = categoryAnalysis[0];
    const catRevPercent = (topCat.revenue / totalRevenue) * 100;
    insights.push(`📦 Kategori "${topCat.category}" PALING PROFITABLE: ${topCat.totalSold} unit, revenue Rp ${topCat.revenue.toLocaleString('id-ID')} (${catRevPercent.toFixed(1)}%). Average price: Rp ${topCat.avgPrice.toLocaleString('id-ID')}. Expand produk di kategori ini!`);
    
    // Multi-category strategy
    if (categoryAnalysis.length > 3) {
      const bottom3 = categoryAnalysis.slice(-3);
      const bottom3Revenue = bottom3.reduce((sum, c) => sum + c.revenue, 0);
      const bottom3Percent = (bottom3Revenue / totalRevenue) * 100;
      if (bottom3Percent < 10) {
        insights.push(`📉 3 Kategori terendah (${bottom3.map(c => c.category).join(', ')}) hanya ${bottom3Percent.toFixed(1)}% revenue. Pertimbangkan DISCONTINUE atau re-branding!`);
      }
    }
  }
  
  // 4. Stock Action Intelligence
  const increaseCount = stockRecs.filter(r => r.action === 'INCREASE').length;
  const reduceCount = stockRecs.filter(r => r.action === 'REDUCE').length;
  const discontinueCount = stockRecs.filter(r => r.action === 'DISCONTINUE').length;
  
  const increaseProducts = stockRecs.filter(r => r.action === 'INCREASE');
  const potentialRevenue = increaseProducts.reduce((sum, r) => {
    const product = products.find(p => p.name === r.productName);
    return sum + (product ? product.revenue * 0.3 : 0); // Estimate 30% revenue increase
  }, 0);
  
  if (increaseCount > 0) {
    insights.push(`✅ ${increaseCount} produk HIGH-DEMAND butuh STOCK INCREASE. Potential additional revenue: Rp ${potentialRevenue.toLocaleString('id-ID')} jika stok ditambah. DON'T MISS THIS OPPORTUNITY!`);
  }
  
  if (reduceCount > 0) {
    insights.push(`⚠️ ${reduceCount} produk SLOW MOVING perlu dikurangi. Realokasi budget produksi ke high-performers untuk ROI lebih baik!`);
  }
  
  if (discontinueCount > 0) {
    const discontinueProducts = stockRecs.filter(r => r.action === 'DISCONTINUE');
    const wasted = discontinueProducts.reduce((sum, r) => {
      const product = products.find(p => p.name === r.productName);
      return sum + (product ? product.revenue : 0);
    }, 0);
    insights.push(`🚨 ${discontinueCount} produk MUST DISCONTINUE! Current revenue hanya Rp ${wasted.toLocaleString('id-ID')}. IMMEDIATE ACTION: Clearance sale 60-80% untuk minimize loss!`);
  }
  
  // 5. Deadstock Risk Assessment with Financial Impact
  if (deadstockAnalysis.totalDeadstockRisk > 50) {
    insights.push(`🚨 CRITICAL DEADSTOCK ALERT (${deadstockAnalysis.totalDeadstockRisk.toFixed(0)}%)! Potential loss: Rp ${deadstockAnalysis.estimatedDeadstockValue.toLocaleString('id-ID')}. ${deadstockAnalysis.productsAtRisk.length} produk at risk. URGENT: Execute clearance strategy NOW!`);
  } else if (deadstockAnalysis.totalDeadstockRisk > 25) {
    insights.push(`⚠️ Moderate deadstock risk (${deadstockAnalysis.totalDeadstockRisk.toFixed(0)}%). Monitor closely dan adjust produksi. Potential loss: Rp ${deadstockAnalysis.estimatedDeadstockValue.toLocaleString('id-ID')}.`);
  } else {
    insights.push(`✅ Excellent stock health! Deadstock risk rendah (${deadstockAnalysis.totalDeadstockRisk.toFixed(0)}%). Keep monitoring & maintain current strategy.`);
  }
  
  // 6. Price Point Analysis
  const avgPrice = totalRevenue / totalQty;
  const highPrice = products.filter(p => p.price > avgPrice * 1.3);
  const lowPrice = products.filter(p => p.price < avgPrice * 0.7);
  
  if (highPrice.length > 0) {
    const highPriceRevenue = highPrice.reduce((sum, p) => sum + p.revenue, 0);
    const highPricePercent = (highPriceRevenue / totalRevenue) * 100;
    insights.push(`💎 ${highPrice.length} produk PREMIUM (harga > Rp ${(avgPrice * 1.3).toLocaleString('id-ID')}) menghasilkan ${highPricePercent.toFixed(1)}% revenue. Focus marketing pada segment ini untuk maximize profit margin!`);
  }
  
  // 7. Product-Specific Strategy
  const profitableProducts = products.filter(p => {
    const revenuePercent = (p.revenue / totalRevenue) * 100;
    return revenuePercent >= 1; // Products contributing 1%+ revenue
  });
  
  insights.push(`🎯 FOKUS STRATEGI: ${profitableProducts.length} PRODUK SPESIFIK (${((profitableProducts.length / products.length) * 100).toFixed(0)}% katalog) generate majority revenue:`);
  
  // List profitable products by name+size
  const profitableTop = [...profitableProducts]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);
  
  profitableTop.forEach((p, idx) => {
    const productLabel = p.size ? `${p.name} Size ${p.size}` : p.name;
    const revPercent = (p.revenue / totalRevenue) * 100;
    const action = revPercent >= 5 ? '⬆️ STOCK UP' : revPercent >= 2 ? '✅ MAINTAIN' : '📊 MONITOR';
    insights.push(`   ${action} "${productLabel}" (${revPercent.toFixed(1)}% revenue)`);
  });
  
  insights.push(`\n💡 TIP: Ini adalah PRODUK+SIZE SPESIFIK yang harus jadi prioritas inventory & marketing Anda!`);
  
  return insights;
}

/**
 * Generate CONCLUSION - Laporan lengkap
 */
function generateConclusion(
  products: FashionProduct[],
  sizeAnalysis: SizeAnalysis[],
  categoryAnalysis: CategoryAnalysis[],
  stockRecs: StockRecommendation[],
  deadstockAnalysis: DeadstockAnalysis,
  totalRevenue: number,
  totalUnits: number,
  avgPrice: number
): string {
  let conclusion = `LAPORAN ANALISIS STOK & REKOMENDASI\n\n`;
  
  conclusion += `RINGKASAN PENJUALAN\n`;
  conclusion += `• Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}\n`;
  // Tampilkan unit & harga rata-rata hanya jika data quantity ada
  if (totalUnits > 0) {
    conclusion += `• Total Unit Terjual: ${totalUnits.toLocaleString('id-ID')} unit\n`;
    conclusion += `• Harga Rata-rata: Rp ${Math.round(avgPrice).toLocaleString('id-ID')}\n`;
  }
  conclusion += `• Jumlah Produk: ${products.length} produk\n\n`;
  
  // Size Analysis - SKIP jika tidak ada data
  if (sizeAnalysis.length > 0) {
    conclusion += `ANALISIS UKURAN (TOP 3)\n`;
    sizeAnalysis.slice(0, 3).forEach((size, idx) => {
      const emoji = size.status === 'hot' ? '🔥' : size.status === 'normal' ? '✅' : '📉';
      conclusion += `${idx + 1}. Size ${size.size} ${emoji}\n`;
      // Tampilkan unit hanya jika data quantity valid
      if (totalUnits > 0) {
        conclusion += `   → ${size.totalSold} unit terjual (${size.percentage.toFixed(1)}% dari total)\n`;
      }
      conclusion += `   → Revenue: Rp ${size.revenue.toLocaleString('id-ID')}\n`;
      conclusion += `   → Status: ${size.status === 'hot' ? 'LARIS MANIS' : size.status === 'normal' ? 'NORMAL' : 'LAMBAT'}\n\n`;
    });
  }
  
  // Category Analysis
  if (categoryAnalysis.length > 0 && categoryAnalysis[0].category !== 'Uncategorized') {
    conclusion += `ANALISIS KATEGORI PRODUK\n`;
    categoryAnalysis.forEach((cat, idx) => {
      conclusion += `${idx + 1}. Kategori: ${cat.category}\n`;
      // Tampilkan unit hanya jika data quantity valid
      if (totalUnits > 0) {
        conclusion += `   → ${cat.totalSold} unit terjual (${cat.percentage.toFixed(1)}% dari total)\n`;
      }
      conclusion += `   → Revenue: Rp ${cat.revenue.toLocaleString('id-ID')}\n`;
      conclusion += `   → Harga rata-rata: Rp ${Math.round(cat.avgPrice).toLocaleString('id-ID')}\n`;
      conclusion += `   → Total produk: ${cat.productCount} item\n\n`;
    });
  }
  
  // High-risk products
  const highRisk = deadstockAnalysis.productsAtRisk.filter(p => p.riskLevel === 'HIGH');
  if (highRisk.length > 0) {
    conclusion += `PRODUK BERISIKO TINGGI (Perlu Tindakan Segera)\n`;
    highRisk.slice(0, 5).forEach((p, idx) => {
      conclusion += `${idx + 1}. ${p.name}`;
      if (p.size) conclusion += ` - Size ${p.size}`;
      if (p.category) conclusion += ` (${p.category})`;
      conclusion += `\n`;
      // Tampilkan unit hanya jika data quantity valid
      if (totalUnits > 0) {
        conclusion += `   → Hanya ${p.soldUnits} unit terjual\n`;
      }
      conclusion += `   → Rekomendasi: ${p.recommendation}\n\n`;
    });
  }
  
  // Overall deadstock risk
  conclusion += `EVALUASI RISIKO DEADSTOCK\n`;
  conclusion += `• Level Risiko: ${deadstockAnalysis.totalDeadstockRisk.toFixed(0)}% `;
  if (deadstockAnalysis.totalDeadstockRisk > 60) {
    conclusion += `(🚨 TINGGI - Perlu tindakan segera!)\n`;
  } else if (deadstockAnalysis.totalDeadstockRisk > 30) {
    conclusion += `(⚠️ SEDANG - Perlu monitoring)\n`;
  } else {
    conclusion += `(✅ RENDAH - Terkontrol dengan baik)\n`;
  }
  conclusion += `• Jumlah Produk Berisiko: ${deadstockAnalysis.productsAtRisk.length} produk\n`;
  conclusion += `• Estimasi Potensi Kerugian: Rp ${deadstockAnalysis.estimatedDeadstockValue.toLocaleString('id-ID')}\n\n`;
  
  // Action Plan
  conclusion += `RENCANA TINDAKAN\n\n`;
  
  conclusion += `PRIORITAS TINGGI (Tindakan 1-7 hari):\n`;
  const immediateActions = stockRecs.filter(r => r.priority === 'HIGH' && (r.action === 'DISCONTINUE' || r.deadstockRisk > 80));
  if (immediateActions.length > 0) {
    immediateActions.slice(0, 5).forEach((rec, idx) => {
      conclusion += `${idx + 1}. ${rec.productName}`;
      if (rec.size) conclusion += ` (Size ${rec.size})`;
      conclusion += `\n   → ${rec.quantityRecommendation}\n   → Alasan: ${rec.reason}\n`;
    });
  } else {
    conclusion += `• Tidak ada tindakan mendesak yang diperlukan saat ini\n`;
  }
  conclusion += `\n`;
  
  conclusion += `PRIORITAS SEDANG (Tindakan 1-4 minggu):\n`;
  const mediumActions = stockRecs.filter(r => r.action === 'REDUCE' || (r.action === 'INCREASE' && r.priority === 'HIGH'));
  if (mediumActions.length > 0) {
    const increaseCount = mediumActions.filter(r => r.action === 'INCREASE').length;
    const reduceCount = mediumActions.filter(r => r.action === 'REDUCE').length;
    
    if (increaseCount > 0) {
      conclusion += `• Fokuskan produksi pada ${increaseCount} produk best seller\n`;
    }
    if (reduceCount > 0) {
      conclusion += `• Buat strategi promo/clearance untuk ${reduceCount} produk slow moving\n`;
    }
    conclusion += `• Lakukan monitoring stok mingguan dan sesuaikan dengan permintaan\n`;
    conclusion += `• Evaluasi performa produk baru secara berkala\n`;
  }
  conclusion += `\n`;
  
  conclusion += `STRATEGI JANGKA PANJANG (1-3 bulan):\n`;
  conclusion += `• Analisis tren musiman untuk setiap kategori produk\n`;
  conclusion += `• Optimalkan rasio produksi berdasarkan data size analysis\n`;
  conclusion += `• Implementasikan sistem pre-order untuk produk baru\n`;
  conclusion += `• Kumpulkan feedback pelanggan untuk perbaikan seleksi produk\n`;
  conclusion += `• Diversifikasi produk pada kategori dengan performa terbaik\n`;
  
  return conclusion;
}

/**
 * MAIN FUNCTION - Analisis Fashion Data
 */
export async function analyzeFashionData(file: File): Promise<FashionAnalysisResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          
          if (data.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }
          
          // STEP 1: DETEKSI KOLOM OTOMATIS
          const columns = detectAllColumns(data);
          
          if (!columns.product || !columns.quantity) {
            reject(new Error('Cannot detect product or quantity columns in CSV. Please ensure your CSV contains product names and quantities.'));
            return;
          }
          
          // STEP 2: EXTRACT PRODUCTS DENGAN AI SIZE DETECTION
          const products: FashionProduct[] = [];
          const productMap = new Map<string, FashionProduct>();
          
          data.forEach(row => {
            let productName = String(row[columns.product!] || '').trim();
            if (!productName) return;
            
            const category = columns.category ? String(row[columns.category] || '').trim() : undefined;
            
            // AI SMART: Ekstrak size dari kolom size ATAU dari nama produk
            let size: string | undefined = undefined;
            
            if (columns.size) {
              // Jika ada kolom size terpisah, gunakan itu
              size = String(row[columns.size] || '').trim().toUpperCase();
            }
            
            // Jika tidak ada size dari kolom, EKSTRAK dari nama produk
            if (!size || size === '') {
              const extracted = extractSizeFromProductName(productName);
              if (extracted.size) {
                size = extracted.size;
                productName = extracted.cleanName; // Gunakan nama bersih (tanpa size)
              }
            }
            
            let price = 0;
            if (columns.price) {
              const priceStr = String(row[columns.price] || '').replace(/[^0-9.]/g, '');
              price = parseFloat(priceStr) || 0;
            }
            
            const qtyStr = String(row[columns.quantity!] || '').replace(/[^0-9.]/g, '');
            const quantity = parseFloat(qtyStr) || 0;
            
            if (quantity <= 0) return;
            
            // PRIORITAS: Gunakan revenue dari kolom jika ada
            let revenue = 0;
            if (columns.revenue) {
              const revenueStr = String(row[columns.revenue] || '').replace(/[^0-9.]/g, '');
              revenue = parseFloat(revenueStr) || 0;
              console.log(`✅ Using actual revenue from data: Rp ${revenue.toLocaleString('id-ID')}`);
            }
            // Fallback: Hitung dari price × quantity jika tidak ada kolom revenue
            if (revenue <= 0) {
              revenue = price * quantity;
              console.log(`⚠️ Computing revenue: ${price} × ${quantity} = ${revenue}`);
            }
            
            // Group by product+size (if available)
            // PENTING: Sekarang productName sudah bersih, size terpisah
            const key = size ? `${productName}_${size}` : productName;
            
            if (productMap.has(key)) {
              const existing = productMap.get(key)!;
              existing.quantity += quantity;
              existing.revenue += revenue;
            } else {
              productMap.set(key, {
                name: productName,
                category,
                size,
                price: price || 0,
                quantity,
                revenue
              });
            }
          });
          
          products.push(...Array.from(productMap.values()));
          
          if (products.length === 0) {
            reject(new Error('No valid products found in CSV'));
            return;
          }
          
          // STEP 3: ANALISIS
          const sizeAnalysis = analyzeSizes(products);
          const categoryAnalysis = analyzeCategories(products);
          const stockRecommendations = generateStockRecommendations(products, sizeAnalysis);
          const deadstockAnalysis = analyzeDeadstock(products, stockRecommendations);
          
          const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
          const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
          const averagePrice = totalUnits > 0 ? totalRevenue / totalUnits : 0;
          
          const insights = generateInsights(
            products,
            sizeAnalysis,
            categoryAnalysis,
            stockRecommendations,
            deadstockAnalysis
          );
          
          const conclusion = generateConclusion(
            products,
            sizeAnalysis,
            categoryAnalysis,
            stockRecommendations,
            deadstockAnalysis,
            totalRevenue,
            totalUnits,
            averagePrice
          );
          
          // STEP 4: SKIRO INTELLIGENCE ENGINE - Advanced Analytics
          const intelligenceReport = generateIntelligenceReport(products);
          
          // STEP 5: SKIRO INTELLIGENCE ENGINE V2 - Ultra Smart Edition
          const ultraSmartReport = generateUltraSmartReport(products);
          
          // STEP 6: 🌟 SKIRO SUPREME AI - The Ultimate All-in-One Business Consultant
          const supremeAIReport = generateSupremeAIReport(products, categoryAnalysis, sizeAnalysis);
          
          resolve({
            products,
            sizeAnalysis,
            categoryAnalysis,
            stockRecommendations,
            deadstockAnalysis,
            insights,
            conclusion,
            totalRevenue,
            totalUnits,
            averagePrice,
            intelligenceReport,
            ultraSmartReport,
            supremeAIReport
          });
          
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * ANALYZE FILE WITH SMART DETECTION
 * Fungsi baru yang bisa baca CSV dan XLSX dengan deteksi otomatis
 * Tidak perlu tahu nama kolom - sistem akan deteksi sendiri dari ISI!
 */
export async function analyzeFileWithSmartDetection(file: File): Promise<FashionAnalysisResult> {
  console.log('🚀 Starting SMART file analysis...');
  
  try {
    // STEP 1: SMART FILE READING
    const smartResult = await smartReadFile(file);
    console.log(`✅ File read successful: ${smartResult.fileType.toUpperCase()}`);
    console.log(`📊 Detected ${smartResult.data.length} data rows`);
    console.log(`🎯 Detection confidence: ${smartResult.mapping.confidence.toFixed(1)}%`);
    
    const { data, mapping } = smartResult;
    
    // DEBUGGING: Show mapping clearly
    console.log('\n🔍 === COLUMN MAPPING DETECTED ===');
    console.log(`Product Column: ${mapping.product} ✅`);
    console.log(`Category Column: ${mapping.category !== undefined ? mapping.category + ' ✅' : '❌ (Optional - No category analysis)'}`);
    console.log(`Variant/Size Column: ${mapping.variant !== undefined ? mapping.variant + ' ✅' : '❌ (No size analysis)'}`);
    console.log(`Revenue Column: ${mapping.revenue !== undefined ? mapping.revenue + ' ✅ (PRIORITAS)' : '❌ (Will use price as revenue)'}`);
    console.log(`Price Column: ${mapping.price} ✅`);
    console.log(`Quantity Column: ${mapping.quantity >= 0 ? mapping.quantity + ' ✅ (REAL QTY DATA!)' : '❌ (OPTIONAL - No unit analysis)'}`);
    console.log(`SKU Column: ${mapping.sku !== undefined ? mapping.sku + ' ✅' : '❌ (Optional)'}`);
    
    // ⚠️ CRITICAL: Show what headers are at those indices!
    const headers = data[0] || [];
    console.log('\n⚠️⚠️⚠️ VERIFY COLUMN MAPPING:');
    console.log(`  Index ${mapping.product} = "${headers[mapping.product]}" (should be Product Name)`);
    console.log(`  Index ${mapping.price} = "${headers[mapping.price]}" (should be Price/Harga)`);
    if (mapping.quantity >= 0) {
      const qtyHeader = headers[mapping.quantity]?.toLowerCase() || '';
      console.log(`  Index ${mapping.quantity} = "${headers[mapping.quantity]}" (should be Qty/Quantity!) ⭐⭐⭐`);
      
      // 🔴 CRITICAL: Check if quantity column is actually a DATE column!
      if (qtyHeader.includes('date') || qtyHeader.includes('tanggal') || qtyHeader.includes('waktu') || qtyHeader.includes('time')) {
        console.error(`❌❌❌ CRITICAL ERROR: QUANTITY COLUMN IS A DATE COLUMN!`);
        console.error(`   Header: "${headers[mapping.quantity]}"`);
        console.error(`   This will cause MASSIVE number errors! Disabling quantity analysis...`);
        mapping.quantity = -1; // Disable quantity analysis
      } else {
        console.log(`  🔍 FIRST 3 QTY VALUES from column ${mapping.quantity}:`);
        data.slice(1, 4).forEach((row, idx) => {
          console.log(`     Row ${idx + 1}: "${row[mapping.quantity]}" (should be single digit like 3, 5, 4)`);
        });
        
        // 🔴 DETECT WRONG MAPPING: If quantity values look like dates or large numbers
        const sampleQtyValues = data.slice(1, 4).map(row => row[mapping.quantity]);
        const hasLargeNumbers = sampleQtyValues.some(val => {
          const str = String(val);
          // Check for date patterns like "2025-10-02"
          if (str.includes('-') && str.length > 8) return true;
          const num = parseInt(str.replace(/[^\d]/g, ''), 10);
          return num > 1000;
        });
        
        if (hasLargeNumbers) {
          console.error(`❌❌❌ COLUMN MAPPING ERROR DETECTED!`);
          console.error(`   Quantity column contains suspicious values: ${sampleQtyValues.join(', ')}`);
          console.error(`   This looks like DATES or PRICES, not quantities!`);
          console.error(`   DISABLING quantity analysis to prevent wrong calculations...`);
          mapping.quantity = -1; // Disable quantity analysis
        }
      }
    }
    if (mapping.revenue !== undefined) {
      console.log(`  Index ${mapping.revenue} = "${headers[mapping.revenue]}" (should be Total/Revenue)`);
    }
    
    console.log('\n📊 === DATA AVAILABILITY CHECK ===');
    console.log(`✅ Product names: Always required`);
    console.log(`${mapping.variant !== undefined ? '✅' : '❌'} Size data: ${mapping.variant !== undefined ? 'Will analyze sizes' : 'Skip size analysis'}`);
    console.log(`${mapping.category !== undefined ? '✅' : '❌'} Category data: ${mapping.category !== undefined ? 'Will analyze categories' : 'Skip category analysis'}`);
    console.log(`${mapping.quantity >= 0 ? '✅' : '❌'} Quantity data: ${mapping.quantity >= 0 ? 'Will use REAL QTY from CSV for unit analysis' : 'SKIP unit analysis - revenue-based only!'}`);
    console.log(`${mapping.revenue !== undefined ? '✅' : '⚠️'} Revenue data: ${mapping.revenue !== undefined ? 'Using actual revenue from data' : 'Using price column as revenue'}`);
    
    if (mapping.quantity >= 0) {
      console.log(`\n⚠️⚠️⚠️ IMPORTANT: Units Sold will be calculated from QTY column (index ${mapping.quantity})`);
      console.log(`This is REAL DATA from your CSV - NOT calculated or fabricated!`);
    }
    
    // DEBUGGING: Show first 3 rows with their values
    console.log('\n🔍 === FIRST 3 ROWS (RAW DATA) ===');
    data.slice(0, 3).forEach((row, idx) => {
      console.log(`\nRow ${idx + 1}:`);
      console.log(`  Product [${mapping.product}]: "${row[mapping.product]}"`);
      if (mapping.category !== undefined) {
        console.log(`  Category [${mapping.category}]: "${row[mapping.category]}"`);
      }
      if (mapping.variant !== undefined) {
        console.log(`  Variant/Size [${mapping.variant}]: "${row[mapping.variant]}"`);
      }
      if (mapping.revenue !== undefined) {
        console.log(`  Revenue [${mapping.revenue}]: "${row[mapping.revenue]}" ⭐`);
      }
      console.log(`  Price [${mapping.price}]: "${row[mapping.price]}"`);
      console.log(`  Quantity [${mapping.quantity}]: "${row[mapping.quantity]}"`);
    });
    
    // STEP 2: CONVERT TO PRODUCTS
    const products: FashionProduct[] = [];
    const productMap = new Map<string, FashionProduct>();
    
    data.forEach((row, index) => {
      try {
        // Extract data menggunakan mapping yang terdeteksi
        const productName = row[mapping.product];
        const category = mapping.category !== undefined ? row[mapping.category] : undefined;
        const variant = mapping.variant !== undefined ? row[mapping.variant] : undefined;
        const revenueRaw = mapping.revenue !== undefined ? row[mapping.revenue] : undefined;
        const priceRaw = row[mapping.price];
        const quantityRaw = mapping.quantity >= 0 ? row[mapping.quantity] : undefined;
        
        // ⚠️ CRITICAL: Skip jika PRODUCT atau PRICE tidak valid
        // QUANTITY IS OPTIONAL - allow undefined!
        if (!productName || !priceRaw) {
          if (index < 3) console.log(`⚠️ Row ${index + 1} skipped: Missing product name or price`);
          return;
        }
        
        // Parse numbers dengan SMART PARSER
        const price = parseSmartNumber(priceRaw);
        const quantity = quantityRaw !== undefined && quantityRaw !== null ? parseSmartNumber(quantityRaw, 'quantity') : 0;
        
        // PRIORITAS: Gunakan revenue dari kolom jika ada
        let revenue = 0;
        if (revenueRaw) {
          revenue = parseSmartNumber(revenueRaw);
        }
        // If no revenue column AND we have quantity, compute revenue
        else if (quantity > 0) {
          revenue = price * quantity;
        }
        // If no revenue column AND no quantity, use price as revenue
        else {
          revenue = price;
        }
        
        // 🔴🔴🔴 EMERGENCY DEBUG: Track EVERY Rok Plisket entry!
        const isRokPlisket = productName.toLowerCase().includes('rok plisket');
        const isHoodie = productName.toLowerCase().includes('hoodie');
        if (isRokPlisket || isHoodie || index < 5) {
          const emoji = isRokPlisket ? '🔴🔴🔴 ROK PLISKET' : isHoodie ? '🟦 HOODIE' : '✅';
          console.log(`\n${emoji} Row ${index + 1}:`);
          console.log(`  Product: "${productName}" | Size: "${variant || 'N/A'}"`);
          console.log(`  📊 RAW VALUES from CSV column indices:`);
          console.log(`     Qty column [${mapping.quantity}]: RAW="${quantityRaw}" (type: ${typeof quantityRaw})`);
          console.log(`     Price column [${mapping.price}]: RAW="${priceRaw}"`);
          if (revenueRaw) console.log(`     Revenue column [${mapping.revenue}]: RAW="${revenueRaw}"`);
          console.log(`  🔢 AFTER parseSmartNumber:`);
          console.log(`     quantity = ${quantity} (should be 1-10)`);
          console.log(`     price = ${price}`);
          console.log(`     revenue = ${revenue}`);
          
          // 🔴 CRITICAL VALIDATION
          if (quantity > 100) {
            console.error(`❌❌❌ QUANTITY ERROR: ${quantity} is WAY TOO LARGE!`);
            console.error(`   Raw input was: "${quantityRaw}"`);
            console.error(`   This should be a small number like 3, 5, etc.`);
          }
        }
        
        // Validate price (quantity can be 0)
        if (price <= 0) {
          if (index < 3) console.warn(`⚠️ Invalid price: ${price}`);
          return;
        }
        
        // Gabungkan produk yang sama (per product + variant)
        const key = `${productName}|${variant || ''}`;
        
        if (productMap.has(key)) {
          const existing = productMap.get(key)!;
          
          // 🔴 CRITICAL DEBUG: Track ALL Rok Plisket merges!
          const isRokPlisket = key.toLowerCase().includes('rok plisket');
          const isHoodie = key.toLowerCase().includes('hoodie');
          if (isRokPlisket || isHoodie) {
            const emoji = isRokPlisket ? '🔴' : '🟦';
            console.log(`\n${emoji} MERGE "${key}" (Row ${index + 1})`);
            console.log(`  Before: qty=${existing.quantity}`);
            console.log(`  Adding: qty=${quantity} (type: ${typeof quantity})`);
            console.log(`  Math check: ${existing.quantity} + ${quantity} = ${existing.quantity + quantity}`);
          }
          
          const oldQty = existing.quantity;
          existing.quantity += quantity; // ✅ SIMPLE SUM
          existing.revenue += revenue;
          
          if (isRokPlisket || isHoodie) {
            console.log(`  ✅ After: qty=${existing.quantity}`);
            // Verify the math is correct
            if (Math.abs(existing.quantity - (oldQty + quantity)) > 0.001) {
              console.error(`  ❌❌❌ MATH ERROR! ${oldQty} + ${quantity} ≠ ${existing.quantity}`);
            }
          }
          
          // ⚠️ CRITICAL FIX: Don't recalculate price! Keep original price per unit
          // Price should remain stable, only quantity and revenue are accumulated
        } else {
          productMap.set(key, {
            name: String(productName).trim(),
            category: category ? String(category).trim() : undefined,
            size: variant ? String(variant).trim() : undefined,
            price,
            quantity,
            revenue
          });
        }
      } catch (error) {
        console.warn(`⚠️ Skipping row ${index + 1}:`, error);
      }
    });
    
    products.push(...Array.from(productMap.values()));
    
    if (products.length === 0) {
      throw new Error('Tidak ada produk valid ditemukan. Pastikan file berisi data penjualan yang benar.');
    }
    
    console.log(`\n✅ === PROCESSED ${products.length} UNIQUE PRODUCTS ===`);
    
    // 🔴🔴🔴 EMERGENCY: Find Rok Plisket and verify its final quantity!
    const rokPlisket = products.find(p => p.name.toLowerCase().includes('rok plisket'));
    if (rokPlisket) {
      console.log('\n🔴🔴🔴 === ROK PLISKET FINAL RESULT ===');
      console.log(`Name: ${rokPlisket.name}`);
      console.log(`Size: ${rokPlisket.size || 'N/A'}`);
      console.log(`FINAL Quantity: ${rokPlisket.quantity} units`);
      console.log(`Revenue: Rp ${rokPlisket.revenue.toLocaleString('id-ID')}`);
      console.log(`Price: Rp ${rokPlisket.price.toLocaleString('id-ID')}`);
      console.log(`\n⚠️ EXPECTED from your data:`);
      console.log(`   Row 6: 5, Row 8: 2, Row 9: 4, Row 10: 5`);
      console.log(`   Row 18: 2, Row 25: 2, Row 30: 1, Row 44: 1`);
      console.log(`   TOTAL EXPECTED: 5+2+4+5+2+2+1+1 = 21 units`);
      console.log(`   ACTUAL: ${rokPlisket.quantity} units`);
      if (Math.abs(rokPlisket.quantity - 21) > 0.1) {
        console.error(`❌❌❌ ERROR! Off by ${rokPlisket.quantity - 21} units!`);
      } else {
        console.log(`✅✅✅ PERFECT! Matches expected!`);
      }
    }
    
    // Verify Hoodie Unisex L
    const hoodieL = products.find(p => p.name.toLowerCase().includes('hoodie') && p.size?.toLowerCase() === 'l');
    if (hoodieL) {
      console.log('\n🟦 === HOODIE UNISEX L FINAL RESULT ===');
      console.log(`FINAL Quantity: ${hoodieL.quantity} units`);
      console.log(`   EXPECTED: Row 17: 4, Row 20: 5, Row 39: 2, Row 41: 3, Row 42: 4`);
      console.log(`   TOTAL EXPECTED: 4+5+2+3+4 = 18 units`);
      console.log(`   ACTUAL: ${hoodieL.quantity} units`);
      if (Math.abs(hoodieL.quantity - 18) > 0.1) {
        console.error(`❌❌❌ ERROR! Off by ${hoodieL.quantity - 18} units!`);
      } else {
        console.log(`✅✅✅ PERFECT!`);
      }
    }
    
    // Calculate total units
    const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
    console.log(`\n📊 TOTAL UNITS ACROSS ALL PRODUCTS: ${totalUnits}`);
    console.log(`   EXPECTED from your 50 rows of data: 165 units`);
    if (Math.abs(totalUnits - 165) > 1) {
      console.error(`❌❌❌ CRITICAL ERROR! Total is wrong by ${totalUnits - 165} units!`);
    } else {
      console.log(`✅✅✅ TOTAL IS CORRECT!`);
    }
    
    // Calculate statistics
    const totalRev = products.reduce((sum, p) => sum + p.revenue, 0);
    const avgPrice = totalRev / totalUnits;
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));
    
    console.log(`📊 Total Quantity: ${totalUnits.toLocaleString()} units`);
    console.log(`💰 Total Revenue: Rp ${totalRev.toLocaleString('id-ID')}`);
    console.log(`💵 Average Price: Rp ${avgPrice.toLocaleString('id-ID')}`);
    console.log(`💵 Price Range: Rp ${minPrice.toLocaleString('id-ID')} - Rp ${maxPrice.toLocaleString('id-ID')}`);
    
    console.log(`\n⚠️ VERIFIKASI UNIT TERJUAL:`);
    console.log(`Total Units = ${totalUnits} unit (dari SUM quantity di ${products.length} produk)`);
    console.log(`Quantity per produk = REAL DATA dari kolom QTY di CSV (BUKAN dihitung/ngarang!)`);
    if (totalUnits === 0) {
      console.log(`❌ WARNING: Total units = 0! Kemungkinan tidak ada kolom QTY di CSV.`);
      console.log(`   Sistem akan skip analisis unit-based dan fokus ke revenue.`);
    }
    
    // Show top 5 products by REVENUE (more important than quantity)
    console.log(`\n🏆 Top 5 Products by Revenue:`);
    [...products]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .forEach((p, idx) => {
        const revPercent = (p.revenue / totalRev) * 100;
        console.log(`  ${idx + 1}. ${p.name} ${p.size || ''} - Rp ${p.revenue.toLocaleString('id-ID')} (${revPercent.toFixed(1)}%) | ${p.quantity} units @ Rp ${p.price.toLocaleString('id-ID')}`);
      });
    
    // Show top 5 by quantity too
    console.log(`\n📦 Top 5 Products by Quantity:`);
    [...products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .forEach((p, idx) => {
        console.log(`  ${idx + 1}. ${p.name} ${p.size || ''} - ${p.quantity} units (Rp ${p.revenue.toLocaleString('id-ID')})`);
      });
    
    // STEP 3: ANALISIS LENGKAP
    console.log('\n🔬 === STARTING ANALYSIS ===');
    
    const sizeAnalysis = analyzeSizes(products);
    const categoryAnalysis = analyzeCategories(products);
    const stockRecommendations = generateStockRecommendations(products, sizeAnalysis);
    const deadstockAnalysis = analyzeDeadstock(products, stockRecommendations);
    
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    const finalTotalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
    const averagePrice = finalTotalUnits > 0 ? totalRevenue / finalTotalUnits : 0;
    
    // SMART SUMMARY - Tampilkan fitur apa yang aktif
    console.log('\n✅ === ANALYSIS FEATURES ACTIVATED ===');
    console.log(`✅ Product Revenue Analysis: ${products.length} products`);
    console.log(`${sizeAnalysis.length > 0 ? '✅' : '❌'} Size Analysis: ${sizeAnalysis.length > 0 ? sizeAnalysis.length + ' sizes detected' : 'No size data - skipped'}`);
    console.log(`${categoryAnalysis.length > 0 && categoryAnalysis[0].category !== 'Uncategorized' ? '✅' : '❌'} Category Analysis: ${categoryAnalysis.length > 0 && categoryAnalysis[0].category !== 'Uncategorized' ? categoryAnalysis.length + ' categories' : 'No category data - skipped'}`);
    console.log(`✅ Stock Recommendations: ${stockRecommendations.length} recommendations`);
    console.log(`✅ Deadstock Risk Assessment: ${deadstockAnalysis.productsAtRisk.length} at-risk products`);
    console.log(`${finalTotalUnits > 0 ? '✅' : '⚠️'} Quantity Metrics: ${finalTotalUnits > 0 ? 'Available' : 'Using revenue-based analysis only'}`);
    
    const insights = generateInsights(
      products,
      sizeAnalysis,
      categoryAnalysis,
      stockRecommendations,
      deadstockAnalysis
    );
    
    const conclusion = generateConclusion(
      products,
      sizeAnalysis,
      categoryAnalysis,
      stockRecommendations,
      deadstockAnalysis,
      totalRevenue,
      finalTotalUnits,
      averagePrice
    );
    
    // STEP 4: SKIRO INTELLIGENCE ENGINE - Advanced Analytics
    const intelligenceReport = generateIntelligenceReport(products);
    
    // STEP 5: SKIRO INTELLIGENCE ENGINE V2 - Ultra Smart Edition
    const ultraSmartReport = generateUltraSmartReport(products);
    
    // STEP 6: 🌟 SKIRO SUPREME AI - The Ultimate All-in-One Business Consultant
    const supremeAIReport = generateSupremeAIReport(products, categoryAnalysis, sizeAnalysis);
    
    // STEP 7: FINANCIAL HEALTH ANALYZER - Anti-Bankruptcy System
    const financialHealth = analyzeFinancialHealth(products, stockRecommendations);
    
    console.log('\n🎉 === ANALYSIS COMPLETE ===');
    console.log(`✅ ${products.length} products analyzed`);
    console.log(`✅ ${sizeAnalysis.length} sizes evaluated`);
    console.log(`✅ ${categoryAnalysis.length} categories assessed`);
    console.log(`✅ ${stockRecommendations.length} recommendations generated`);
    console.log(`✅ ${insights.length} business insights discovered`);
    console.log(`✅ Financial Health Score: ${financialHealth.overallHealthScore.toFixed(1)}/100`);
    console.log(`✅ SUPREME AI Health Score: ${supremeAIReport.executive_summary.overall_health_score}/100`);
    console.log(`✅ Bankruptcy Risk: ${financialHealth.bankruptcyRisk}`);
    console.log(`\n💡 Check report for detailed analysis and actionable strategies!`);
    
    return {
      products,
      sizeAnalysis,
      categoryAnalysis,
      stockRecommendations,
      deadstockAnalysis,
      insights,
      conclusion,
      totalRevenue,
      totalUnits: finalTotalUnits,
      averagePrice,
      intelligenceReport,
      ultraSmartReport,
      supremeAIReport,
      financialHealth
    };
    
  } catch (error) {
    console.error('❌ Smart analysis failed:', error);
    throw error;
  }
}
