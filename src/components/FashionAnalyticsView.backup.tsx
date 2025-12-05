import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain } from 'lucide-react';
import type { FashionAnalysisResult } from '@/lib/fashionAnalyzer';
import SkiroSupremeReport from './SkiroSupremeReport';

interface FashionAnalyticsViewProps {
  analysis: FashionAnalysisResult;
}

const FashionAnalyticsView: React.FC<FashionAnalyticsViewProps> = ({ analysis }) => {
  const { supremeAIReport } = analysis;

  return (
    <div className="space-y-6">
      {/* SKIRO SUPREME AI - THE ONLY REPORT YOU NEED */}
      {supremeAIReport ? (
        <SkiroSupremeReport report={supremeAIReport} />
      ) : (
        <Alert className="border-blue-500 bg-blue-50">
          <Brain className="w-5 h-5 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>SKIRO SUPREME AI</strong> sedang memproses data Anda... Jika tidak muncul, silakan re-upload file CSV.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FashionAnalyticsView;

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs opacity-75 mt-1">Dari {totalUnits} unit terjual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs opacity-75 mt-1">Produk fashion aktif</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Harga Rata-rata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {Math.round(averagePrice).toLocaleString('id-ID')}</div>
            <p className="text-xs opacity-75 mt-1">Per unit</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${
          deadstockAnalysis.totalDeadstockRisk > 60 
            ? 'from-red-500 to-red-700' 
            : deadstockAnalysis.totalDeadstockRisk > 30
              ? 'from-orange-500 to-orange-700'
              : 'from-emerald-500 to-emerald-700'
        } text-white`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Risiko Deadstock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadstockAnalysis.totalDeadstockRisk.toFixed(0)}%</div>
            <p className="text-xs opacity-75 mt-1">
              {deadstockAnalysis.totalDeadstockRisk > 60 ? '🚨 Tinggi' : deadstockAnalysis.totalDeadstockRisk > 30 ? '⚠️ Sedang' : '✅ Rendah'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion Card */}
      <Card className="border-l-4 border-l-blue-900 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <span>📋</span> Kesimpulan & Rekomendasi Stok
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {conclusion.split('\n\n').map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.split('\n').map((line, lineIdx) => {
                const trimmedLine = line.trim();
                
                // Section headers (ALL CAPS lines)
                if (trimmedLine && trimmedLine === trimmedLine.toUpperCase() && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('→')) {
                  return (
                    <h3 key={lineIdx} className="font-bold text-base text-blue-900 mt-4 mb-2 border-b-2 border-blue-200 pb-1">
                      {trimmedLine}
                    </h3>
                  );
                }
                // Numbered items (1., 2., 3.)
                else if (/^\d+\./.test(trimmedLine)) {
                  return (
                    <div key={lineIdx} className="font-semibold text-gray-800 mt-2">
                      {trimmedLine}
                    </div>
                  );
                }
                // Sub-items with arrow (→)
                else if (trimmedLine.startsWith('→')) {
                  return (
                    <div key={lineIdx} className="ml-6 text-gray-700 text-sm">
                      {trimmedLine}
                    </div>
                  );
                }
                // Bullet points
                else if (trimmedLine.startsWith('•')) {
                  return (
                    <div key={lineIdx} className="ml-4 text-gray-700">
                      {trimmedLine}
                    </div>
                  );
                }
                // Regular text
                else if (trimmedLine) {
                  return (
                    <p key={lineIdx} className="text-gray-700 leading-relaxed">
                      {trimmedLine}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Insights Kunci</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {insights.map((insight, idx) => (
              <Alert key={idx} className={
                insight.includes('🚨') || insight.includes('PERINGATAN') 
                  ? 'border-red-300 bg-red-50'
                  : insight.includes('⚠️')
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-blue-300 bg-blue-50'
              }>
                <AlertDescription className="font-medium">{insight}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Size Analysis Chart */}
      {sizeAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📏 Analisis Size - Mana yang Paling Laku?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Penjualan per Size</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sizeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalSold" fill="#1e3a8a" name="Unit Terjual" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Distribusi Size (%)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sizeAnalysis}
                      dataKey="percentage"
                      nameKey="size"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.size}: ${entry.percentage.toFixed(1)}%`}
                    >
                      {sizeAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Size Performance Table */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-gray-700">Detail Performance per Size</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-right">Unit Terjual</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                      <th className="px-4 py-2 text-right">% dari Total</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeAnalysis.map((size, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2 font-bold text-blue-900">{size.size}</td>
                        <td className="px-4 py-2 text-right">{size.totalSold.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-2 text-right">Rp {size.revenue.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-2 text-right font-semibold">{size.percentage.toFixed(1)}%</td>
                        <td className="px-4 py-2 text-center">
                          {size.status === 'hot' && <Badge className="bg-red-500">🔥 HOT</Badge>}
                          {size.status === 'normal' && <Badge className="bg-blue-500">✅ Normal</Badge>}
                          {size.status === 'slow' && <Badge className="bg-orange-500">📉 Slow</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Analysis */}
      {categoryAnalysis.length > 0 && categoryAnalysis[0].category !== 'Uncategorized' && (
        <Card>
          <CardHeader>
            <CardTitle>📦 Analisis Kategori Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-900 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Kategori</th>
                    <th className="px-4 py-2 text-right">Unit Terjual</th>
                    <th className="px-4 py-2 text-right">Revenue</th>
                    <th className="px-4 py-2 text-right">% Total</th>
                    <th className="px-4 py-2 text-right">Harga Rata-rata</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryAnalysis.map((cat, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                      <td className="px-4 py-2 font-bold text-purple-900">{cat.category}</td>
                      <td className="px-4 py-2 text-right">{cat.totalSold.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-2 text-right">Rp {cat.revenue.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-2 text-right font-semibold">{cat.percentage.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right">Rp {Math.round(cat.avgPrice).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Rekomendasi Stok untuk Mengurangi Deadstock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stockRecommendations.slice(0, 15).map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.action === 'INCREASE'
                    ? 'bg-green-50 border-green-600'
                    : rec.action === 'MAINTAIN'
                      ? 'bg-blue-50 border-blue-600'
                      : rec.action === 'REDUCE'
                        ? 'bg-orange-50 border-orange-600'
                        : 'bg-red-50 border-red-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900">{rec.productName}</h4>
                      <Badge
                        variant={rec.priority === 'HIGH' ? 'destructive' : 'secondary'}
                        className={rec.priority === 'HIGH' ? 'bg-red-600' : ''}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{rec.reason}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-semibold text-gray-900">
                        Rekomendasi: {rec.quantityRecommendation}
                      </span>
                      <span className={`font-bold ${
                        rec.deadstockRisk > 80 ? 'text-red-600' :
                        rec.deadstockRisk > 60 ? 'text-orange-600' :
                        rec.deadstockRisk > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        Risk: {rec.deadstockRisk}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {rec.action === 'INCREASE' && <TrendingUp className="w-8 h-8 text-green-600" />}
                    {rec.action === 'MAINTAIN' && <CheckCircle className="w-8 h-8 text-blue-600" />}
                    {rec.action === 'REDUCE' && <TrendingDown className="w-8 h-8 text-orange-600" />}
                    {rec.action === 'DISCONTINUE' && <XCircle className="w-8 h-8 text-red-600" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deadstock Analysis */}
      {deadstockAnalysis.productsAtRisk.length > 0 && (
        <Card className="border-2 border-red-300">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              🚨 Produk Berisiko Deadstock - SEGERA AMBIL TINDAKAN!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="font-semibold">
                {deadstockAnalysis.productsAtRisk.length} produk berisiko tinggi deadstock dengan estimasi nilai 
                Rp {deadstockAnalysis.estimatedDeadstockValue.toLocaleString('id-ID')}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {deadstockAnalysis.productsAtRisk.map((product, idx) => (
                <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-red-900">{product.name}</h4>
                      {product.size && <p className="text-sm text-red-700">Size: {product.size}</p>}
                      <p className="text-sm text-gray-700 mt-1">Hanya {product.soldUnits} unit terjual</p>
                      <p className="text-sm font-semibold text-red-800 mt-2">
                        💡 {product.recommendation}
                      </p>
                    </div>
                    <Badge variant="destructive" className="bg-red-600">
                      {product.riskLevel} RISK
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top & Bottom Products */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-900">🏆 Top 10 Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {products
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10)
                .map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-900 text-lg">#{idx + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        {product.size && <p className="text-xs text-gray-600">Size: {product.size}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">{product.quantity} unit</p>
                      <p className="text-xs text-gray-600">Rp {product.revenue.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Products */}
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-900">⚠️ Bottom 10 Produk (Risiko Deadstock)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {products
                .sort((a, b) => a.quantity - b.quantity)
                .slice(0, 10)
                .map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-red-900 text-lg">#{idx + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        {product.size && <p className="text-xs text-gray-600">Size: {product.size}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-700">{product.quantity} unit</p>
                      <p className="text-xs text-gray-600">Rp {product.revenue.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FashionAnalyticsView;
