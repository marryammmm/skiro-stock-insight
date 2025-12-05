/**
 * ═══════════════════════════════════════════════════════════════
 * SKIRO INTELLIGENCE ENGINE
 * ═══════════════════════════════════════════════════════════════
 * Otak analitik & peramalan stok untuk manajemen inventory cerdas
 * 
 * Kemampuan:
 * - Demand forecasting (time series analysis)
 * - ABC analysis untuk klasifikasi produk
 * - Deadstock prediction dengan ML-based scoring
 * - Business-ready action recommendations
 * - Executive summary & deep insights
 * 
 * Philosophy: "Jangan hanya hitung angka, jadilah partner berpikir bisnis"
 */

import { FashionProduct } from './fashionAnalyzer';

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export interface TimeSeriesDataPoint {
  date: Date;
  value: number;
}

export interface ForecastResult {
  productName: string;
  currentAvgDemand: number;
  forecastedDemand: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendPercentage: number;
  confidence: 'high' | 'medium' | 'low';
  seasonalPattern: boolean;
}

export interface ABCClassification {
  productName: string;
  class: 'A' | 'B' | 'C';
  revenueContribution: number;
  cumulativePercentage: number;
  velocity: 'fast' | 'medium' | 'slow';
}

export interface EnhancedDeadstockRisk {
  productName: string;
  category?: string;
  size?: string;
  currentSales: number;
  forecastedDemand: number;
  riskScore: number; // 0-100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  daysToDeadstock: number | null;
  recommendation: string;
  actionPriority: number; // 1-10
}

export interface BusinessAction {
  priority: number; // 1-10 (1 = highest)
  actionType: 'REDUCE_ORDER' | 'INCREASE_ORDER' | 'PROMO' | 'BUNDLE' | 'REDISTRIBUTE' | 'DISCONTINUE';
  productName: string;
  category?: string;
  size?: string;
  description: string;
  quantitativeTarget: string; // e.g., "Kurangi 40-50%" atau "Tambah 30 unit"
  expectedImpact: string;
  timeframe: string; // e.g., "1-2 bulan", "Segera"
  reasoning: string;
}

export interface ExecutiveSummary {
  keyInsights: string[];
  topOpportunities: string[];
  criticalRisks: string[];
  recommendedActions: string[];
  overallHealth: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  healthScore: number; // 0-100
}

export interface SkiroIntelligenceReport {
  executiveSummary: ExecutiveSummary;
  forecasting: ForecastResult[];
  abcAnalysis: ABCClassification[];
  deadstockRisks: EnhancedDeadstockRisk[];
  businessActions: BusinessAction[];
  detailedInsights: string[];
  assumptions: string[];
  dataQuality: {
    score: number; // 0-100
    issues: string[];
    recommendations: string[];
  };
}

// ═══════════════════════════════════════════════════════════════
// CORE INTELLIGENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * DEMAND FORECASTING - Simple Time Series Analysis
 * Menggunakan moving average dan trend analysis
 */
function forecastDemand(products: FashionProduct[]): ForecastResult[] {
  const forecasts: ForecastResult[] = [];
  
  // Group products by name+size
  const productGroups = new Map<string, FashionProduct[]>();
  
  products.forEach(product => {
    const key = product.size ? `${product.name}_${product.size}` : product.name;
    if (!productGroups.has(key)) {
      productGroups.set(key, []);
    }
    productGroups.get(key)!.push(product);
  });
  
  // Analyze each product
  productGroups.forEach((items, productKey) => {
    if (items.length === 0) return;
    
    const totalSold = items.reduce((sum, p) => sum + p.quantity, 0);
    const avgDemand = totalSold / items.length;
    
    // Simple trend calculation (compare first half vs second half)
    const midPoint = Math.floor(items.length / 2);
    const firstHalf = items.slice(0, midPoint);
    const secondHalf = items.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, p) => sum + p.quantity, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, p) => sum + p.quantity, 0) / secondHalf.length;
    
    const trendPercentage = firstHalfAvg > 0 
      ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
      : 0;
    
    let trend: 'increasing' | 'stable' | 'decreasing';
    if (trendPercentage > 10) trend = 'increasing';
    else if (trendPercentage < -10) trend = 'decreasing';
    else trend = 'stable';
    
    // Forecasted demand (simple projection)
    let forecastedDemand = avgDemand;
    if (trend === 'increasing') {
      forecastedDemand = avgDemand * (1 + Math.abs(trendPercentage) / 100);
    } else if (trend === 'decreasing') {
      forecastedDemand = avgDemand * (1 - Math.abs(trendPercentage) / 100);
    }
    
    // Confidence based on data consistency
    const stdDev = calculateStdDev(items.map(p => p.quantity));
    const cv = avgDemand > 0 ? (stdDev / avgDemand) : 0;
    
    let confidence: 'high' | 'medium' | 'low';
    if (cv < 0.3) confidence = 'high';
    else if (cv < 0.6) confidence = 'medium';
    else confidence = 'low';
    
    forecasts.push({
      productName: items[0].name + (items[0].size ? ` (${items[0].size})` : ''),
      currentAvgDemand: Math.round(avgDemand * 10) / 10,
      forecastedDemand: Math.round(forecastedDemand * 10) / 10,
      trend,
      trendPercentage: Math.round(trendPercentage * 10) / 10,
      confidence,
      seasonalPattern: false // TODO: Implement seasonal detection
    });
  });
  
  return forecasts.sort((a, b) => b.currentAvgDemand - a.currentAvgDemand);
}

/**
 * ABC ANALYSIS - Klasifikasi produk berdasarkan kontribusi revenue
 * Pareto principle: 80/20 rule
 */
function performABCAnalysis(products: FashionProduct[]): ABCClassification[] {
  // Aggregate by product+size
  const productRevenue = new Map<string, { name: string; revenue: number; quantity: number }>();
  
  products.forEach(product => {
    const key = product.size ? `${product.name}_${product.size}` : product.name;
    const current = productRevenue.get(key) || { name: product.name, revenue: 0, quantity: 0 };
    productRevenue.set(key, {
      name: current.name,
      revenue: current.revenue + product.revenue,
      quantity: current.quantity + product.quantity
    });
  });
  
  // Sort by revenue (descending)
  const sorted = Array.from(productRevenue.entries())
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
  
  const totalRevenue = sorted.reduce((sum, p) => sum + p.revenue, 0);
  
  // Calculate cumulative percentage and assign ABC class
  let cumulative = 0;
  const classifications: ABCClassification[] = [];
  
  sorted.forEach((product) => {
    const revenueContribution = (product.revenue / totalRevenue) * 100;
    cumulative += revenueContribution;
    
    let productClass: 'A' | 'B' | 'C';
    if (cumulative <= 80) productClass = 'A';
    else if (cumulative <= 95) productClass = 'B';
    else productClass = 'C';
    
    // Velocity based on quantity sold
    let velocity: 'fast' | 'medium' | 'slow';
    if (product.quantity > 50) velocity = 'fast';
    else if (product.quantity > 20) velocity = 'medium';
    else velocity = 'slow';
    
    classifications.push({
      productName: product.name,
      class: productClass,
      revenueContribution: Math.round(revenueContribution * 100) / 100,
      cumulativePercentage: Math.round(cumulative * 100) / 100,
      velocity
    });
  });
  
  return classifications;
}

/**
 * ENHANCED DEADSTOCK RISK ANALYSIS
 * ML-inspired scoring dengan multiple factors
 */
function analyzeDeadstockRisks(
  products: FashionProduct[],
  forecasts: ForecastResult[]
): EnhancedDeadstockRisk[] {
  const risks: EnhancedDeadstockRisk[] = [];
  
  // Create forecast lookup
  const forecastMap = new Map(forecasts.map(f => [f.productName, f]));
  
  // Aggregate products
  const productMap = new Map<string, FashionProduct>();
  products.forEach(product => {
    const key = product.size ? `${product.name} (${product.size})` : product.name;
    const existing = productMap.get(key);
    if (!existing || product.quantity > existing.quantity) {
      productMap.set(key, product);
    }
  });
  
  productMap.forEach((product, key) => {
    const forecast = forecastMap.get(key);
    
    // Calculate risk score (0-100)
    let riskScore = 0;
    
    // Factor 1: Low sales volume (max 40 points)
    if (product.quantity === 0) riskScore += 40;
    else if (product.quantity < 5) riskScore += 30;
    else if (product.quantity < 10) riskScore += 20;
    else if (product.quantity < 20) riskScore += 10;
    
    // Factor 2: Decreasing trend (max 30 points)
    if (forecast) {
      if (forecast.trend === 'decreasing') {
        riskScore += 30;
      } else if (forecast.trend === 'stable' && forecast.currentAvgDemand < 5) {
        riskScore += 15;
      }
    }
    
    // Factor 3: Low revenue contribution (max 20 points)
    const avgPrice = product.price;
    if (avgPrice < 50000) riskScore += 5;
    if (product.revenue < 100000) riskScore += 15;
    
    // Factor 4: Low forecast confidence (max 10 points)
    if (forecast && forecast.confidence === 'low') {
      riskScore += 10;
    } else if (forecast && forecast.confidence === 'medium') {
      riskScore += 5;
    }
    
    // Determine risk level
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    if (riskScore >= 70) riskLevel = 'CRITICAL';
    else if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 30) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';
    
    // Days to deadstock estimation
    let daysToDeadstock: number | null = null;
    if (forecast && forecast.forecastedDemand > 0) {
      daysToDeadstock = Math.round((product.quantity / forecast.forecastedDemand) * 30);
    }
    
    // Generate recommendation
    let recommendation = '';
    if (riskLevel === 'CRITICAL') {
      recommendation = `URGENT: Lakukan diskon 30-50% atau bundling SEGERA untuk menghabiskan stok dalam 1-2 bulan.`;
    } else if (riskLevel === 'HIGH') {
      recommendation = `Kurangi pemesanan 100%, aktifkan promo 20-30% untuk clearance.`;
    } else if (riskLevel === 'MEDIUM') {
      recommendation = `Monitor ketat, kurangi pemesanan 50-70% periode berikutnya.`;
    } else {
      recommendation = `Risiko rendah, maintain current strategy.`;
    }
    
    risks.push({
      productName: product.name,
      category: product.category,
      size: product.size,
      currentSales: product.quantity,
      forecastedDemand: forecast?.forecastedDemand || 0,
      riskScore,
      riskLevel,
      daysToDeadstock,
      recommendation,
      actionPriority: riskLevel === 'CRITICAL' ? 1 : riskLevel === 'HIGH' ? 3 : riskLevel === 'MEDIUM' ? 5 : 8
    });
  });
  
  return risks.sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * BUSINESS ACTIONS GENERATOR
 * Generate concrete, actionable recommendations
 */
function generateBusinessActions(
  products: FashionProduct[],
  forecasts: ForecastResult[],
  abcAnalysis: ABCClassification[],
  deadstockRisks: EnhancedDeadstockRisk[]
): BusinessAction[] {
  const actions: BusinessAction[] = [];
  let actionId = 1;
  
  // Action 1-3: Critical deadstock clearance
  const criticalDeadstock = deadstockRisks.filter(r => r.riskLevel === 'CRITICAL').slice(0, 3);
  criticalDeadstock.forEach((risk, index) => {
    actions.push({
      priority: actionId++,
      actionType: 'PROMO',
      productName: risk.productName,
      category: risk.category,
      size: risk.size,
      description: `Lakukan PROMO AGRESIF untuk ${risk.productName}`,
      quantitativeTarget: 'Diskon 30-50% atau bundling dengan produk laris',
      expectedImpact: `Kurangi risiko deadstock ${risk.riskScore}% dan bebaskan modal Rp ${(risk.currentSales * 100000).toLocaleString('id-ID')}`,
      timeframe: 'SEGERA (1-2 minggu)',
      reasoning: `Produk ini punya risk score ${risk.riskScore}/100 dan tren menurun. Stok akan menjadi deadstock dalam ${risk.daysToDeadstock || '?'} hari jika tidak ada aksi.`
    });
  });
  
  // Action 4-6: Increase order for high-demand products
  const growingProducts = forecasts
    .filter(f => f.trend === 'increasing' && f.confidence !== 'low')
    .slice(0, 3);
  
  growingProducts.forEach((forecast) => {
    const increase = Math.round((forecast.forecastedDemand - forecast.currentAvgDemand) / forecast.currentAvgDemand * 100);
    actions.push({
      priority: actionId++,
      actionType: 'INCREASE_ORDER',
      productName: forecast.productName,
      description: `TINGKATKAN PEMESANAN untuk ${forecast.productName}`,
      quantitativeTarget: `Tambah ${increase}% dari pemesanan normal (tambah ~${Math.round(forecast.forecastedDemand - forecast.currentAvgDemand)} unit)`,
      expectedImpact: `Hindari stockout dan capture demand yang meningkat ${forecast.trendPercentage}%`,
      timeframe: 'Siklus pemesanan berikutnya (1-2 bulan)',
      reasoning: `Tren penjualan naik ${forecast.trendPercentage}%, forecast menunjukkan demand akan naik dari ${forecast.currentAvgDemand} ke ${forecast.forecastedDemand} unit.`
    });
  });
  
  // Action 7-8: Reduce order for declining products
  const decliningProducts = forecasts
    .filter(f => f.trend === 'decreasing' && f.forecastedDemand < f.currentAvgDemand * 0.7)
    .slice(0, 2);
  
  decliningProducts.forEach((forecast) => {
    const decrease = Math.round((forecast.currentAvgDemand - forecast.forecastedDemand) / forecast.currentAvgDemand * 100);
    actions.push({
      priority: actionId++,
      actionType: 'REDUCE_ORDER',
      productName: forecast.productName,
      description: `KURANGI PEMESANAN untuk ${forecast.productName}`,
      quantitativeTarget: `Kurangi ${decrease}% dari pemesanan normal`,
      expectedImpact: `Hindari overstock dan kurangi risiko deadstock`,
      timeframe: '2-3 siklus pemesanan ke depan',
      reasoning: `Tren menurun ${Math.abs(forecast.trendPercentage)}%, forecast menunjukkan demand turun dari ${forecast.currentAvgDemand} ke ${forecast.forecastedDemand} unit.`
    });
  });
  
  // Action 9: Bundle slow movers with class A products
  const classAProducts = abcAnalysis.filter(a => a.class === 'A').slice(0, 3);
  const highRiskProducts = deadstockRisks.filter(r => r.riskLevel === 'HIGH').slice(0, 2);
  
  if (classAProducts.length > 0 && highRiskProducts.length > 0) {
    actions.push({
      priority: actionId++,
      actionType: 'BUNDLE',
      productName: `Bundle: ${classAProducts[0].productName} + ${highRiskProducts[0].productName}`,
      description: `BUAT BUNDLING produk laris dengan slow mover`,
      quantitativeTarget: `Bundle ${classAProducts[0].productName} (Class A) dengan ${highRiskProducts[0].productName}`,
      expectedImpact: `Percepat perputaran slow mover sambil maintain margin dari produk laris`,
      timeframe: '2-4 minggu',
      reasoning: `${classAProducts[0].productName} kontribusi revenue ${classAProducts[0].revenueContribution}%, bisa membantu move ${highRiskProducts[0].productName} yang berisiko deadstock.`
    });
  }
  
  return actions;
}

/**
 * EXECUTIVE SUMMARY GENERATOR
 * High-level insights untuk decision makers
 */
function generateExecutiveSummary(
  products: FashionProduct[],
  forecasts: ForecastResult[],
  abcAnalysis: ABCClassification[],
  deadstockRisks: EnhancedDeadstockRisk[],
  actions: BusinessAction[]
): ExecutiveSummary {
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  
  // Key insights
  const keyInsights: string[] = [];
  
  const classA = abcAnalysis.filter(a => a.class === 'A');
  keyInsights.push(`${classA.length} produk Class A (${classA.reduce((sum, a) => sum + a.revenueContribution, 0).toFixed(1)}% revenue) - FOKUS UTAMA`);
  
  const growingTrend = forecasts.filter(f => f.trend === 'increasing').length;
  const decliningTrend = forecasts.filter(f => f.trend === 'decreasing').length;
  keyInsights.push(`${growingTrend} produk trending UP, ${decliningTrend} produk trending DOWN`);
  
  const criticalRisk = deadstockRisks.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;
  keyInsights.push(`${criticalRisk} produk berisiko deadstock TINGGI - perlu aksi SEGERA`);
  
  // Opportunities
  const topOpportunities: string[] = [];
  const topGrowing = forecasts.filter(f => f.trend === 'increasing').slice(0, 2);
  topGrowing.forEach(f => {
    topOpportunities.push(`${f.productName}: Demand naik ${f.trendPercentage}% - POTENSIAL untuk scale up`);
  });
  
  // Critical risks
  const criticalRisks: string[] = [];
  const topDeadstock = deadstockRisks.filter(r => r.riskLevel === 'CRITICAL').slice(0, 2);
  topDeadstock.forEach(r => {
    criticalRisks.push(`${r.productName}: Risk score ${r.riskScore}/100 - URGENT clearance needed`);
  });
  
  // Recommended actions (top 3)
  const recommendedActions = actions.slice(0, 3).map(a => 
    `${a.actionType}: ${a.productName} - ${a.quantitativeTarget}`
  );
  
  // Overall health score
  const positiveFactors = growingTrend * 5;
  const negativeFactors = criticalRisk * 10 + decliningTrend * 3;
  const healthScore = Math.max(0, Math.min(100, 70 + positiveFactors - negativeFactors));
  
  let overallHealth: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  if (healthScore >= 80) overallHealth = 'EXCELLENT';
  else if (healthScore >= 60) overallHealth = 'GOOD';
  else if (healthScore >= 40) overallHealth = 'FAIR';
  else overallHealth = 'POOR';
  
  return {
    keyInsights,
    topOpportunities,
    criticalRisks,
    recommendedActions,
    overallHealth,
    healthScore
  };
}

/**
 * DATA QUALITY ASSESSMENT
 */
function assessDataQuality(products: FashionProduct[]): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // Check for missing data
  const missingCategory = products.filter(p => !p.category).length;
  if (missingCategory > products.length * 0.3) {
    issues.push(`${((missingCategory / products.length) * 100).toFixed(1)}% produk tanpa kategori`);
    recommendations.push('Lengkapi data kategori untuk analisis yang lebih akurat');
    score -= 15;
  }
  
  const missingSize = products.filter(p => !p.size).length;
  if (missingSize > products.length * 0.5) {
    issues.push(`${((missingSize / products.length) * 100).toFixed(1)}% produk tanpa size`);
    recommendations.push('Tambahkan informasi size untuk analisis per-ukuran');
    score -= 10;
  }
  
  // Check for data consistency
  const zeroPriceCount = products.filter(p => p.price === 0).length;
  if (zeroPriceCount > 0) {
    issues.push(`${zeroPriceCount} produk dengan harga 0`);
    recommendations.push('Periksa data harga untuk memastikan akurasi perhitungan revenue');
    score -= 20;
  }
  
  // Check sample size
  if (products.length < 10) {
    issues.push('Data terlalu sedikit untuk analisis yang akurat');
    recommendations.push('Tambahkan lebih banyak data historis untuk forecasting yang lebih reliable');
    score -= 25;
  }
  
  return { score: Math.max(0, score), issues, recommendations };
}

// ═══════════════════════════════════════════════════════════════
// MAIN INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * SKIRO INTELLIGENCE ENGINE - Main Entry Point
 * Generate complete intelligence report
 */
export function generateIntelligenceReport(products: FashionProduct[]): SkiroIntelligenceReport {
  // Step 1: Forecasting
  const forecasting = forecastDemand(products);
  
  // Step 2: ABC Analysis
  const abcAnalysis = performABCAnalysis(products);
  
  // Step 3: Deadstock Risk Analysis
  const deadstockRisks = analyzeDeadstockRisks(products, forecasting);
  
  // Step 4: Business Actions
  const businessActions = generateBusinessActions(products, forecasting, abcAnalysis, deadstockRisks);
  
  // Step 5: Executive Summary
  const executiveSummary = generateExecutiveSummary(products, forecasting, abcAnalysis, deadstockRisks, businessActions);
  
  // Step 6: Data Quality
  const dataQuality = assessDataQuality(products);
  
  // Step 7: Detailed Insights
  const detailedInsights = generateDetailedInsights(products, forecasting, abcAnalysis, deadstockRisks);
  
  // Step 8: Assumptions
  const assumptions = [
    'Analisis berdasarkan data historis yang tersedia dalam dataset',
    'Forecasting menggunakan trend analysis dan moving average',
    'Asumsi tidak ada perubahan drastis dalam kondisi pasar',
    'Deadstock risk calculated dengan multiple factors (sales, trend, revenue)',
    'Rekomendasi disesuaikan dengan karakteristik fashion retail'
  ];
  
  return {
    executiveSummary,
    forecasting,
    abcAnalysis,
    deadstockRisks,
    businessActions,
    detailedInsights,
    assumptions,
    dataQuality
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

function generateDetailedInsights(
  products: FashionProduct[],
  forecasts: ForecastResult[],
  abcAnalysis: ABCClassification[],
  deadstockRisks: EnhancedDeadstockRisk[]
): string[] {
  const insights: string[] = [];
  
  // Portfolio composition
  const classA = abcAnalysis.filter(a => a.class === 'A');
  const classB = abcAnalysis.filter(a => a.class === 'B');
  const classC = abcAnalysis.filter(a => a.class === 'C');
  
  insights.push(`KOMPOSISI PORTFOLIO: Class A (${classA.length} produk), Class B (${classB.length} produk), Class C (${classC.length} produk)`);
  
  // Trend summary
  const growing = forecasts.filter(f => f.trend === 'increasing').length;
  const stable = forecasts.filter(f => f.trend === 'stable').length;
  const declining = forecasts.filter(f => f.trend === 'decreasing').length;
  
  insights.push(`TREND ANALYSIS: ${growing} produk growing, ${stable} produk stable, ${declining} produk declining`);
  
  // Risk distribution
  const critical = deadstockRisks.filter(r => r.riskLevel === 'CRITICAL').length;
  const high = deadstockRisks.filter(r => r.riskLevel === 'HIGH').length;
  const medium = deadstockRisks.filter(r => r.riskLevel === 'MEDIUM').length;
  
  insights.push(`RISK DISTRIBUTION: ${critical} CRITICAL, ${high} HIGH, ${medium} MEDIUM risk products`);
  
  // Fast movers
  const fastMovers = abcAnalysis.filter(a => a.velocity === 'fast' && a.class === 'A');
  if (fastMovers.length > 0) {
    insights.push(`FAST MOVERS (Class A): ${fastMovers.slice(0, 3).map(f => f.productName).join(', ')} - PRIORITAS RESTOCKING`);
  }
  
  // Slow movers needing attention
  const slowMovers = abcAnalysis.filter(a => a.velocity === 'slow' && a.class === 'C');
  if (slowMovers.length > 0) {
    insights.push(`SLOW MOVERS (Class C): ${slowMovers.length} produk perlu evaluasi untuk discontinue atau promo`);
  }
  
  return insights;
}
