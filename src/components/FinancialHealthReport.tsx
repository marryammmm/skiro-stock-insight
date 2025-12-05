import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, 
  Activity, Shield, Flame, Skull, CheckCircle, XCircle
} from 'lucide-react';
import type { FinancialHealthReport as FinancialHealthData } from '@/lib/fashionAnalyzer';

interface FinancialHealthReportProps {
  data: FinancialHealthData;
}

const FinancialHealthReport: React.FC<FinancialHealthReportProps> = ({ data }) => {
  
  const getBankruptcyRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-300';
    if (score >= 60) return 'bg-blue-50 border-blue-300';
    if (score >= 40) return 'bg-orange-50 border-orange-300';
    return 'bg-red-50 border-red-300';
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'SAFE': return <Shield className="text-green-600" size={20} />;
      case 'CAUTION': return <Activity className="text-yellow-600" size={20} />;
      case 'DANGER': return <AlertTriangle className="text-orange-600" size={20} />;
      case 'CRITICAL': return <Skull className="text-red-600" size={20} />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      URGENT: 'bg-red-600 text-white',
      HIGH: 'bg-orange-500 text-white',
      MEDIUM: 'bg-yellow-500 text-white',
      LOW: 'bg-green-500 text-white'
    };
    return <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-500'}>{priority}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header - Overall Health Score */}
      <Card className="border-4 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl flex items-center gap-3">
            <Shield size={36} />
            🏦 Kesehatan Keuangan Bisnis Kamu
          </CardTitle>
          <p className="text-sm opacity-90 mt-2">Sistem Anti-Bangkrut dari SKIRO - Jaga modal dan hindari produk numpuk yang gak laku</p>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Overall Score Display */}
          <div className="text-center mb-6">
            <div className={`text-7xl font-bold ${getHealthScoreColor(data.overallHealthScore)}`}>
              {data.overallHealthScore.toFixed(0)}
            </div>
            <div className="text-xl text-gray-600 mt-2">Skor Kesehatan Bisnis</div>
            <div className="mt-4">
              <Badge className={`text-lg px-6 py-2 ${getBankruptcyRiskColor(data.bankruptcyRisk)}`}>
                Risiko Bangkrut: {data.bankruptcyRisk === 'LOW' ? 'RENDAH' : data.bankruptcyRisk === 'MEDIUM' ? 'SEDANG' : data.bankruptcyRisk === 'HIGH' ? 'TINGGI' : 'BAHAYA!'}
              </Badge>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300 text-center">
              <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
              <div className="text-3xl font-bold text-green-700">{data.healthyProducts}</div>
              <div className="text-sm text-gray-600 mt-1">Produk Sehat</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300 text-center">
              <Activity className="mx-auto text-yellow-600 mb-2" size={32} />
              <div className="text-3xl font-bold text-yellow-700">{data.riskyProducts}</div>
              <div className="text-sm text-gray-600 mt-1">Produk Berisiko</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300 text-center">
              <AlertTriangle className="mx-auto text-red-600 mb-2" size={32} />
              <div className="text-3xl font-bold text-red-700">{data.criticalProducts}</div>
              <div className="text-sm text-gray-600 mt-1">Produk Kritis</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300 text-center">
              <DollarSign className="mx-auto text-purple-600 mb-2" size={32} />
              <div className="text-xl font-bold text-purple-700">
                Rp {data.totalCashAtRisk >= 1000000 
                  ? `${(data.totalCashAtRisk / 1000000).toFixed(1)}jt`
                  : data.totalCashAtRisk.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-600 mt-1">Modal Tertahan</div>
            </div>
          </div>

          {/* Cash Flow Efficiency */}
          <div className="mt-6 bg-white p-4 rounded-lg border-2 border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Efisiensi Arus Kas</span>
              <span className={`text-2xl font-bold ${data.cashFlowEfficiency >= 70 ? 'text-green-600' : data.cashFlowEfficiency >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {data.cashFlowEfficiency.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${data.cashFlowEfficiency >= 70 ? 'bg-green-500' : data.cashFlowEfficiency >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${data.cashFlowEfficiency}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {data.cashFlowEfficiency >= 70 ? '✅ Mantap! Kebanyakan modal kamu menghasilkan untung' : 
               data.cashFlowEfficiency >= 50 ? '⚠️ Lumayan sih, tapi ada modal yang nganggur di produk lelet' :
               '🚨 Waduh! Banyak modal numpuk di barang yang gak laku - BUTUH ACTION CEPAT!'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Actions Alert */}
      {data.urgentActionNeeded && data.urgentActions.length > 0 && (
        <Alert className="bg-red-50 border-4 border-red-500">
          <Flame className="h-6 w-6 text-red-600" />
          <AlertDescription className="ml-2">
            <div className="font-bold text-xl text-red-900 mb-3">🚨 HARUS DIAMBIL TINDAKAN SEKARANG!</div>
            <div className="space-y-2">
              {data.urgentActions.map((action, idx) => (
                <div key={idx} className="bg-white p-3 rounded border-l-4 border-red-600">
                  <p className="text-sm text-red-800 font-medium">{action}</p>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Recommended Focus */}
      {data.recommendedFocus.length > 0 && (
        <Card className="border-2 border-green-400">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <TrendingUp size={24} />
              🎯 Fokuskan Energi Kamu di Sini
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Ini produk-produk jagoan kamu yang paling sehat dan untung! Fokusin marketing sama jaga stock-nya biar makin laris:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {data.recommendedFocus.map((product, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="font-semibold text-gray-900">{product}</div>
                  <Badge className="ml-auto bg-green-600 text-white">PRIORITAS</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Health Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={24} />
            📊 Kesehatan Tiap Produk Kamu
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Diurutkan dari yang PALING BUTUH PERHATIAN (yang kritis duluan)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.productHealth.slice(0, 20).map((product, idx) => {
              const productLabel = product.size ? `${product.productName} (Size ${product.size})` : product.productName;
              return (
                <div key={idx} className={`p-4 rounded-lg border-2 ${getHealthScoreBg(product.healthScore)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        {getRiskIcon(product.riskLevel)}
                        <h4 className="font-bold text-gray-900 text-base">{productLabel}</h4>
                        {getPriorityBadge(product.actionPriority)}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600 mt-2">
                        <span>Untung: <strong className={product.roi >= 0 ? 'text-green-600' : 'text-red-600'}>{product.roi.toFixed(0)}%</strong></span>
                        <span>Kecepatan Laku: <strong>{product.velocityScore.toFixed(0)}</strong></span>
                        <span>Habis dlm: <strong>{product.estimatedStockDays.toFixed(0)} hari</strong></span>
                        <span>Arus Kas: <strong className={
                          product.cashFlowImpact === 'POSITIVE' ? 'text-green-600' :
                          product.cashFlowImpact === 'NEGATIVE' ? 'text-red-600' : 'text-gray-600'
                        }>{product.cashFlowImpact === 'POSITIVE' ? 'Positif' : product.cashFlowImpact === 'NEGATIVE' ? 'Negatif' : 'Netral'}</strong></span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-4xl font-bold ${getHealthScoreColor(product.healthScore)}`}>
                        {product.healthScore.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-600">Skor Sehat</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-gray-800">{product.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Educational Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Cara Baca Skor Kesehatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">80-100</Badge>
              <span>MANTAP BANGET - Ini sapi perah kamu! Tambahin stock & fokus promosi</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600">60-79</Badge>
              <span>BAGUS - Performa solid, pertahankan aja level sekarang</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600">40-59</Badge>
              <span>HATI-HATI - Kurang oke nih, coba kasih promo atau bundling</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-600">0-39</Badge>
              <span>BAHAYA! - Mending STOP produksi deh! Obral aja 50-70%!</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-blue-300">
            <p className="text-xs text-gray-700">
              <strong>Skor Kesehatan</strong> ini dihitung dari 3 hal: Seberapa besar kontribusi ke omset (40%), Seberapa banyak terjual (30%), sama Risiko numpuk gak laku (30%). 
              Makin tinggi skornya, makin sehat tuh produk!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialHealthReport;
