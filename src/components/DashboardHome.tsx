import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, Package, AlertTriangle, 
  CheckCircle, DollarSign, ShoppingBag, BarChart3,
  Zap, ArrowRight, Clock, Target, Sparkles, MessageSquare, Upload
} from 'lucide-react';
import type { FashionAnalysisResult } from '@/lib/fashionAnalyzer';

interface DashboardHomeProps {
  analysis: FashionAnalysisResult | null;
  onNavigate: (view: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ analysis, onNavigate }) => {
  if (!analysis) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Data Penjualan</h2>
          <p className="text-gray-600 mb-6">
            Upload data penjualan terlebih dahulu untuk melihat analisis lengkap
          </p>
          <Button 
            onClick={() => onNavigate('upload')}
            className="bg-blue-900 hover:bg-blue-950"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Data Sekarang
          </Button>
        </div>
      </div>
    );
  }

  // Kalau udah ada analisis - tampilin dashboard overview
  const { products, totalRevenue, totalUnits, averagePrice, stockRecommendations, deadstockAnalysis, financialHealth, sizeAnalysis } = analysis;

  // Check data availability
  const hasQuantityData = totalUnits > 0;
  const hasSizeData = sizeAnalysis && sizeAnalysis.length > 0;

  // Hitung metrics penting - FLEKSIBEL berdasarkan data yang ada
  const bestSellerCount = hasQuantityData 
    ? products.filter(p => p.quantity > (totalUnits / products.length) * 1.5).length
    : products.filter(p => p.revenue > (totalRevenue / products.length) * 1.5).length; // Fallback ke revenue
    
  const slowMoversCount = hasQuantityData
    ? products.filter(p => p.quantity < (totalUnits / products.length) * 0.5).length
    : products.filter(p => p.revenue < (totalRevenue / products.length) * 0.5).length;

  // Financial health score
  const healthScore = Math.round(financialHealth?.overallHealthScore || 0);
  const healthColor = healthScore >= 70 ? 'green' : healthScore >= 50 ? 'yellow' : 'red';
  const healthLabel = healthScore >= 70 ? 'Sehat' : healthScore >= 50 ? 'Cukup Sehat' : 'Perlu Perhatian';

  // 🔴 SMART DEADSTOCK DETECTION - Ambil produk dengan penjualan terendah
  const sortedByPerformance = [...products].sort((a, b) => {
    if (hasQuantityData) {
      return a.quantity - b.quantity; // Sort by quantity (ascending - lowest first)
    }
    return a.revenue - b.revenue; // Fallback to revenue
  });
  
  // Ambil 10 produk terendah sebagai deadstock candidates
  const deadstockCandidates = sortedByPerformance.slice(0, Math.min(10, Math.floor(products.length * 0.3)));
  const actualDeadstockCount = deadstockCandidates.length;
  
  // Top performers untuk restock
  const topPerformers = [...products].sort((a, b) => {
    if (hasQuantityData) {
      return b.quantity - a.quantity; // Descending - highest first
    }
    return b.revenue - a.revenue;
  }).slice(0, Math.min(10, Math.floor(products.length * 0.3)));
  
  const deadstockCount = actualDeadstockCount;
  const needRestockCount = topPerformers.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Welcome */}
	  <div className="px-1">
	    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900"> </h1>
	    <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
	    </p>
	  </div>

      

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium opacity-90 truncate pr-2">Total Penjualan</CardTitle>
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold break-words leading-tight">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            {hasQuantityData && (
              <p className="text-xs opacity-75 mt-1 truncate">{totalUnits} unit terjual</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium opacity-90 truncate pr-2">Best Sellers</CardTitle>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{bestSellerCount}</div>
            <p className="text-xs opacity-75 mt-1">Produk laku keras</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white overflow-hidden">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium opacity-90 truncate pr-2">Perlu Restock</CardTitle>
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{needRestockCount}</div>
            <p className="text-xs opacity-75 mt-1">Produk perlu ditambah</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${
          healthColor === 'green' ? 'from-emerald-500 to-emerald-700' :
          healthColor === 'yellow' ? 'from-yellow-500 to-yellow-700' :
          'from-red-500 to-red-700'
        } text-white overflow-hidden`}>
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium opacity-90 truncate pr-2">Kesehatan Bisnis</CardTitle>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{healthScore}%</div>
            <p className="text-xs opacity-75 mt-1 truncate">{healthLabel}</p>
          </CardContent>
        </Card>
      </div>

   

      {/* 🔥 NEW: Smart Recommendations Panel - Gabungan Semua Analisis */}
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <span className="leading-tight">Rekomendasi Dari Kami</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
          Berdasarkan analisis data penjualan kamu, ini yang harus toko kamu terapkan untuk dapat maksimalkan profit dan menghindari kerugian!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. DEADSTOCK ALERTS - Produk yang harus dikurangi/diskon */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Kurangi Stok
                </CardTitle>
                <Badge variant="destructive">{actualDeadstockCount}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-red-800 font-medium">
                Produk ini kurang peminat dan berisiko deadstock ! 
              </p>
              
              {deadstockCandidates.slice(0, 5).map((product, idx) => {
                const soldQty = product.quantity || 0;
                
                return (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                        {product.size && (
                          <p className="text-xs text-gray-600">Size: {product.size}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                        High Risk
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-700 space-y-1">
                      {hasQuantityData && (
                        <p>Terjual: <strong>{soldQty} unit</strong></p>
                      )}
                      <p>Revenue: <strong>Rp {product.revenue.toLocaleString('id-ID')}</strong></p>
                      <p className="text-red-700 font-medium mt-2">
                        Saran kami : Diskon 30-50% atau bundling!
                      </p>
                    </div>
                  </div>
                );
              })}
              
                  {actualDeadstockCount > 0 && (
                    <p className="text-[12px] sm:text-sm leading-tight mb-1">🔴 <strong>{actualDeadstockCount} produk</strong> yang berisiko deadstock</p>
                  )}
                  {topPerformers.length > 0 && (
                    <p className="text-[12px] sm:text-sm leading-tight mb-1">🟢 <strong>{topPerformers.length} produk</strong> yang ramai peminat</p>
                  )}
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-2 break-words leading-tight">
                    Scroll ke bawah untuk lihat detail lengkap analisis produk, kategori, dan tren penjualan 👇
                  </p>
                </CardContent>
              </Card>
          {/* 2. RESTOCK ALERTS - Produk yang harus ditambah */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                    Perbanyak Stok
                </CardTitle>
                <Badge className="bg-green-600">{needRestockCount}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-green-800 font-medium">
                Produk Ini Banyak peminat ! Tambah stok agar dapat meningkatkan Omset Perusahaan
              </p>
              
              {topPerformers.slice(0, 5).map((product, idx) => {
                const soldQty = product.quantity || 0;
                  
                return (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                        {product.size && (
                          <p className="text-xs text-gray-600">Size: {product.size}</p>
                        )}
                      </div>
                      <Badge className="text-xs bg-green-600">Hot! 🔥</Badge>
                    </div>
                    
                    <div className="text-xs text-gray-700 space-y-1">
                      {hasQuantityData && (
                        <p>Terjual: <strong>{soldQty} unit</strong></p>
                      )}
                      <p>Revenue: <strong>Rp {product.revenue.toLocaleString('id-ID')}</strong></p>
                      <p className="text-green-700 font-medium mt-2">
                        Saran kami: Tambah stok 50-100%!
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {topPerformers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Stok masih cukup!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary & Action CTA */}
        <Card className="mt-4 border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">Ringkasan Rekomendasi : </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {actualDeadstockCount > 0 && (
                    <p>🔴 <strong>{actualDeadstockCount} produk</strong> yang berisiko deadstock </p>
                  )}
                  {topPerformers.length > 0 && (
                    <p>🟢 <strong>{topPerformers.length} produk</strong> yang ramai peminat </p>
                  )}
                  
                  <p className="text-xs text-gray-600 mt-2">
                    Scroll ke bawah untuk lihat detail lengkap analisis produk, kategori, dan tren penjualan 👇
                  </p>
                </div>
              </div>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => onNavigate('consultant')}
              >
                Konsultasikan dengan AI Kami 
                <MessageSquare className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RANKING 1: PER PRODUK + SIZE (untuk deteksi deadstock per size) */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Peringkat Produk Paling Laku Berdasarkan Size
              </CardTitle>
              <p className="text-sm text-purple-700 mt-1">
               Data ini bisa membantu anda untuk mengatur stock produk dan size apa yang harus lebih di tambah atau di kurangi pada bulan selanjutnya.
              </p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-900">
              {products.length} Varian
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-900 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">Peringkat</th>
                  <th className="px-4 py-3 text-left">Nama Produk</th>
                  {hasSizeData && <th className="px-4 py-3 text-center">Size</th>}
                  {hasQuantityData && <th className="px-4 py-3 text-right">QTY Terjual</th>}
                  <th className="px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => hasQuantityData ? (b.quantity - a.quantity) : (b.revenue - a.revenue))
                  .map((product, idx) => {
                    const totalProducts = products.length;
                    const topThreshold = Math.ceil(totalProducts * 0.2);
                    const bottomThreshold = Math.floor(totalProducts * 0.8);
                    
                    let riskLevel = 'Medium Risk';
                    let riskColor = 'bg-yellow-100 text-yellow-800';
                    
                    if (idx < topThreshold) {
                      riskLevel = '✅ Low Risk';
                      riskColor = 'bg-green-100 text-green-800';
                    } else if (idx >= bottomThreshold) {
                      riskLevel = '🔴 High Risk (Deadstock!)';
                      riskColor = 'bg-red-100 text-red-800';
                    }
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${
                              idx < 3 ? 'text-yellow-600 text-lg' : 'text-gray-600'
                            }`}>
                              #{idx + 1}
                            </span>
                            {idx === 0 && <span className="text-xl">🥇</span>}
                            {idx === 1 && <span className="text-xl">🥈</span>}
                            {idx === 2 && <span className="text-xl">🥉</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{product.name}</p>
                        </td>
                        {hasSizeData && (
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="font-mono">
                              {product.size || '-'}
                            </Badge>
                          </td>
                        )}
                        {hasQuantityData && (
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-gray-900">
                              {product.quantity.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">unit</span>
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-blue-900">
                            Rp {product.revenue.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={riskColor}>
                            {riskLevel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-900">
                <strong>Cara Baca :</strong> Produk dengan Peringkat yang RENDAH berarti size tersebut berisiko deadstock! 
                Contoh : "Kemeja Putih, XL" berada di peringkat akhir yang berarti → size XL pada produk tersebut kurang laku, pertimbangkan kurangi produksi size tersebut dan fokus perbanyak produksi pada Size yang lebih laku
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RANKING 2: KESELURUHAN PER NAMA PRODUK (tanpa size) */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Peringkat Produk Di toko Kamu
              </CardTitle>
              <p className="text-sm text-blue-700 mt-1">
                Data ini Bisa membantu anda untuk memantau produk apa yang paling banyak peminatnya agar dapat meningkatkan pemasukan toko mu, dan bisa menjadi pertimbangan mu untuk menambahkan produk serupa di kemudian hari.
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-900">
              {(() => {
                const uniqueProducts = new Set(products.map(p => p.name));
                return uniqueProducts.size;
              })()} Produk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">Peringkat</th>
                  <th className="px-4 py-3 text-left">Nama Produk</th>
                  <th className="px-4 py-3 text-center">Jumlah Varian Size</th>
                  {hasQuantityData && <th className="px-4 py-3 text-right">Total QTY Terjual</th>}
                  <th className="px-4 py-3 text-right">Total Revenue</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Aggregate products by name only (ignore size)
                  const aggregated = new Map<string, { 
                    name: string; 
                    category?: string; 
                    quantity: number; 
                    revenue: number;
                    sizeCount: number;
                  }>();
                  
                  products.forEach(p => {
                    const key = p.name;
                    if (aggregated.has(key)) {
                      const existing = aggregated.get(key)!;
                      existing.quantity += p.quantity;
                      existing.revenue += p.revenue;
                      existing.sizeCount += 1;
                    } else {
                      aggregated.set(key, {
                        name: p.name,
                        category: p.category,
                        quantity: p.quantity,
                        revenue: p.revenue,
                        sizeCount: 1
                      });
                    }
                  });
                  
                  const aggregatedProducts = Array.from(aggregated.values())
                    .sort((a, b) => hasQuantityData ? (b.quantity - a.quantity) : (b.revenue - a.revenue));
                  
                  return aggregatedProducts.map((product, idx) => {
                    let status = 'Normal';
                    let statusColor = 'bg-blue-100 text-blue-800';
                    
                    const totalProducts = aggregatedProducts.length;
                    const topThreshold = Math.ceil(totalProducts * 0.2);
                    const bottomThreshold = Math.floor(totalProducts * 0.8);
                    
                    if (idx < topThreshold) {
                      status = '🔥 Best Seller';
                      statusColor = 'bg-green-100 text-green-800';
                    } else if (idx >= bottomThreshold) {
                      status = '⚠️ Slow Mover';
                      statusColor = 'bg-red-100 text-red-800';
                    }
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${
                              idx < 3 ? 'text-yellow-600 text-lg' : 'text-gray-600'
                            }`}>
                              #{idx + 1}
                            </span>
                            {idx === 0 && <span className="text-xl">🥇</span>}
                            {idx === 1 && <span className="text-xl">🥈</span>}
                            {idx === 2 && <span className="text-xl">🥉</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            {product.category && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Kategori: {product.category}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline">
                            {product.sizeCount} size
                          </Badge>
                        </td>
                        {hasQuantityData && (
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-gray-900">
                              {product.quantity.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">unit</span>
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-blue-900">
                            Rp {product.revenue.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={statusColor}>
                            {status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900">
                <strong>Catatan:</strong> Peringkat ini bertujuan untuk melihat performa keseluruhan produk. 
                Peringkat diurutkan berdasarkan {hasQuantityData ? 'total quantity terjual' : 'total revenue'} dari semua varian size.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deadstock Analysis - Individual Products Only */}
      {actualDeadstockCount > 0 && (
        <Card className="border-2 border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Analisis Deadstock   
            </CardTitle>
            <p className="text-sm text-orange-700 mt-2">
              Hasil dari analisis ini akan menunjukkan produk dan ukuran yang <strong>penjualannya paling lambat</strong> dan berisiko numpuk jadi deadstock. 
              
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Overall Risk Score */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg border-2 border-red-300">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Total Produk Berisiko Deadstock :</p>
                  <p className="text-4xl font-black text-red-900">
                    {deadstockCandidates.length} Produk
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-semibold">Tingkat Urgensi</p>
                  <p className="text-2xl font-black text-red-900">
                    {Math.round((deadstockCandidates.length / products.length) * 100)}%
                  </p>
                  <p className="text-xs text-red-800 font-medium">dari total keseluruhan produk Anda</p>
                </div>
              </div>
              <Alert className="bg-white border-red-300">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-sm text-red-900">
                  <strong></strong> {deadstockCandidates.length} produk tersebut adalah produk dengan <strong>penjualan terendah</strong> di toko Anda. 
                  Jika tidak segera ditangani, produk ini akan numpuk menjadi deadstock yang merugikan bisnis Anda.
                </AlertDescription>
              </Alert>
            </div>

            {/* DETAILED PRODUCT LIST - Produk individual yang butuh aksi */}
            <div>
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg border-2 border-orange-300 mb-4">
                <h3 className="font-black text-gray-900 mb-2 flex items-center gap-2 text-lg">
                  Daftar Produk Berisiko Deadstock :
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong></strong> Setiap Produk sudah kami beri label tingkat risiko berdasarkan performa penjualannya dibandingkan rata-rata toko Anda. 
                </p>
                <div className="bg-white rounded p-2 text-xs text-gray-800 border border-orange-400">
                  <strong>Cara Membedakan Label : </strong>
                  <span className="ml-2">🔴 BAHAYA = Diskon 40-50%</span> |
                  <span className="ml-2">🟠 HATI-HATI = Diskon 30% + bundling</span> |
                  <span className="ml-2">🟡 PERHATIAN = Monitor 2 minggu, siap promo</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {deadstockCandidates.map((product, idx) => {
                  // Risk calculation
                  const avgSales = totalUnits / products.length;
                  const performanceRatio = product.quantity / avgSales;
                  
                  let riskLevel = 'MEDIUM';
                  let riskColor = 'border-orange-400 bg-orange-50';
                  let riskBadge = 'bg-orange-600';
                  let riskEmoji = '🟠';
                  let riskText = 'HATI-HATI';
                  let actionText = 'Buat promo diskon 30% + bundling dengan produk laris';
                  
                  if (performanceRatio < 0.3) {
                    riskLevel = 'HIGH';
                    riskColor = 'border-red-500 bg-red-50';
                    riskBadge = 'bg-red-700';
                    riskEmoji = '🔴';
                    riskText = 'BAHAYA!';
                    actionText = 'SEGERA diskon 40-50% atau bundling wajib! Stok harus habis dalam 2 minggu';
                  } else if (performanceRatio < 0.5) {
                    riskLevel = 'MEDIUM';
                    actionText = 'Diskon 30% + bundling dengan best seller, atau buat flash sale';
                  } else {
                    riskLevel = 'LOW';
                    riskColor = 'border-yellow-400 bg-yellow-50';
                    riskBadge = 'bg-yellow-600';
                    riskEmoji = '🟡';
                    riskText = 'PERHATIAN';
                    actionText = 'Monitor 2 minggu, jika tidak membaik buat promo 20-30%';
                  }

                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${riskColor} shadow-sm hover:shadow-md transition-shadow`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3 pb-3 border-b-2 border-gray-300">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl font-black text-gray-900">#{idx + 1}</span>
                            <span className="text-2xl">{riskEmoji}</span>
                            <Badge className={`${riskBadge} text-white font-bold`}>
                              {riskText}
                            </Badge>
                          </div>
                          <h4 className="font-black text-gray-900 text-lg">{product.name}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            {product.size && (
                              <span className="font-semibold">
                                Size: <span className="text-gray-900">{product.size}</span>
                              </span>
                            )}
                            {product.category && (
                              <span className="font-semibold">
                                Kategori: <span className="text-gray-900">{product.category}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-white rounded p-2 border border-gray-300">
                          <p className="text-xs text-gray-600 font-semibold">Terjual</p>
                          <p className="text-lg font-black text-gray-900">{product.quantity} unit</p>
                          <p className="text-xs text-red-600">
                            {(performanceRatio * 100).toFixed(0)}% dari rata-rata
                          </p>
                        </div>
                        <div className="bg-white rounded p-2 border border-gray-300">
                          <p className="text-xs text-gray-600 font-semibold">Revenue</p>
                          <p className="text-sm font-bold text-gray-900">Rp {product.revenue.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-gray-300">
                          <p className="text-xs text-gray-600 font-semibold">Harga/Unit</p>
                          <p className="text-sm font-bold text-gray-900">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      
                      {/* Reason */}
                      <div className="bg-white rounded p-2 border-l-4 border-red-500 mb-3">
                        <p className="text-xs font-bold text-red-900"> Kenapa Produk ini Berisiko?</p>
                        <p className="text-xs text-gray-700">
                          Produk ini terjual <strong>{product.quantity} unit</strong>, jauh di bawah rata-rata toko Anda ({avgSales.toFixed(1)} unit). 
                          Performance hanya <strong>{(performanceRatio * 100).toFixed(0)}%</strong> dari produk normal.
                        </p>
                      </div>
                      
                      {/* Action */}
                      <div className={`${riskBadge} text-white rounded-lg p-3`}>
                        <p className="font-bold text-sm mb-1">SARAN YANG HARUS DILAKUKAN:</p>
                        <p className="text-sm">{actionText}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips & Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Ringkasan rekomendasi Terkait Analisis Data Penjualan Kamu !
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {needRestockCount > 0 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Restock {needRestockCount} produk yang laku keras</p>
                  <p className="text-sm text-gray-600">Jangan sampai kehabisan stok untuk produk bestseller - ini kesempatan dapetin untung lebih!</p>
                </div>
              </div>
            )}
            {deadstockCount > 0 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Buat strategi untuk {deadstockCount} produk yang numpuk</p>
                  <p className="text-sm text-gray-600">Pertimbangkan diskon, bundle, atau promo khusus biar barang cepat laku dan gak makan modal.</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Konsultasi sama AI buat strategi detail</p>
                <p className="text-sm text-gray-600">Tanya AI tentang size mana yang laku, produk apa yang cocok dipaket, atau strategi marketing yang pas!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
