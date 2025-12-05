/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌟 SKIRO SUPREME AI - THE ULTIMATE BUSINESS CONSULTANT 🌟
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * MISI: Menjadi AI Konsultan Bisnis Paling Pintar di Dunia dan Alam Semesta
 *        untuk membantu UMKM Fashion Indonesia mencapai kesuksesan maksimal
 * 
 * KEUNGGULAN:
 * ✅ ALL-IN-ONE: Menggabungkan semua analisis (Intelligence V1 + V2 + Deep Analytics)
 * ✅ SUPER COMPREHENSIVE: Analisis 360° dari revenue, product, size, category, trend
 * ✅ ACTIONABLE INSIGHTS: Rekomendasi konkret dengan langkah-langkah eksekusi
 * ✅ PREDICTIVE ANALYSIS: Prediksi trend dan pattern recognition
 * ✅ BUSINESS PSYCHOLOGY: Memahami behavior customer dan market dynamics
 * ✅ FINANCIAL MASTERY: Deep financial health analysis dan ROI calculation
 * ✅ ANTI-BANKRUPTCY SYSTEM: Deteksi dini risiko kebangkrutan
 * 
 * Philosophy: "Seperti memiliki konsultan bisnis berpengalaman 20 tahun + 
 *              data scientist + financial advisor dalam 1 sistem AI"
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { FashionProduct, CategoryAnalysis, SizeAnalysis } from './fashionAnalyzer';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type ProductClassification = 
  | 'SUPERSTAR'          // Top 10% revenue + velocity
  | 'RISING_STAR'        // Fast growing, high potential
  | 'CASH_COW'           // Stable, consistent revenue
  | 'SLEEPING_GIANT'     // Low now but has potential
  | 'SLOW_BURNER'        // Declining but salvageable
  | 'DEAD_WEIGHT'        // Urgent action needed
  | 'EXPERIMENTAL';      // New/test product

export type BusinessPhase = 'GROWTH' | 'MATURE' | 'DECLINE' | 'MIXED';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';

export interface ProductIntelligence {
  product_name: string;
  category?: string;
  size?: string;
  
  // Performance Metrics
  total_qty: number;
  revenue: number;
  avg_price: number;
  market_share: number; // % dari total revenue
  
  // Intelligence Classification
  classification: ProductClassification;
  health_score: number; // 0-100
  velocity_score: number; // 0-100 (kecepatan penjualan)
  profitability_index: number; // ROI estimation
  
  // Risk Assessment
  risk_level: RiskLevel;
  deadstock_probability: number; // 0-100%
  
  // Strategic Insights
  strategic_value: string; // Nilai strategis produk
  customer_appeal: string; // Appeal ke customer
  competitive_edge: string; // Keunggulan kompetitif
  
  // Action Plan
  recommended_action: string;
  action_priority: number; // 1-10
  tactical_steps: string[];
  expected_impact: string;
  timeline: string; // Kapan action harus diambil
}

export interface MarketIntelligence {
  // Overall Market Position
  business_phase: BusinessPhase;
  market_health_score: number; // 0-100
  
  // Revenue Analysis
  revenue_concentration: {
    top_20_percent_products: number; // % revenue dari 20% produk teratas
    pareto_efficiency: number; // Seberapa efficient distribusi revenue
  };
  
  // Product Portfolio Analysis
  portfolio_balance: {
    superstars: number;
    cash_cows: number;
    rising_stars: number;
    dead_weights: number;
  };
  
  // Financial Health
  financial_indicators: {
    revenue_per_product: number;
    revenue_per_sku: number;
    inventory_efficiency: number; // Estimasi
    cash_at_risk: number; // Modal tertahan di slow movers
  };
  
  // Trend Detection
  trends: {
    hot_categories: string[];
    declining_categories: string[];
    hot_sizes: string[];
    declining_sizes: string[];
  };
  
  // Risk Assessment
  overall_risk: RiskLevel;
  risk_factors: string[];
  opportunities: string[];
}

export interface StrategicRecommendation {
  category: 'REVENUE_GROWTH' | 'COST_OPTIMIZATION' | 'INVENTORY_MANAGEMENT' | 
            'MARKET_EXPANSION' | 'PRODUCT_DIVERSIFICATION' | 'RISK_MITIGATION';
  priority: number; // 1-10
  title: string;
  description: string;
  action_steps: string[];
  expected_outcome: string;
  timeline: string;
  estimated_impact: {
    revenue_increase?: string;
    cost_reduction?: string;
    risk_reduction?: string;
  };
  confidence: number; // 0-100%
}

export interface SkiroSupremeAIReport {
  // Executive Summary
  executive_summary: {
    analysis_date: string;
    total_products: number;
    total_revenue: number;
    total_units: number;
    overall_health_score: number; // 0-100
    business_status: string; // "Sangat Sehat", "Perlu Perhatian", dll
    one_sentence_insight: string; // Super concise insight
  };
  
  // Product Intelligence (All products analyzed)
  product_intelligence: ProductIntelligence[];
  
  // Market Intelligence
  market_intelligence: MarketIntelligence;
  
  // Strategic Recommendations (Top priority actions)
  strategic_recommendations: StrategicRecommendation[];
  
  // Category & Size Deep Dive
  category_insights: {
    category: string;
    performance_status: string;
    revenue: number;
    growth_potential: string;
    recommendation: string;
  }[];
  
  size_insights: {
    size: string;
    performance_status: string;
    market_demand: string;
    recommendation: string;
  }[];
  
  // Critical Alerts
  critical_alerts: {
    type: 'DANGER' | 'WARNING' | 'INFO';
    title: string;
    message: string;
    action_required: string;
  }[];
  
  // Financial Forecast
  financial_forecast: {
    current_revenue: number;
    potential_revenue: number; // If recommendations followed
    potential_savings: number;
    roi_improvement: string;
  };
  
  // AI Conclusion (Natural language summary)
  ai_conclusion: {
    overall_assessment: string;
    key_strengths: string[];
    key_weaknesses: string[];
    immediate_actions: string[];
    long_term_strategy: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPREME AI INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Classify product berdasarkan performa dan potensi
 */
function classifyProduct(
  product: FashionProduct,
  totalRevenue: number,
  avgRevenue: number,
  avgQty: number
): ProductClassification {
  const revenueShare = (product.revenue / totalRevenue) * 100;
  const velocityScore = calculateVelocityScore(product, avgQty);
  
  // SUPERSTAR: Top revenue (>5%) + high velocity
  if (revenueShare >= 5 && velocityScore >= 70) {
    return 'SUPERSTAR';
  }
  
  // RISING_STAR: Good growth potential (above avg + good velocity)
  if (product.revenue >= avgRevenue * 1.2 && velocityScore >= 60) {
    return 'RISING_STAR';
  }
  
  // CASH_COW: Stable, consistent (good revenue, medium velocity)
  if (product.revenue >= avgRevenue && velocityScore >= 40) {
    return 'CASH_COW';
  }
  
  // SLEEPING_GIANT: Low now but has price advantage
  if (product.revenue < avgRevenue && product.price >= avgRevenue / avgQty) {
    return 'SLEEPING_GIANT';
  }
  
  // SLOW_BURNER: Declining
  if (product.revenue >= avgRevenue * 0.5 && velocityScore < 40) {
    return 'SLOW_BURNER';
  }
  
  // DEAD_WEIGHT: Very poor performance
  if (product.revenue < avgRevenue * 0.5 && velocityScore < 30) {
    return 'DEAD_WEIGHT';
  }
  
  return 'EXPERIMENTAL';
}

/**
 * Calculate velocity score (kecepatan penjualan relative)
 */
function calculateVelocityScore(product: FashionProduct, avgQty: number): number {
  if (avgQty === 0) return 0;
  const relativeVelocity = (product.quantity / avgQty) * 100;
  return Math.min(100, Math.max(0, relativeVelocity));
}

/**
 * Calculate health score for product
 */
function calculateHealthScore(
  product: FashionProduct,
  classification: ProductClassification,
  velocityScore: number,
  revenueShare: number
): number {
  let baseScore = 50;
  
  switch (classification) {
    case 'SUPERSTAR': baseScore = 95; break;
    case 'RISING_STAR': baseScore = 85; break;
    case 'CASH_COW': baseScore = 75; break;
    case 'SLEEPING_GIANT': baseScore = 60; break;
    case 'SLOW_BURNER': baseScore = 40; break;
    case 'DEAD_WEIGHT': baseScore = 20; break;
    case 'EXPERIMENTAL': baseScore = 50; break;
  }
  
  // Adjust based on velocity and revenue share
  baseScore += (velocityScore * 0.3);
  baseScore += (revenueShare * 2);
  
  return Math.min(100, Math.max(0, baseScore));
}

/**
 * Detect business phase
 */
function detectBusinessPhase(products: FashionProduct[]): BusinessPhase {
  const classifications = products.map(p => {
    const totalRev = products.reduce((s, pr) => s + pr.revenue, 0);
    const avgRev = totalRev / products.length;
    const avgQty = products.reduce((s, pr) => s + pr.quantity, 0) / products.length;
    return classifyProduct(p, totalRev, avgRev, avgQty);
  });
  
  const superstarCount = classifications.filter(c => c === 'SUPERSTAR' || c === 'RISING_STAR').length;
  const deadCount = classifications.filter(c => c === 'DEAD_WEIGHT').length;
  
  const superstarRatio = superstarCount / products.length;
  const deadRatio = deadCount / products.length;
  
  if (superstarRatio >= 0.3) return 'GROWTH';
  if (deadRatio >= 0.4) return 'DECLINE';
  if (superstarRatio >= 0.15 && deadRatio <= 0.2) return 'MATURE';
  return 'MIXED';
}

/**
 * 🌟 MAIN FUNCTION: Generate Supreme AI Report
 */
export function generateSupremeAIReport(
  products: FashionProduct[],
  categoryAnalysis: CategoryAnalysis[],
  sizeAnalysis: SizeAnalysis[]
): SkiroSupremeAIReport {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  🌟 SKIRO SUPREME AI - THE ULTIMATE BUSINESS CONSULTANT ACTIVATED 🌟         ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  // Calculate base metrics
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const avgRevenue = totalRevenue / products.length;
  const avgQty = totalUnits / products.length;
  
  // ============================================================================
  // 1. PRODUCT INTELLIGENCE ANALYSIS
  // ============================================================================
  console.log('🔍 Analyzing Product Intelligence...');
  
  const productIntelligence: ProductIntelligence[] = products.map(product => {
    const revenueShare = (product.revenue / totalRevenue) * 100;
    const classification = classifyProduct(product, totalRevenue, avgRevenue, avgQty);
    const velocityScore = calculateVelocityScore(product, avgQty);
    const healthScore = calculateHealthScore(product, classification, velocityScore, revenueShare);
    
    // Assess risk
    let riskLevel: RiskLevel = 'LOW';
    let deadstockProb = 0;
    
    if (classification === 'DEAD_WEIGHT') {
      riskLevel = 'CRITICAL';
      deadstockProb = 85;
    } else if (classification === 'SLOW_BURNER') {
      riskLevel = 'HIGH';
      deadstockProb = 60;
    } else if (classification === 'SLEEPING_GIANT') {
      riskLevel = 'MEDIUM';
      deadstockProb = 40;
    } else {
      riskLevel = healthScore > 70 ? 'LOW' : 'MEDIUM';
      deadstockProb = Math.max(0, 50 - healthScore / 2);
    }
    
    // Strategic insights
    const strategicValue = getStrategicValue(classification, product);
    const customerAppeal = getCustomerAppeal(classification, velocityScore);
    const competitiveEdge = getCompetitiveEdge(classification, product, avgRevenue);
    
    // Action plan
    const { action, priority, steps, impact, timeline } = getActionPlan(
      classification, 
      healthScore, 
      product, 
      avgRevenue
    );
    
    return {
      product_name: product.name,
      category: product.category,
      size: product.size,
      total_qty: product.quantity,
      revenue: product.revenue,
      avg_price: product.price,
      market_share: revenueShare,
      classification,
      health_score: Math.round(healthScore),
      velocity_score: Math.round(velocityScore),
      profitability_index: calculateProfitabilityIndex(product, avgRevenue),
      risk_level: riskLevel,
      deadstock_probability: Math.round(deadstockProb),
      strategic_value: strategicValue,
      customer_appeal: customerAppeal,
      competitive_edge: competitiveEdge,
      recommended_action: action,
      action_priority: priority,
      tactical_steps: steps,
      expected_impact: impact,
      timeline: timeline
    };
  });
  
  // Sort by priority
  productIntelligence.sort((a, b) => b.action_priority - a.action_priority);
  
  console.log(`✅ Analyzed ${productIntelligence.length} products`);
  
  // ============================================================================
  // 2. MARKET INTELLIGENCE ANALYSIS
  // ============================================================================
  console.log('📊 Generating Market Intelligence...');
  
  const businessPhase = detectBusinessPhase(products);
  
  // Portfolio balance
  const portfolioBalance = {
    superstars: productIntelligence.filter(p => p.classification === 'SUPERSTAR').length,
    cash_cows: productIntelligence.filter(p => p.classification === 'CASH_COW').length,
    rising_stars: productIntelligence.filter(p => p.classification === 'RISING_STAR').length,
    dead_weights: productIntelligence.filter(p => p.classification === 'DEAD_WEIGHT').length
  };
  
  // Revenue concentration (Pareto analysis)
  const sortedByRevenue = [...products].sort((a, b) => b.revenue - a.revenue);
  const top20Percent = Math.ceil(products.length * 0.2);
  const top20Revenue = sortedByRevenue.slice(0, top20Percent).reduce((s, p) => s + p.revenue, 0);
  const revenueConcentration = (top20Revenue / totalRevenue) * 100;
  
  // Financial indicators
  const cashAtRisk = productIntelligence
    .filter(p => p.risk_level === 'HIGH' || p.risk_level === 'CRITICAL')
    .reduce((sum, p) => sum + p.revenue, 0);
  
  // Trend detection
  const hotCategories = categoryAnalysis
    .slice(0, 3)
    .map(c => c.category);
  
  const decliningCategories = categoryAnalysis
    .slice(-2)
    .filter(c => c.percentage < 10)
    .map(c => c.category);
  
  const hotSizes = sizeAnalysis
    .filter(s => s.status === 'hot')
    .map(s => s.size);
  
  const decliningSizes = sizeAnalysis
    .filter(s => s.status === 'slow')
    .map(s => s.size);
  
  // Overall market health
  const avgHealthScore = productIntelligence.reduce((s, p) => s + p.health_score, 0) / productIntelligence.length;
  const criticalProductsRatio = portfolioBalance.dead_weights / products.length;
  const marketHealthScore = Math.round(avgHealthScore * (1 - criticalProductsRatio * 0.5));
  
  // Risk assessment
  const riskFactors: string[] = [];
  const opportunities: string[] = [];
  
  if (criticalProductsRatio > 0.3) {
    riskFactors.push(`${Math.round(criticalProductsRatio * 100)}% produk berperforma sangat buruk - URGENT ACTION NEEDED`);
  }
  if (revenueConcentration > 70) {
    riskFactors.push(`${Math.round(revenueConcentration)}% revenue hanya dari 20% produk - risiko konsentrasi tinggi`);
  }
  if (cashAtRisk / totalRevenue > 0.3) {
    riskFactors.push(`Rp ${cashAtRisk.toLocaleString('id-ID')} modal tertahan di produk berisiko tinggi`);
  }
  
  if (portfolioBalance.superstars >= 3) {
    opportunities.push(`Anda punya ${portfolioBalance.superstars} produk SUPERSTAR - leverage untuk growth!`);
  }
  if (hotCategories.length > 0) {
    opportunities.push(`Kategori ${hotCategories.join(', ')} sedang HOT - fokus marketing di sini`);
  }
  
  const overallRisk: RiskLevel = 
    criticalProductsRatio > 0.4 ? 'CRITICAL' :
    criticalProductsRatio > 0.25 ? 'HIGH' :
    criticalProductsRatio > 0.15 ? 'MEDIUM' : 'LOW';
  
  const marketIntelligence: MarketIntelligence = {
    business_phase: businessPhase,
    market_health_score: marketHealthScore,
    revenue_concentration: {
      top_20_percent_products: Math.round(revenueConcentration),
      pareto_efficiency: revenueConcentration > 80 ? 0.6 : revenueConcentration > 60 ? 0.7 : 0.8
    },
    portfolio_balance: portfolioBalance,
    financial_indicators: {
      revenue_per_product: Math.round(avgRevenue),
      revenue_per_sku: Math.round(totalRevenue / products.length),
      inventory_efficiency: Math.round(avgHealthScore),
      cash_at_risk: Math.round(cashAtRisk)
    },
    trends: {
      hot_categories: hotCategories,
      declining_categories: decliningCategories,
      hot_sizes: hotSizes,
      declining_sizes: decliningSizes
    },
    overall_risk: overallRisk,
    risk_factors: riskFactors,
    opportunities: opportunities
  };
  
  console.log(`✅ Market Health Score: ${marketHealthScore}/100`);
  
  // ============================================================================
  // 3. STRATEGIC RECOMMENDATIONS
  // ============================================================================
  console.log('💡 Generating Strategic Recommendations...');
  
  const strategicRecommendations: StrategicRecommendation[] = [];
  
  // Revenue Growth Recommendations
  if (portfolioBalance.superstars > 0) {
    const superstars = productIntelligence.filter(p => p.classification === 'SUPERSTAR');
    strategicRecommendations.push({
      category: 'REVENUE_GROWTH',
      priority: 10,
      title: 'Maksimalkan Produk SUPERSTAR',
      description: `Anda punya ${superstars.length} produk superstar yang menghasilkan revenue besar. Fokus untuk scale up produk-produk ini.`,
      action_steps: [
        `Tingkatkan stok ${superstars.slice(0, 3).map(s => s.product_name).join(', ')} sebesar 30-50%`,
        'Buat campaign marketing fokus ke produk-produk ini',
        'Pastikan stok selalu tersedia (zero stockout)',
        'Pertimbangkan bundle promo untuk cross-sell'
      ],
      expected_outcome: 'Revenue increase 25-40% dari produk superstar',
      timeline: 'Implementasi dalam 1-2 minggu',
      estimated_impact: {
        revenue_increase: '25-40%',
      },
      confidence: 95
    });
  }
  
  // Cost Optimization
  if (portfolioBalance.dead_weights > 0) {
    const deadWeights = productIntelligence.filter(p => p.classification === 'DEAD_WEIGHT');
    strategicRecommendations.push({
      category: 'COST_OPTIMIZATION',
      priority: 9,
      title: 'Eliminasi Dead Weight Products',
      description: `${deadWeights.length} produk berperforma sangat buruk dan mengikat modal. URGENT: Cut losses!`,
      action_steps: [
        'Flash sale / diskon 40-60% untuk produk: ' + deadWeights.slice(0, 3).map(d => d.product_name).join(', '),
        'Stop produksi/pembelian produk ini SEKARANG',
        'Bundle dengan best seller untuk clearance',
        'Alokasikan modal ke produk profitable'
      ],
      expected_outcome: 'Bebaskan modal tertahan, fokus ke winner products',
      timeline: 'URGENT - Action dalam 1 minggu',
      estimated_impact: {
        cost_reduction: `Rp ${Math.round(cashAtRisk * 0.7).toLocaleString('id-ID')}`,
        risk_reduction: '60-80%'
      },
      confidence: 90
    });
  }
  
  // Inventory Management
  if (hotSizes.length > 0) {
    strategicRecommendations.push({
      category: 'INVENTORY_MANAGEMENT',
      priority: 8,
      title: 'Optimasi Stok Berdasarkan Size',
      description: `Size ${hotSizes.join(', ')} paling laris. Pastikan stok size ini selalu cukup.`,
      action_steps: [
        `Prioritaskan produksi untuk size ${hotSizes.join(', ')}`,
        `Kurangi produksi size ${decliningSizes.join(', ')} atau stop sementara`,
        'Analisa ulang size range produk',
        'Adjust forecast berdasarkan size demand'
      ],
      expected_outcome: 'Inventory turnover meningkat, less deadstock',
      timeline: '2-3 minggu untuk adjust',
      estimated_impact: {
        cost_reduction: '15-25% inventory cost',
      },
      confidence: 85
    });
  }
  
  // Market Expansion
  if (hotCategories.length > 0 && marketHealthScore > 60) {
    strategicRecommendations.push({
      category: 'MARKET_EXPANSION',
      priority: 7,
      title: 'Ekspansi Kategori Hot',
      description: `Kategori ${hotCategories[0]} sedang sangat laku. Opportunity untuk expand product line.`,
      action_steps: [
        `Riset produk baru dalam kategori ${hotCategories[0]}`,
        'Survey customer untuk variant/model yang diinginkan',
        'Test market dengan small batch (10-20 unit)',
        'Scale up jika response positif'
      ],
      expected_outcome: 'New revenue stream dari kategori proven',
      timeline: '1-2 bulan untuk product development',
      estimated_impact: {
        revenue_increase: '15-30% dari kategori baru',
      },
      confidence: 75
    });
  }
  
  // Risk Mitigation
  if (overallRisk === 'HIGH' || overallRisk === 'CRITICAL') {
    strategicRecommendations.push({
      category: 'RISK_MITIGATION',
      priority: 10,
      title: '⚠️ URGENT: Mitigasi Risiko Bisnis',
      description: `Bisnis dalam kondisi ${overallRisk === 'CRITICAL' ? 'KRITIS' : 'BERISIKO TINGGI'}. Perlu action segera!`,
      action_steps: [
        'Review SEMUA produk low-performance - cut atau pivot',
        'Fokus 100% ke proven winners',
        'Kurangi variety, tingkatkan volume per SKU',
        'Cash flow adalah prioritas #1'
      ],
      expected_outcome: 'Stabilisasi bisnis, reduce risk exposure',
      timeline: 'IMMEDIATE ACTION REQUIRED',
      estimated_impact: {
        risk_reduction: '70-90%',
      },
      confidence: 95
    });
  }
  
  // Sort by priority
  strategicRecommendations.sort((a, b) => b.priority - a.priority);
  
  console.log(`✅ Generated ${strategicRecommendations.length} strategic recommendations`);
  
  // ============================================================================
  // 4. CATEGORY & SIZE INSIGHTS
  // ============================================================================
  
  const categoryInsights = categoryAnalysis.map(cat => ({
    category: cat.category,
    performance_status: cat.percentage >= 20 ? '🔥 HOT' : cat.percentage >= 10 ? '✅ Good' : '⚠️ Slow',
    revenue: cat.revenue,
    growth_potential: cat.percentage >= 20 ? 'HIGH - Scale up!' : cat.percentage >= 10 ? 'MEDIUM - Maintain' : 'LOW - Review',
    recommendation: cat.percentage >= 20 
      ? `Fokus marketing & tingkatkan stok kategori ini` 
      : cat.percentage < 10 
        ? `Pertimbangkan discontinue atau bundling` 
        : `Maintain current strategy`
  }));
  
  const sizeInsights = sizeAnalysis.map(size => ({
    size: size.size,
    performance_status: size.status === 'hot' ? '🔥 High Demand' : size.status === 'normal' ? '✅ Normal' : '❄️ Low Demand',
    market_demand: size.status === 'hot' ? 'VERY HIGH' : size.status === 'normal' ? 'MODERATE' : 'LOW',
    recommendation: size.status === 'hot'
      ? `Prioritas utama - jangan sampai stockout!`
      : size.status === 'slow'
        ? `Kurangi atau stop produksi size ini`
        : `Maintain current stock level`
  }));
  
  // ============================================================================
  // 5. CRITICAL ALERTS
  // ============================================================================
  
  const criticalAlerts: SkiroSupremeAIReport['critical_alerts'] = [];
  
  // Check for critical products
  const criticalProducts = productIntelligence.filter(p => p.risk_level === 'CRITICAL');
  if (criticalProducts.length > 0) {
    criticalAlerts.push({
      type: 'DANGER',
      title: '🚨 PRODUK KRITIS TERDETEKSI',
      message: `${criticalProducts.length} produk dalam kondisi KRITIS dengan deadstock probability >80%`,
      action_required: `URGENT: Flash sale atau bundling untuk ${criticalProducts.slice(0, 3).map(p => p.product_name).join(', ')}`
    });
  }
  
  // Check revenue concentration
  if (revenueConcentration > 75) {
    criticalAlerts.push({
      type: 'WARNING',
      title: '⚠️ Konsentrasi Revenue Tinggi',
      message: `${Math.round(revenueConcentration)}% revenue hanya dari 20% produk - risiko diversifikasi rendah`,
      action_required: 'Diversifikasi portfolio, develop produk baru untuk reduce risk'
    });
  }
  
  // Check portfolio balance
  if (portfolioBalance.superstars === 0) {
    criticalAlerts.push({
      type: 'WARNING',
      title: '⚠️ Tidak Ada Produk Superstar',
      message: 'Belum ada produk yang jadi "bintang" bisnis Anda',
      action_required: 'Fokus develop 2-3 produk unggulan, berikan marketing support maksimal'
    });
  }
  
  // Positive alerts
  if (marketHealthScore >= 75) {
    criticalAlerts.push({
      type: 'INFO',
      title: '✅ Bisnis Dalam Kondisi Sehat',
      message: `Market Health Score: ${marketHealthScore}/100 - Performa bagus!`,
      action_required: 'Maintain momentum, pertimbangkan scale up atau ekspansi'
    });
  }
  
  // ============================================================================
  // 6. FINANCIAL FORECAST
  // ============================================================================
  
  // Calculate potential if recommendations followed
  const potentialFromSuperstars = portfolioBalance.superstars * avgRevenue * 0.35; // 35% increase
  const savingsFromDeadweights = cashAtRisk * 0.7; // 70% recovered
  const potentialRevenue = totalRevenue + potentialFromSuperstars;
  
  const financialForecast = {
    current_revenue: totalRevenue,
    potential_revenue: Math.round(potentialRevenue),
    potential_savings: Math.round(savingsFromDeadweights),
    roi_improvement: `${Math.round((potentialRevenue / totalRevenue - 1) * 100)}%`
  };
  
  // ============================================================================
  // 7. AI CONCLUSION
  // ============================================================================
  
  const keyStrengths: string[] = [];
  const keyWeaknesses: string[] = [];
  const immediateActions: string[] = [];
  
  // Identify strengths
  if (portfolioBalance.superstars >= 3) {
    keyStrengths.push(`Portfolio kuat dengan ${portfolioBalance.superstars} produk superstar`);
  }
  if (marketHealthScore >= 70) {
    keyStrengths.push(`Kesehatan bisnis bagus (score: ${marketHealthScore}/100)`);
  }
  if (hotCategories.length > 0) {
    keyStrengths.push(`Kategori ${hotCategories[0]} sedang trending dan profitable`);
  }
  
  // Identify weaknesses
  if (portfolioBalance.dead_weights > 3) {
    keyWeaknesses.push(`Terlalu banyak produk dead weight (${portfolioBalance.dead_weights} produk)`);
  }
  if (revenueConcentration > 75) {
    keyWeaknesses.push(`Revenue terlalu bergantung pada sedikit produk (${Math.round(revenueConcentration)}%)`);
  }
  if (overallRisk === 'HIGH' || overallRisk === 'CRITICAL') {
    keyWeaknesses.push(`Level risiko bisnis: ${overallRisk}`);
  }
  
  // Immediate actions (top 3 priorities)
  strategicRecommendations.slice(0, 3).forEach(rec => {
    immediateActions.push(`${rec.title}: ${rec.action_steps[0]}`);
  });
  
  // Overall assessment
  let overallAssessment = '';
  if (marketHealthScore >= 80) {
    overallAssessment = `Selamat! Bisnis Anda dalam kondisi SANGAT SEHAT dengan score ${marketHealthScore}/100. Anda punya ${portfolioBalance.superstars} produk superstar yang menghasilkan revenue konsisten. Ini adalah waktu yang tepat untuk SCALE UP dan ekspansi. Fokus pada produk-produk winner, tingkatkan marketing, dan pertimbangkan untuk menambah product line di kategori yang sudah proven successful.`;
  } else if (marketHealthScore >= 60) {
    overallAssessment = `Bisnis Anda dalam kondisi CUKUP BAIK (score: ${marketHealthScore}/100), tapi masih ada room for improvement yang signifikan. ${portfolioBalance.dead_weights > 0 ? `Perhatian khusus pada ${portfolioBalance.dead_weights} produk yang underperform - ini mengikat modal dan menurunkan efficiency.` : ''} Fokus pada optimasi portfolio: cut yang tidak perform, double down pada winners. Dengan strategi yang tepat, Anda bisa increase revenue 30-50% dalam 3-6 bulan.`;
  } else if (marketHealthScore >= 40) {
    overallAssessment = `⚠️ PERINGATAN: Bisnis dalam kondisi PERLU PERHATIAN SERIUS (score: ${marketHealthScore}/100). ${portfolioBalance.dead_weights} dari ${products.length} produk berperforma buruk. Ini adalah red flag yang harus segera ditangani. URGENT ACTION NEEDED: 1) Cut losses pada produk dead weight, 2) Fokus 100% pada proven winners, 3) Optimalkan cash flow. Jangan biarkan situasi ini berlanjut - ambil keputusan tegas SEKARANG.`;
  } else {
    overallAssessment = `🚨 CRITICAL ALERT: Bisnis dalam kondisi KRITIS (score: ${marketHealthScore}/100). Mayoritas produk underperform dan mengikat modal. Ini adalah situasi pre-bankruptcy yang SANGAT BERBAHAYA. IMMEDIATE DRASTIC ACTION REQUIRED: 1) STOP semua produk yang tidak profitable, 2) Flash sale untuk liquidate dead stock, 3) Fokus HANYA pada 3-5 produk terbaik, 4) Restructure bisnis model. Anda butuh business turnaround strategy yang aggressive. Konsultasi dengan business advisor atau mentor segera.`;
  }
  
  const longTermStrategy = businessPhase === 'GROWTH'
    ? 'Anda dalam fase GROWTH - leverage momentum ini dengan ekspansi terukur, strengthen brand, dan build customer loyalty program.'
    : businessPhase === 'MATURE'
      ? 'Bisnis dalam fase MATURE - fokus pada efficiency, customer retention, dan innovation untuk mencegah decline.'
      : businessPhase === 'DECLINE'
        ? 'Bisnis menunjukkan tanda DECLINE - perlu pivot strategy, product refresh, atau market repositioning.'
        : 'Portfolio mixed - stabilkan core business dulu sebelum ekspansi.';
  
  const aiConclusion = {
    overall_assessment: overallAssessment,
    key_strengths: keyStrengths,
    key_weaknesses: keyWeaknesses,
    immediate_actions: immediateActions,
    long_term_strategy: longTermStrategy
  };
  
  // ============================================================================
  // COMPILE FINAL REPORT
  // ============================================================================
  
  const businessStatus = 
    marketHealthScore >= 80 ? 'Sangat Sehat 💚' :
    marketHealthScore >= 60 ? 'Sehat dengan Potensi Improvement 💛' :
    marketHealthScore >= 40 ? 'Perlu Perhatian Serius 🧡' :
    'KONDISI KRITIS ⚠️';
  
  const oneSentenceInsight = 
    marketHealthScore >= 70
      ? `Bisnis sehat dengan ${portfolioBalance.superstars} superstar products - saatnya scale up!`
      : `${portfolioBalance.dead_weights} produk underperform mengikat Rp ${cashAtRisk.toLocaleString('id-ID')} - urgent action needed!`;
  
  const report: SkiroSupremeAIReport = {
    executive_summary: {
      analysis_date: new Date().toLocaleDateString('id-ID'),
      total_products: products.length,
      total_revenue: totalRevenue,
      total_units: totalUnits,
      overall_health_score: marketHealthScore,
      business_status: businessStatus,
      one_sentence_insight: oneSentenceInsight
    },
    product_intelligence: productIntelligence,
    market_intelligence: marketIntelligence,
    strategic_recommendations: strategicRecommendations,
    category_insights: categoryInsights,
    size_insights: sizeInsights,
    critical_alerts: criticalAlerts,
    financial_forecast: financialForecast,
    ai_conclusion: aiConclusion
  };
  
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ SKIRO SUPREME AI ANALYSIS COMPLETE                                        ║');
  console.log(`║  📊 Health Score: ${marketHealthScore}/100 | Status: ${businessStatus.padEnd(35)} ║`);
  console.log(`║  💡 Generated ${strategicRecommendations.length} strategic recommendations                                  ║`);
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  return report;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getStrategicValue(classification: ProductClassification, product: FashionProduct): string {
  switch (classification) {
    case 'SUPERSTAR':
      return 'CRITICAL - Revenue driver utama, jangan sampai stockout';
    case 'RISING_STAR':
      return 'HIGH - Potensi besar untuk jadi next superstar';
    case 'CASH_COW':
      return 'STABLE - Reliable revenue source, maintain consistency';
    case 'SLEEPING_GIANT':
      return 'POTENTIAL - Butuh marketing push untuk activate';
    case 'SLOW_BURNER':
      return 'REVIEW NEEDED - Declining, perlu action atau cut';
    case 'DEAD_WEIGHT':
      return 'ELIMINATE - Mengikat modal, segera liquidate';
    default:
      return 'EXPERIMENTAL - Monitor performance';
  }
}

function getCustomerAppeal(classification: ProductClassification, velocity: number): string {
  if (velocity >= 70) return 'VERY HIGH - Customer love this!';
  if (velocity >= 50) return 'GOOD - Decent customer interest';
  if (velocity >= 30) return 'MODERATE - Some interest';
  return 'LOW - Limited customer appeal';
}

function getCompetitiveEdge(classification: ProductClassification, product: FashionProduct, avgRev: number): string {
  if (product.revenue > avgRev * 2) return 'STRONG - Clear market leader';
  if (product.revenue > avgRev) return 'GOOD - Above average performance';
  if (product.revenue > avgRev * 0.5) return 'MODERATE - Competitive but not differentiated';
  return 'WEAK - No clear advantage';
}

function getActionPlan(
  classification: ProductClassification,
  healthScore: number,
  product: FashionProduct,
  avgRevenue: number
): { action: string; priority: number; steps: string[]; impact: string; timeline: string } {
  switch (classification) {
    case 'SUPERSTAR':
      return {
        action: 'SCALE UP - Maksimalkan produk ini!',
        priority: 10,
        steps: [
          `Tingkatkan stok 40-50% untuk ${product.name}`,
          'Prioritas #1 untuk marketing campaign',
          'Ensure zero stockout - always available',
          'Pertimbangkan premium pricing atau bundle'
        ],
        impact: 'Revenue boost 30-50% dari produk ini',
        timeline: '1-2 minggu'
      };
      
    case 'RISING_STAR':
      return {
        action: 'INVEST & NURTURE - Develop jadi superstar',
        priority: 8,
        steps: [
          'Marketing push untuk increase awareness',
          'Tingkatkan visibility (foto produk, description)',
          'Test different price points',
          'Monitor closely - bisa jadi next big thing'
        ],
        impact: 'Potential 50-100% growth',
        timeline: '2-4 minggu'
      };
      
    case 'CASH_COW':
      return {
        action: 'MAINTAIN - Reliable performer',
        priority: 6,
        steps: [
          'Keep current stock level',
          'Maintain consistent quality',
          'Occasional promotion to boost',
          'Monitor for any decline signs'
        ],
        impact: 'Stable revenue stream',
        timeline: 'Ongoing'
      };
      
    case 'SLEEPING_GIANT':
      return {
        action: 'ACTIVATE - Needs marketing support',
        priority: 7,
        steps: [
          'Review positioning - apakah messaging sudah tepat?',
          'Test dengan promo atau discount terbatas',
          'Improve product presentation',
          'Get customer feedback'
        ],
        impact: 'Potential revenue unlock 2-3x',
        timeline: '3-4 minggu'
      };
      
    case 'SLOW_BURNER':
      return {
        action: 'REVIEW OR REDUCE - Declining trend',
        priority: 5,
        steps: [
          'Analyze why declining - pricing? quality? trend?',
          'Test dengan discount 20-30%',
          'If no improvement - reduce atau stop',
          'Allocate resource ke better performers'
        ],
        impact: 'Prevent further losses',
        timeline: '2 minggu untuk decide'
      };
      
    case 'DEAD_WEIGHT':
      return {
        action: 'URGENT: LIQUIDATE - Cut losses NOW',
        priority: 9,
        steps: [
          `STOP produksi ${product.name} SEKARANG`,
          'Flash sale 50-70% off untuk clearance',
          'Bundle dengan best seller',
          'Free up capital untuk invest di winners'
        ],
        impact: 'Free up cash, reduce risk',
        timeline: 'URGENT - 1 minggu'
      };
      
    default:
      return {
        action: 'MONITOR - Experimental phase',
        priority: 4,
        steps: [
          'Collect more data',
          'Small batch only',
          'Test market response',
          'Decide based on performance'
        ],
        impact: 'Learn & iterate',
        timeline: '4-6 minggu'
      };
  }
}

function calculateProfitabilityIndex(product: FashionProduct, avgRevenue: number): number {
  // Simple ROI estimation based on revenue vs average
  const relativePerformance = product.revenue / avgRevenue;
  return Math.round(Math.min(100, relativePerformance * 50));
}
