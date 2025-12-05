/**
 * ═══════════════════════════════════════════════════════════════
 * SKIRO INTELLIGENCE ENGINE V2 - ULTRA SMART EDITION
 * ═══════════════════════════════════════════════════════════════
 * Sistem analisis cerdas untuk UMKM Fashion dengan output JSON terstruktur
 * 
 * Fitur Utama:
 * - Klasifikasi BEST_SELLER, SLOW_MOVER, DEADSTOCK_CANDIDATE
 * - Analisis per-size yang sangat detail
 * - Time-period analysis (bulanan/mingguan)
 * - Rekomendasi NAIKKAN vs TURUNKAN dengan confidence level
 * - JSON output + human-readable summary
 * 
 * Philosophy: "Robot terpintar untuk UMKM Fashion Indonesia"
 */

import { FashionProduct } from './fashionAnalyzer';

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export type ProductLabel = 'BEST_SELLER' | 'SLOW_MOVER' | 'DEADSTOCK_CANDIDATE' | 'NORMAL';
export type ActionType = 'NAIKKAN_PRODUKSI' | 'TURUNKAN_PRODUKSI' | 'MAINTAIN' | 'MONITOR';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ProductSizeAnalysis {
  product_name: string;
  category?: string;
  size?: string;
  total_qty: number;
  revenue: number;
  avg_price: number;
  contribution_percentage: number;
  label: ProductLabel;
  reason: string;
  velocity_score: number; // 0-100
}

export interface StockRecommendationV2 {
  product_name: string;
  category?: string;
  size?: string;
  current_sales: number;
  suggested_action: ActionType;
  confidence: ConfidenceLevel;
  reason: string;
  quantitative_target?: string;
  expected_impact: string;
  priority: number; // 1-10
}

export interface TimePeriodSummary {
  start_date?: string;
  end_date?: string;
  total_days?: number;
  has_date_data: boolean;
}

export interface SkiroIntelligenceV2Report {
  summary: {
    total_products: number;
    total_records: number;
    total_revenue: number;
    total_units_sold: number;
    period: TimePeriodSummary;
    analysis_date: string;
  };
  
  insights: {
    top_best_sellers: ProductSizeAnalysis[];
    top_slow_movers: ProductSizeAnalysis[];
    top_deadstock_candidates: ProductSizeAnalysis[];
    size_performance: {
      size: string;
      total_sold: number;
      percentage: number;
      status: 'hot' | 'normal' | 'cold';
    }[];
    category_performance: {
      category: string;
      total_sold: number;
      revenue: number;
      percentage: number;
    }[];
  };
  
  recommendations: {
    increase_stock: StockRecommendationV2[];
    decrease_stock: StockRecommendationV2[];
    monitor: StockRecommendationV2[];
  };
  
  detailed_analysis: ProductSizeAnalysis[];
  
  human_summary: string[];
  
  notes: string[];
}

// ═══════════════════════════════════════════════════════════════
// CORE ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate velocity score (0-100) based on multiple factors
 */
function calculateVelocityScore(
  quantity: number,
  revenue: number,
  totalUnits: number,
  totalRevenue: number
): number {
  const qtyPercentage = totalUnits > 0 ? (quantity / totalUnits) * 100 : 0;
  const revenuePercentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
  
  // Weighted score: 60% quantity, 40% revenue
  const score = (qtyPercentage * 0.6) + (revenuePercentage * 0.4);
  
  return Math.min(100, Math.max(0, score * 2)); // Scale up and cap at 100
}

/**
 * Classify product based on velocity score
 */
function classifyProduct(
  velocityScore: number,
  quantity: number,
  avgQuantity: number
): ProductLabel {
  // BEST_SELLER: High velocity OR significantly above average
  if (velocityScore > 15 || quantity > avgQuantity * 2) {
    return 'BEST_SELLER';
  }
  
  // DEADSTOCK_CANDIDATE: Very low velocity AND below threshold
  if (velocityScore < 2 && quantity < 5) {
    return 'DEADSTOCK_CANDIDATE';
  }
  
  // SLOW_MOVER: Low velocity but not critical
  if (velocityScore < 5 || quantity < avgQuantity * 0.3) {
    return 'SLOW_MOVER';
  }
  
  return 'NORMAL';
}

/**
 * Generate reason for classification
 */
function generateClassificationReason(
  label: ProductLabel,
  quantity: number,
  velocityScore: number,
  contributionPercentage: number
): string {
  switch (label) {
    case 'BEST_SELLER':
      return `Penjualan sangat tinggi (${quantity} unit, ${velocityScore.toFixed(1)}% velocity score). Kontribusi ${contributionPercentage.toFixed(1)}% dari total penjualan.`;
    
    case 'SLOW_MOVER':
      return `Penjualan rendah (${quantity} unit, ${velocityScore.toFixed(1)}% velocity). Perlu monitoring ketat untuk mencegah deadstock.`;
    
    case 'DEADSTOCK_CANDIDATE':
      return `RISIKO TINGGI: Hanya ${quantity} unit terjual, velocity score ${velocityScore.toFixed(1)}%. Berpotensi menjadi deadstock jika tidak ada aksi.`;
    
    default:
      return `Performa normal (${quantity} unit terjual).`;
  }
}

/**
 * Analyze products with size breakdown
 */
function analyzeProductsWithSize(products: FashionProduct[]): ProductSizeAnalysis[] {
  const analysis: ProductSizeAnalysis[] = [];
  
  // Group by product + size
  const groupMap = new Map<string, {
    name: string;
    category?: string;
    size?: string;
    qty: number;
    revenue: number;
  }>();
  
  products.forEach(product => {
    const key = product.size 
      ? `${product.name}_${product.size}`
      : product.name;
    
    const existing = groupMap.get(key) || {
      name: product.name,
      category: product.category,
      size: product.size,
      qty: 0,
      revenue: 0
    };
    
    groupMap.set(key, {
      name: existing.name,
      category: existing.category || product.category,
      size: existing.size || product.size,
      qty: existing.qty + product.quantity,
      revenue: existing.revenue + product.revenue
    });
  });
  
  // Calculate totals
  const totalUnits = Array.from(groupMap.values()).reduce((sum, p) => sum + p.qty, 0);
  const totalRevenue = Array.from(groupMap.values()).reduce((sum, p) => sum + p.revenue, 0);
  const avgQuantity = totalUnits / groupMap.size;
  
  // Analyze each product+size combination
  groupMap.forEach((data, key) => {
    const velocityScore = calculateVelocityScore(
      data.qty,
      data.revenue,
      totalUnits,
      totalRevenue
    );
    
    const contributionPercentage = totalUnits > 0 ? (data.qty / totalUnits) * 100 : 0;
    const label = classifyProduct(velocityScore, data.qty, avgQuantity);
    const reason = generateClassificationReason(label, data.qty, velocityScore, contributionPercentage);
    
    analysis.push({
      product_name: data.name,
      category: data.category,
      size: data.size,
      total_qty: data.qty,
      revenue: data.revenue,
      avg_price: data.qty > 0 ? data.revenue / data.qty : 0,
      contribution_percentage: contributionPercentage,
      label,
      reason,
      velocity_score: velocityScore
    });
  });
  
  // Sort by quantity (descending)
  return analysis.sort((a, b) => b.total_qty - a.total_qty);
}

/**
 * Generate smart recommendations
 */
function generateSmartRecommendations(
  analysis: ProductSizeAnalysis[],
  totalUnits: number
): {
  increase_stock: StockRecommendationV2[];
  decrease_stock: StockRecommendationV2[];
  monitor: StockRecommendationV2[];
} {
  const increase: StockRecommendationV2[] = [];
  const decrease: StockRecommendationV2[] = [];
  const monitor: StockRecommendationV2[] = [];
  
  analysis.forEach((item, index) => {
    let recommendation: StockRecommendationV2 | null = null;
    
    // BEST_SELLER → NAIKKAN PRODUKSI
    if (item.label === 'BEST_SELLER') {
      const increasePercentage = item.velocity_score > 20 ? '40-50%' : '20-30%';
      
      recommendation = {
        product_name: item.product_name,
        category: item.category,
        size: item.size,
        current_sales: item.total_qty,
        suggested_action: 'NAIKKAN_PRODUKSI',
        confidence: item.velocity_score > 20 ? 'high' : 'medium',
        reason: `Produk ini BEST SELLER dengan ${item.total_qty} unit terjual (${item.contribution_percentage.toFixed(1)}% dari total). Demand tinggi dan konsisten.`,
        quantitative_target: `Tambah produksi/stok ${increasePercentage}`,
        expected_impact: `Capture opportunity dan avoid stockout. Potensi tambahan revenue ${increasePercentage}.`,
        priority: index + 1
      };
      
      increase.push(recommendation);
    }
    
    // DEADSTOCK_CANDIDATE → TURUNKAN PRODUKSI
    else if (item.label === 'DEADSTOCK_CANDIDATE') {
      recommendation = {
        product_name: item.product_name,
        category: item.category,
        size: item.size,
        current_sales: item.total_qty,
        suggested_action: 'TURUNKAN_PRODUKSI',
        confidence: item.velocity_score < 1 ? 'high' : 'medium',
        reason: `RISIKO DEADSTOCK! Hanya ${item.total_qty} unit terjual (${item.contribution_percentage.toFixed(1)}%). Velocity score sangat rendah (${item.velocity_score.toFixed(1)}).`,
        quantitative_target: `STOP produksi atau kurangi 80-100%`,
        expected_impact: `Hindari penumpukan stok, bebaskan modal untuk produk laris. Lakukan diskon 30-50% untuk clear existing stock.`,
        priority: index + 1
      };
      
      decrease.push(recommendation);
    }
    
    // SLOW_MOVER → TURUNKAN or MONITOR
    else if (item.label === 'SLOW_MOVER') {
      if (item.velocity_score < 3) {
        recommendation = {
          product_name: item.product_name,
          category: item.category,
          size: item.size,
          current_sales: item.total_qty,
          suggested_action: 'TURUNKAN_PRODUKSI',
          confidence: 'medium',
          reason: `Slow mover dengan ${item.total_qty} unit terjual. Velocity ${item.velocity_score.toFixed(1)}% menunjukkan demand lemah.`,
          quantitative_target: `Kurangi produksi 50-70%`,
          expected_impact: `Reduce deadstock risk dan optimize capital allocation.`,
          priority: decrease.length + increase.length + 1
        };
        
        decrease.push(recommendation);
      } else {
        recommendation = {
          product_name: item.product_name,
          category: item.category,
          size: item.size,
          current_sales: item.total_qty,
          suggested_action: 'MONITOR',
          confidence: 'low',
          reason: `Performance di bawah average tapi belum kritis. Perlu observasi 1-2 periode lagi.`,
          quantitative_target: `Maintain current level, monitor closely`,
          expected_impact: `Tunggu data lebih banyak sebelum keputusan besar.`,
          priority: 99
        };
        
        monitor.push(recommendation);
      }
    }
  });
  
  return { increase_stock: increase, decrease_stock: decrease, monitor };
}

/**
 * Analyze size performance across all products
 */
function analyzeSizePerformance(products: FashionProduct[]): {
  size: string;
  total_sold: number;
  percentage: number;
  status: 'hot' | 'normal' | 'cold';
}[] {
  const sizeMap = new Map<string, number>();
  
  products.forEach(product => {
    if (product.size) {
      const current = sizeMap.get(product.size) || 0;
      sizeMap.set(product.size, current + product.quantity);
    }
  });
  
  const totalWithSize = Array.from(sizeMap.values()).reduce((sum, qty) => sum + qty, 0);
  
  const result = Array.from(sizeMap.entries()).map(([size, qty]) => {
    const percentage = totalWithSize > 0 ? (qty / totalWithSize) * 100 : 0;
    
    let status: 'hot' | 'normal' | 'cold';
    if (percentage > 25) status = 'hot';
    else if (percentage < 10) status = 'cold';
    else status = 'normal';
    
    return { size, total_sold: qty, percentage, status };
  });
  
  return result.sort((a, b) => b.total_sold - a.total_sold);
}

/**
 * Analyze category performance
 */
function analyzeCategoryPerformance(products: FashionProduct[]): {
  category: string;
  total_sold: number;
  revenue: number;
  percentage: number;
}[] {
  const categoryMap = new Map<string, { qty: number; revenue: number }>();
  
  products.forEach(product => {
    const cat = product.category || 'Uncategorized';
    const current = categoryMap.get(cat) || { qty: 0, revenue: 0 };
    categoryMap.set(cat, {
      qty: current.qty + product.quantity,
      revenue: current.revenue + product.revenue
    });
  });
  
  const totalUnits = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.qty, 0);
  
  const result = Array.from(categoryMap.entries()).map(([category, data]) => {
    const percentage = totalUnits > 0 ? (data.qty / totalUnits) * 100 : 0;
    
    return {
      category,
      total_sold: data.qty,
      revenue: data.revenue,
      percentage
    };
  });
  
  return result.sort((a, b) => b.total_sold - a.total_sold);
}

/**
 * Generate human-readable summary
 */
function generateHumanSummary(report: SkiroIntelligenceV2Report): string[] {
  const summary: string[] = [];
  
  // Overview
  summary.push(`📊 RINGKASAN ANALISIS: Sistem menganalisis ${report.summary.total_products} produk dengan total ${report.summary.total_units_sold} unit terjual dan revenue Rp ${report.summary.total_revenue.toLocaleString('id-ID')}.`);
  
  // Best sellers
  const topSellers = report.insights.top_best_sellers.slice(0, 3);
  if (topSellers.length > 0) {
    const sellerNames = topSellers.map(s => 
      `${s.product_name}${s.size ? ` (${s.size})` : ''} - ${s.total_qty} unit`
    ).join(', ');
    summary.push(`🏆 TOP 3 BEST SELLERS: ${sellerNames}. Produk-produk ini perlu PRIORITAS RESTOCKING.`);
  }
  
  // Deadstock risks
  const deadstocks = report.insights.top_deadstock_candidates;
  if (deadstocks.length > 0) {
    summary.push(`🚨 PERINGATAN DEADSTOCK: ${deadstocks.length} produk berisiko tinggi menjadi deadstock. Segera lakukan clearance sale atau stop produksi.`);
    
    const topDeadstock = deadstocks.slice(0, 2).map(d => 
      `${d.product_name}${d.size ? ` (${d.size})` : ''}`
    ).join(', ');
    summary.push(`⚠️ Prioritas clearance: ${topDeadstock}.`);
  }
  
  // Action priorities
  const increaseCount = report.recommendations.increase_stock.length;
  const decreaseCount = report.recommendations.decrease_stock.length;
  
  if (increaseCount > 0) {
    summary.push(`📈 REKOMENDASI NAIKKAN: ${increaseCount} produk perlu peningkatan produksi/stok untuk capture demand.`);
  }
  
  if (decreaseCount > 0) {
    summary.push(`📉 REKOMENDASI TURUNKAN: ${decreaseCount} produk perlu pengurangan drastis atau stop produksi untuk avoid deadstock.`);
  }
  
  // Size insights
  const hotSizes = report.insights.size_performance.filter(s => s.status === 'hot');
  if (hotSizes.length > 0) {
    const sizeNames = hotSizes.map(s => `${s.size} (${s.percentage.toFixed(0)}%)`).join(', ');
    summary.push(`🔥 SIZE PALING LAKU: ${sizeNames}. Fokuskan produksi pada size-size ini.`);
  }
  
  const coldSizes = report.insights.size_performance.filter(s => s.status === 'cold');
  if (coldSizes.length > 0) {
    const sizeNames = coldSizes.map(s => s.size).join(', ');
    summary.push(`❄️ SIZE KURANG LAKU: ${sizeNames}. Pertimbangkan kurangi atau stop produksi size ini.`);
  }
  
  // Call to action
  summary.push(`💡 AKSI PRIORITAS: Segera eksekusi ${Math.min(5, increaseCount + decreaseCount)} rekomendasi teratas untuk hasil maksimal.`);
  
  return summary;
}

// ═══════════════════════════════════════════════════════════════
// MAIN INTELLIGENCE ENGINE V2
// ═══════════════════════════════════════════════════════════════

/**
 * Generate Ultra Smart Intelligence Report
 */
export function generateUltraSmartReport(products: FashionProduct[]): SkiroIntelligenceV2Report {
  // Step 1: Analyze all products with size breakdown
  const detailedAnalysis = analyzeProductsWithSize(products);
  
  // Step 2: Extract insights by category
  const bestSellers = detailedAnalysis.filter(a => a.label === 'BEST_SELLER');
  const slowMovers = detailedAnalysis.filter(a => a.label === 'SLOW_MOVER');
  const deadstockCandidates = detailedAnalysis.filter(a => a.label === 'DEADSTOCK_CANDIDATE');
  
  // Step 3: Size performance
  const sizePerformance = analyzeSizePerformance(products);
  
  // Step 4: Category performance
  const categoryPerformance = analyzeCategoryPerformance(products);
  
  // Step 5: Generate recommendations
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const recommendations = generateSmartRecommendations(detailedAnalysis, totalUnits);
  
  // Step 6: Calculate summary
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  
  // Unique products count
  const uniqueProducts = new Set(products.map(p => 
    p.size ? `${p.name}_${p.size}` : p.name
  )).size;
  
  // Step 7: Build report
  const report: SkiroIntelligenceV2Report = {
    summary: {
      total_products: uniqueProducts,
      total_records: products.length,
      total_revenue: totalRevenue,
      total_units_sold: totalUnits,
      period: {
        has_date_data: false,
        // TODO: Extract from date column if available
      },
      analysis_date: new Date().toISOString().split('T')[0]
    },
    
    insights: {
      top_best_sellers: bestSellers.slice(0, 10),
      top_slow_movers: slowMovers.slice(0, 10),
      top_deadstock_candidates: deadstockCandidates,
      size_performance: sizePerformance,
      category_performance: categoryPerformance
    },
    
    recommendations: {
      increase_stock: recommendations.increase_stock.slice(0, 10),
      decrease_stock: recommendations.decrease_stock.slice(0, 10),
      monitor: recommendations.monitor.slice(0, 5)
    },
    
    detailed_analysis: detailedAnalysis,
    
    human_summary: [],
    
    notes: [
      'Analisis berdasarkan data penjualan historis yang tersedia',
      'Klasifikasi BEST_SELLER: Velocity score >15% atau >2x average',
      'Klasifikasi DEADSTOCK_CANDIDATE: Velocity score <2% dan <5 unit terjual',
      'Rekomendasi NAIKKAN: Untuk produk dengan demand tinggi dan konsisten',
      'Rekomendasi TURUNKAN: Untuk produk dengan risiko deadstock tinggi',
      'Confidence level: HIGH (>90% yakin), MEDIUM (70-90%), LOW (<70%)',
      'Size analysis: HOT (>25%), NORMAL (10-25%), COLD (<10%)'
    ]
  };
  
  // Step 8: Generate human summary
  report.human_summary = generateHumanSummary(report);
  
  return report;
}
