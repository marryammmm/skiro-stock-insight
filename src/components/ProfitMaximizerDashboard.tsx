import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Zap, 
  AlertTriangle, CheckCircle, ArrowRight, Lightbulb,
  PieChart, BarChart3, LineChart, ShoppingCart, Package,
  Percent, Calculator, Sparkles, Brain, ChevronRight, Crown,
  XCircle
} from 'lucide-react';
import type { FashionAnalysisResult } from '@/lib/fashionAnalyzer';

interface ProfitMaximizerProps {
  analysis: FashionAnalysisResult;
}

const ProfitMaximizerDashboard: React.FC<ProfitMaximizerProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'pricing'>('overview');
  
  const { products, totalRevenue, totalUnits, averagePrice, financialHealth } = analysis;

  // 🧠 HITUNG DARI DATA ASLI FILE - TANPA ASUMSI MODAL
  const calculateProfitMetrics = () => {
    // HANYA pakai data yang ada: revenue, price, quantity
    // TIDAK ada perhitungan modal/COGS karena tidak ada di file
    
    const productProfitability = products.map(p => {
      const revenue = p.revenue || 0;
      const revenuePerUnit = p.quantity > 0 ? revenue / p.quantity : 0;
      
      return {
        ...p,
        revenuePerUnit,
        contributionToRevenue: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
      };
    });

    // Cari produk dengan penjualan terbesar (aturan 80/20)
    const sortedByRevenue = [...productProfitability].sort((a, b) => b.revenue - a.revenue);
    let cumulativeRevenue = 0;
    const top20PercentProducts = sortedByRevenue.filter((p) => {
      cumulativeRevenue += p.revenue;
      return cumulativeRevenue <= totalRevenue * 0.8; // Produk yang bikin 80% penjualan
    });

    // Produk dengan penjualan rendah
    const avgRevenue = products.length > 0 ? totalRevenue / products.length : 0;
    const lowRevenueProducts = productProfitability.filter(p => p.revenue < avgRevenue * 0.5);

    // Analisa berdasarkan volume penjualan - DATA ASLI
    const avgQuantity = products.length > 0 ? totalUnits / products.length : 0;
    
    // Produk laris (quantity tinggi)
    const highVolumeProducts = productProfitability.filter(p => 
      p.quantity > avgQuantity * 1.2
    );

    // Produk lambat laku (quantity rendah)
    const lowVolumeProducts = productProfitability.filter(p => 
      p.quantity < avgQuantity * 0.8
    );

    return {
      totalRevenue,
      productProfitability: sortedByRevenue,
      top20PercentProducts,
      lowRevenueProducts,
      highVolumeProducts,
      lowVolumeProducts,
      avgRevenue,
      avgQuantity
    };
  };

  const profitMetrics = calculateProfitMetrics();

  // 💰 SARAN BERDASARKAN DATA PENJUALAN ASLI - BUKAN ASUMSI
  const generatePricingStrategies = () => {
    const strategies = [];

    // Saran 1: Fokus ke produk dengan revenue tinggi
    if (profitMetrics.top20PercentProducts.length > 0) {
      const topProduct = profitMetrics.top20PercentProducts[0];
      
      strategies.push({
        type: 'FOCUS_BESTSELLER',
        priority: 'HIGH',
        title: `Produk unggulan toko kamu :  ${topProduct.name}`,
        description: `Produk ini pemasukan terbesar toko mu dengan ${topProduct.quantity} terjual dan Rp ${topProduct.revenue.toLocaleString('id-ID')} penjualan!`,
        currentRevenue: topProduct.revenue,
        action: `Pastikan stok produk selalu ada `,
        risk: 'LOW',
        impact: 'HIGH'
      });
    }

    // Saran 2: Tingkatkan penjualan produk laris
    if (profitMetrics.highVolumeProducts.length > 0) {
      const fastProduct = profitMetrics.highVolumeProducts[0];
      
      strategies.push({
        type: 'INCREASE_MARKETING',
        priority: 'MEDIUM',
        title: `Tingkatkan Marketing pada produk : ${fastProduct.name}`,
        description: `Produk ini sudah laku ${fastProduct.quantity} unit. Dengan promosi lebih, produk bisa laku lebih banyak!`,
        currentQuantity: fastProduct.quantity,
        currentRevenue: fastProduct.revenue,
        action: `Gencarkan iklan, buat promo bundling, atau diskon untuk pembelian banyak`,
        risk: 'LOW',
        impact: 'MEDIUM'
      });
    }

    // Saran 3: Obral produk yang tidak laku
    if (profitMetrics.lowVolumeProducts.length > 0) {
      const slowProduct = profitMetrics.lowVolumeProducts.sort((a, b) => a.quantity - b.quantity)[0];
      
      strategies.push({
        type: 'CLEARANCE',
        priority: 'URGENT',
        title: `Produk dengan kurang peminat :  ${slowProduct.name}`,
        description: `Produk ini hanya laku ${slowProduct.quantity} unit. Lebih baik obral cepat, dan kurangi produksi di penjualan berikutnya`,
        currentQuantity: slowProduct.quantity,
        currentRevenue: slowProduct.revenue,
        normalPrice: slowProduct.price,
        clearancePrice: slowProduct.price * 0.7, // Diskon 30%
        action: `Obral diskon 30% supaya cepat laku`,
        risk: 'LOW',
        impact: 'HIGH',
        benefit: 'Dapat uang cepat dan modal tidak menumpuk'
      });
    }

    return strategies;
  };

  const pricingStrategies = generatePricingStrategies();

  // 📊 ANALISA PERPUTARAN BARANG - DATA ASLI DARI FILE
  const analyzeCashFlow = () => {
    const avgQuantity = products.length > 0 ? totalUnits / products.length : 0;
    
    const fastMovers = products.filter(p => p.quantity > avgQuantity * 1.5);
    const slowMovers = products.filter(p => p.quantity < avgQuantity * 0.5);

    const fastMoverRevenue = fastMovers.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const slowMoverRevenue = slowMovers.reduce((sum, p) => sum + (p.revenue || 0), 0);

    return {
      fastMovers,
      slowMovers,
      fastMoverRevenue,
      slowMoverRevenue
    };
  };

  // Removed cashFlowData call - requires capital data not in file

  // 🎯 SKOR PELUANG - HITUNG DARI DATA REAL
  const totalPotentialRevenue = pricingStrategies.reduce((sum, s) => sum + (s.currentRevenue || 0), 0);
  const opportunityScore = totalRevenue > 0 
    ? Math.min(100, (totalPotentialRevenue / totalRevenue) * 100)
    : 0;

  // CEK APAKAH ADA DATA - JANGAN TAMPILKAN KALAU KOSONG
  if (!products || products.length === 0) {
    return (
      <Alert className="bg-blue-50 border-blue-300">
        <AlertTriangle className="w-5 h-5 text-blue-600" />
        <AlertDescription>
          <p className="font-semibold text-blue-900 mb-2">Belum Ada Data untuk Dianalisa</p>
          <p className="text-sm text-blue-800">
            Upload data penjualan dulu di menu "Upload Data" supaya sistem bisa kasih saran cara naikin untung.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 px-3 sm:px-0">
      {/* Header Banner with Profit Potential */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-2xl p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top duration-500">
        {/* Animated light effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite linear'
          }}
        />
        
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
             
              <h1 className="text-4xl font-black">  </h1>
            </div>
            <p className="text-lg opacity-95 mb-4">
             
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm opacity-90">Total Penjualan</div>
                <div className="text-2xl sm:text-3xl font-black mt-1">
                  Rp {totalRevenue >= 1000000 
                    ? `${(totalRevenue / 1000000).toFixed(1)}jt`
                    : totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] sm:text-xs opacity-75 mt-1">{totalUnits} produk telah terjual</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm opacity-90">Harga Rata-Rata</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-white-300">
                  Rp {averagePrice >= 1000 
                    ? `${(averagePrice / 1000).toFixed(0)}k`
                    : averagePrice.toFixed(0)}
                </div>
                <div className="text-[10px] sm:text-xs opacity-75 mt-1">
                  Per produk
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm opacity-90">Produk Dijual</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-white-300">
                  {products.length}
                </div>
                <div className="text-[10px] sm:text-xs opacity-75 mt-1">
                  Jenis produk berbeda
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-in fade-in slide-in-from-left duration-700 delay-200">
        {[
          { id: 'overview', label: 'Ringkasan Penjualan', icon: PieChart },
          { id: 'opportunities', label: 'Saran Peningkatan', icon: Target },
          { id: 'pricing', label: 'Analisis Produk', icon: Percent }
        ].map(tab => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 py-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          

          {/* Top Revenue Contributors */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="text-blue-900 flex items-center gap-2 text-base sm:text-lg">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
               Berikut Produk Yang berperan penting dalam meningkatkan Profit Perusahaan :
              </CardTitle>
              <p className="text-xs sm:text-sm text-blue-700 mt-2">
                {profitMetrics.top20PercentProducts.length} produk ini memperoleh 80% dari total pendapatan 
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 sm:space-y-3">
                {profitMetrics.top20PercentProducts.slice(0, 8).map((product, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-lg border-2 border-blue-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl sm:text-2xl font-black text-blue-700">#{idx + 1}</span>
                          {idx < 3 && <span className="text-xl sm:text-2xl">{idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}</span>}
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base break-words">{product.name}</h4>
                          {product.size && <Badge variant="outline">Size {product.size}</Badge>}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div>
                            <span className="text-gray-600">Penjualan:</span>
                            <div className="font-bold text-green-700">
                              Rp {product.revenue.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Terjual:</span>
                            <div className="font-bold text-purple-700">{product.quantity} unit</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Harga:</span>
                            <div className="font-bold text-blue-700">Rp {product.price.toLocaleString('id-ID')}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Kontribusi:</span>
                            <div className="font-bold text-orange-700">
                              {product.contributionToRevenue.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-300">
                <div className="flex items-start gap-3">
                  
                  <div>
                    <p className="font-bold text-green-900 mb-1">Yang Harus Kamu Lakukan:</p>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ <strong>Jaga Stok:</strong> Jangan sampai habis! karena produk Ini sumber utama penjualan.</li>
                      <li>✅ <strong>Promosi :</strong> Iklankan produk ini secara konsisten.</li>
                      <li>✅ <strong>Pertahankan Harga:</strong> Jika produk laku keras, maka harga udah pas.</li>
                      <li>✅ <strong>Bikin Varian Baru:</strong> Coba produksi warna/ukuran lain dari produk ini.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Revenue Products */}
          {profitMetrics.lowRevenueProducts.length > 0 ? (
            <Card className="border-2 border-blue-300">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-900 flex items-center gap-2 text-base sm:text-lg">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                  Produk dengan Penjualan Rendah 
                </CardTitle>
                <p className="text-xs sm:text-sm text-blue-700 mt-2">
                  {profitMetrics.lowRevenueProducts.length} produk terdeteksi mengalami penjualan di bawah rata-rata. 
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {profitMetrics.lowRevenueProducts.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 sm:p-4 rounded-lg border-2 border-blue-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base break-words">{product.name}</h4>
                          {product.size && <Badge variant="outline" className="mb-2">Size {product.size}</Badge>}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div>
                              <span className="text-gray-600">Penjualan:</span>
                              <div className="font-bold text-blue-700">
                                Rp {product.revenue.toLocaleString('id-ID')}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Terjual:</span>
                              <div className="font-bold text-blue-700">{product.quantity} unit</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Harga Jual:</span>
                              <div className="font-bold text-gray-900">Rp {product.price.toLocaleString('id-ID')}</div>
                            </div>
                          </div>
                        </div>
                     
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-blue-600">
                        <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Saran:</p>
                        <p className="text-xs sm:text-sm text-blue-800">
                          Penjualan rendah (Hanya {product.quantity} terjual). Coba turunkan harga 20-30% atau obral untuk cepat laku! dan kurangi stock untuk produk ini di penjualan berikutnya
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-green-300">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">🎉 Semua Produk Laku Bagus!</h3>
                <p className="text-gray-700">
                  Tidak ada produk dengan penjualan rendah. Pertahankan strategi penjualan Anda!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <AlertDescription>
              <p className="font-bold text-blue-900 text-base sm:text-lg mb-2">SKIRO Memiliki {pricingStrategies.length} Saran untuk meningkatkan Penjualan toko mu</p>
              <p className="text-xs sm:text-sm text-blue-800">
              
              </p>
            </AlertDescription>
          </Alert>

          {pricingStrategies.length === 0 ? (
            <Card className="border-2 border-green-300">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">Hebat! Penjualan Sudah Bagus</h3>
                <p className="text-gray-700">
                  Sistem tidak menemukan area yang perlu diperbaiki. Pertahankan cara jualan kamu sekarang!
                </p>
              </CardContent>
            </Card>
          ) : (
            pricingStrategies.map((strategy, idx) => (
            <Card key={idx} className="border-2 border-blue-300">
              <CardHeader className={`
                ${strategy.priority === 'URGENT' ? 'bg-red-50' : 
                  strategy.priority === 'HIGH' ? 'bg-orange-50' : 'bg-blue-50'}
              `}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`
                        ${strategy.priority === 'URGENT' ? 'bg-red-600' : 
                          strategy.priority === 'HIGH' ? 'bg-orange-600' : 'bg-blue-600'}
                        text-white
                      `}>
                        {strategy.priority}
                      </Badge>
                      <Badge variant="outline">{strategy.type}</Badge>
                      <Badge className={`
                        ${strategy.risk === 'LOW' ? 'bg-green-500' : 
                          strategy.risk === 'MEDIUM' ? 'bg-blue-500' : 'bg-red-500'}
                        text-white
                      `}>
                        Risk: {strategy.risk}
                      </Badge>
                      <Badge className="bg-blue-600 text-white">
                        Impact: {strategy.impact}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm sm:text-lg text-gray-900 break-words">{strategy.title}</CardTitle>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-600">Penjualan Saat Ini</div>
                    <div className="text-xl sm:text-2xl font-black text-blue-600">
                      Rp {(strategy.currentRevenue || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3">{strategy.description}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                      Yang Harus Dilakukan:
                    </p>
                    <p className="text-blue-800 text-sm sm:text-lg font-semibold break-words">{strategy.action}</p>
                    {strategy.benefit && (
                      <p className="text-xs sm:text-sm text-blue-700 mt-2">💡 <strong>Keuntungannya:</strong> {strategy.benefit}</p>
                    )}
                  </div>

                  {strategy.type === 'CLEARANCE' && strategy.clearancePrice && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-xs sm:text-sm text-orange-700 mb-2">Harga Obral yang kami sarankan :</p>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 line-through text-sm sm:text-lg">
                          Rp {strategy.normalPrice.toLocaleString('id-ID')}
                        </span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                        <span className="text-xl sm:text-2xl font-black text-orange-900">
                          Rp {strategy.clearancePrice.toLocaleString('id-ID')}
                        </span>
                        <Badge className="bg-orange-600 text-white">DISKON 30%!</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )))}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <Alert className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <AlertDescription>
              <p className="font-bold text-indigo-900 text-base sm:text-lg mb-2">Analisis Produk Berdasarkan hasil Penjualan</p>
              <p className="text-xs sm:text-sm text-indigo-800">
                Produk dibagi jadi 2 kategori: Laku Banyak vs Laku Sedikit. Ini bantu toko mu melihat produk mana yang perlu lebih promosi.
              </p>
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            {/* High Volume Products */}
            <Card className="border-2 border-green-300">
              <CardHeader className="bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <h3 className="text-base sm:text-lg font-bold text-green-900">Banyak Terjual</h3>
                  <Badge className="bg-green-600 text-white">{profitMetrics.highVolumeProducts.length}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-green-800">
                  
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                {profitMetrics.highVolumeProducts.length > 0 ? (
                  <>
                    <div className="space-y-1.5 sm:space-y-2">
                      {profitMetrics.highVolumeProducts.slice(0, 5).map((p, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-green-200">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">{p.name}</div>
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
                            <span>{p.quantity} terjual</span>
                            <span className="text-green-600 font-bold">Rp {p.revenue.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-green-100 rounded text-xs sm:text-sm text-green-900">
                      <strong>Saran:</strong> Jaga stok selalu ada! 
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">Belum ada produk di kategori ini</div>
                )}
              </CardContent>
            </Card>

            {/* Low Volume Products */}
            <Card className="border-2 border-orange-300">
              <CardHeader className="bg-orange-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  <h3 className="text-base sm:text-lg font-bold text-orange-900">Sedikit Terjual</h3>
                  <Badge className="bg-orange-600 text-white">{profitMetrics.lowVolumeProducts.length}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-orange-800">
                  
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                {profitMetrics.lowVolumeProducts.length > 0 ? (
                  <>
                    <div className="space-y-1.5 sm:space-y-2">
                      {profitMetrics.lowVolumeProducts.slice(0, 5).map((p, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-orange-200">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">{p.name}</div>
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
                            <span>{p.quantity} terjual</span>
                            <span className="text-orange-600 font-bold">Rp {p.revenue.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-orange-100 rounded text-xs sm:text-sm text-orange-900">
                      <strong>Saran:</strong> Turunkan harga 20-30% atau buat promo bundling!
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">Semua produk laku bagus!</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitMaximizerDashboard;
