import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, 
  Lightbulb, Package, DollarSign, BarChart3, Activity
} from 'lucide-react';
import type { SkiroIntelligenceReport } from '@/lib/skiroIntelligence';

interface IntelligenceReportProps {
  report: SkiroIntelligenceReport;
}

const IntelligenceReport: React.FC<IntelligenceReportProps> = ({ report }) => {
  const { executiveSummary, forecasting, abcAnalysis, deadstockRisks, businessActions, detailedInsights, assumptions, dataQuality } = report;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'EXCELLENT': return 'from-green-500 to-emerald-600';
      case 'GOOD': return 'from-blue-500 to-cyan-600';
      case 'FAIR': return 'from-yellow-500 to-orange-500';
      case 'POOR': return 'from-red-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="text-green-500" size={20} />;
      case 'decreasing': return <TrendingDown className="text-red-500" size={20} />;
      default: return <Activity className="text-gray-500" size={20} />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'INCREASE_ORDER': return <TrendingUp className="text-green-600" size={18} />;
      case 'REDUCE_ORDER': return <TrendingDown className="text-red-600" size={18} />;
      case 'PROMO': return <DollarSign className="text-purple-600" size={18} />;
      case 'BUNDLE': return <Package className="text-blue-600" size={18} />;
      default: return <Target className="text-gray-600" size={18} />;
    }
  };

  return (
    <div className="space-y-6 px-3 sm:px-0">
      {/* Executive Summary - Hero Section */}
      <Card className={`border-2 bg-gradient-to-br ${getHealthColor(executiveSummary.overallHealth)} text-white`}>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <CardTitle className="text-lg sm:text-2xl font-bold">Skiro Intelligence Report</CardTitle>
                <p className="text-[11px] sm:text-sm opacity-90 mt-1">Powered by AI-driven analytics & forecasting</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{executiveSummary.healthScore}</div>
              <div className="text-[10px] sm:text-xs opacity-90">Health Score</div>
              <Badge className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0">
                {executiveSummary.overallHealth}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Key Insights */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                Key Insights
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                {executiveSummary.keyInsights.map((insight, idx) => (
                  <li key={idx} className="opacity-90">• {insight}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                Top Opportunities
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                {executiveSummary.topOpportunities.length > 0 ? (
                  executiveSummary.topOpportunities.map((opp, idx) => (
                    <li key={idx} className="opacity-90">• {opp}</li>
                  ))
                ) : (
                  <li className="opacity-75 italic">Analisis lanjut diperlukan</li>
                )}
              </ul>
            </div>

            {/* Critical Risks */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                Critical Risks
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                {executiveSummary.criticalRisks.length > 0 ? (
                  executiveSummary.criticalRisks.map((risk, idx) => (
                    <li key={idx} className="opacity-90">• {risk}</li>
                  ))
                ) : (
                  <li className="opacity-75 italic">✅ Tidak ada risiko kritis</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Actions - The Most Important Section */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardTitle className="text-orange-900 flex items-center gap-2 text-base sm:text-lg">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            🎯 PRIORITY ACTIONS - Aksi Segera yang Harus Dilakukan
          </CardTitle>
          <p className="text-xs sm:text-sm text-orange-700 mt-2">
            Berdasarkan analisis mendalam, berikut adalah rekomendasi aksi yang telah diprioritaskan untuk hasil maksimal
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 sm:space-y-4">
            {businessActions.slice(0, 10).map((action, idx) => (
              <div 
                key={idx} 
                className={`p-4 border-l-4 rounded-lg ${
                  action.priority <= 3 
                    ? 'border-red-500 bg-red-50' 
                    : action.priority <= 6 
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    action.priority <= 3 ? 'bg-red-500' : action.priority <= 6 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {action.priority}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      {getActionIcon(action.actionType)}
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{action.description}</h4>
                      <Badge variant="outline" className="ml-auto text-[10px] sm:text-xs px-2 py-0.5">
                        {action.actionType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2">
                      <strong>Produk:</strong> {action.productName}
                      {action.category && ` | Kategori: ${action.category}`}
                      {action.size && ` | Size: ${action.size}`}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Target:</span>
                        <p className="text-gray-600">{action.quantitativeTarget}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Expected Impact:</span>
                        <p className="text-gray-600">{action.expectedImpact}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Timeframe:</span>
                        <p className="text-gray-600">{action.timeframe}</p>
                      </div>
                    </div>
                    <Alert className="mt-3 bg-white/50">
                      <AlertDescription className="text-[11px] sm:text-xs text-gray-700">
                        <strong>Reasoning:</strong> {action.reasoning}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demand Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            📈 Demand Forecasting - Prediksi Permintaan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {forecasting.slice(0, 10).map((forecast, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  {getTrendIcon(forecast.trend)}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{forecast.productName}</p>
                    <p className="text-[11px] sm:text-xs text-gray-600">
                      Current: {forecast.currentAvgDemand} → Forecast: {forecast.forecastedDemand} unit
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={forecast.trend === 'increasing' ? 'default' : forecast.trend === 'decreasing' ? 'destructive' : 'secondary'}>
                    {forecast.trendPercentage > 0 ? '+' : ''}{forecast.trendPercentage}%
                  </Badge>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Confidence: {forecast.confidence}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ABC Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            📦 ABC Analysis - Klasifikasi Produk
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Pareto analysis: Identifikasi produk Class A (80% revenue), B (15%), dan C (5%)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Class A */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <span className="text-lg sm:text-2xl">🏆</span> Class A Products
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                {abcAnalysis.filter(a => a.class === 'A').slice(0, 5).map((product, idx) => (
                  <li key={idx} className="text-xs sm:text-sm">
                    <span className="font-semibold text-blue-900">{product.productName}</span>
                    <p className="text-[11px] sm:text-xs text-blue-700">
                      {product.revenueContribution.toFixed(1)}% revenue | Velocity: {product.velocity}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Class B */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-green-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text;base">
                <span className="text-lg sm:text-2xl">⭐</span> Class B Products
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                {abcAnalysis.filter(a => a.class === 'B').slice(0, 5).map((product, idx) => (
                  <li key={idx} className="text-xs sm:text-sm">
                    <span className="font-semibold text-green-900">{product.productName}</span>
                    <p className="text-[11px] sm:text-xs text-green-700">
                      {product.revenueContribution.toFixed(1)}% revenue | Velocity: {product.velocity}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Class C */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 sm:p-4 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-orange-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <span className="text-lg sm:text-2xl">⚠️</span> Class C Products
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                {abcAnalysis.filter(a => a.class === 'C').slice(0, 5).map((product, idx) => (
                  <li key={idx} className="text-xs sm:text-sm">
                    <span className="font-semibold text-orange-900">{product.productName}</span>
                    <p className="text-[11px] sm:text-xs text-orange-700">
                      {product.revenueContribution.toFixed(1)}% revenue | Velocity: {product.velocity}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Deadstock Risks */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-900 flex items-center gap-2 text-base sm:text-lg">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            🚨 Enhanced Deadstock Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2 sm:space-y-3">
            {deadstockRisks.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').slice(0, 10).map((risk, idx) => (
              <div key={idx} className={`p-3 sm:p-4 border-2 rounded-lg ${getRiskColor(risk.riskLevel)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{risk.productName}</h4>
                    <p className="text-[11px] sm:text-xs mt-1">
                      {risk.category && `Kategori: ${risk.category} | `}
                      {risk.size && `Size: ${risk.size} | `}
                      Sales: {risk.currentSales} unit
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl sm:text-2xl">{risk.riskScore}</div>
                    <div className="text-[10px] sm:text-xs">Risk Score</div>
                    <Badge className="mt-1">{risk.riskLevel}</Badge>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold">Forecasted Demand:</span> {risk.forecastedDemand} unit/month
                  </div>
                  <div>
                    <span className="font-semibold">Days to Deadstock:</span> {risk.daysToDeadstock || 'N/A'} days
                  </div>
                </div>
                <Alert className="mt-3">
                  <AlertDescription className="text-[11px] sm:text-xs">
                    <strong>Recommendation:</strong> {risk.recommendation}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights & Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              💡 Detailed Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 sm:space-y-2">
              {detailedInsights.map((insight, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-gray-700 border-l-2 border-blue-300 pl-3 py-1">
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              📋 Assumptions & Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold">Data Quality Score</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">{dataQuality.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    dataQuality.score >= 80 ? 'bg-green-500' : dataQuality.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${dataQuality.score}%` }}
                />
              </div>
            </div>

            {dataQuality.issues.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-xs sm:text-sm mb-2 text-red-700">Issues Detected:</h5>
                <ul className="space-y-1">
                  {dataQuality.issues.map((issue, idx) => (
                    <li key={idx} className="text-[11px] sm:text-xs text-red-600">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h5 className="font-semibold text-xs sm:text-sm mb-2">Analysis Assumptions:</h5>
              <ul className="space-y-1">
                {assumptions.map((assumption, idx) => (
                  <li key={idx} className="text-[11px] sm:text-xs text-gray-600">• {assumption}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceReport;
