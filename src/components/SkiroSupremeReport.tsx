/**
 * SKIRO SUPREME AI REPORT COMPONENT
 * The Ultimate Business Intelligence Dashboard
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Target, Zap, Award, XCircle, Clock, DollarSign, Package,
  Flame, Snowflake, Star, ArrowUp, ArrowDown, Download, Shield
} from 'lucide-react';
import type { SkiroSupremeAIReport } from '@/lib/skiroSupremeAI';

interface SkiroSupremeReportProps {
  report: SkiroSupremeAIReport;
}

const SkiroSupremeReport: React.FC<SkiroSupremeReportProps> = ({ report }) => {
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getHealthColorSimple = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return <Badge variant="destructive" className="gap-1"><AlertTriangle size={12} />CRITICAL</Badge>;
      case 'HIGH': return <Badge variant="destructive" className="gap-1 bg-orange-500"><AlertTriangle size={12} />HIGH</Badge>;
      case 'MEDIUM': return <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600">MEDIUM</Badge>;
      case 'LOW': return <Badge variant="outline" className="gap-1 text-green-600 border-green-600">LOW</Badge>;
      case 'MINIMAL': return <Badge variant="outline" className="gap-1 text-blue-600 border-blue-600">MINIMAL</Badge>;
      default: return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'SUPERSTAR': return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case 'RISING_STAR': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'CASH_COW': return <DollarSign className="w-4 h-4 text-blue-500" />;
      case 'SLEEPING_GIANT': return <Clock className="w-4 h-4 text-purple-500" />;
      case 'SLOW_BURNER': return <TrendingDown className="w-4 h-4 text-orange-500" />;
      case 'DEAD_WEIGHT': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'SUPERSTAR': return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'RISING_STAR': return 'bg-green-50 border-green-300 text-green-800';
      case 'CASH_COW': return 'bg-blue-50 border-blue-300 text-blue-800';
      case 'SLEEPING_GIANT': return 'bg-purple-50 border-purple-300 text-purple-800';
      case 'SLOW_BURNER': return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'DEAD_WEIGHT': return 'bg-red-50 border-red-300 text-red-800';
      default: return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <Card className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">SKIRO SUPREME AI</CardTitle>
                <p className="text-blue-200 text-sm mt-1">The Ultimate Business Consultant - Powered by Advanced AI</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {report.executive_summary.analysis_date}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold">Rp {report.executive_summary.total_revenue.toLocaleString('id-ID')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Products Analyzed</div>
              <div className="text-2xl font-bold">{report.executive_summary.total_products}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Units Sold</div>
              <div className="text-2xl font-bold">{report.executive_summary.total_units.toLocaleString('id-ID')}</div>
              <div className="text-xs text-blue-300 mt-1">
                {report.executive_summary.total_units > 0 ? '✅ Real data dari QTY' : '⚠️ No QTY data'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Health Score</div>
              <div className={`text-2xl font-bold ${report.executive_summary.overall_health_score >= 70 ? 'text-green-300' : report.executive_summary.overall_health_score >= 50 ? 'text-yellow-300' : 'text-red-300'}`}>
                {report.executive_summary.overall_health_score}/100
              </div>
            </div>
          </div>
          
          {/* One Sentence Insight */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border-2 border-white/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-1" />
              <div>
                <div className="text-sm text-blue-200 mb-1">AI Instant Insight</div>
                <div className="text-lg font-semibold">{report.executive_summary.one_sentence_insight}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRITICAL ALERTS */}
      {report.critical_alerts.length > 0 && (
        <div className="space-y-3">
          {report.critical_alerts.map((alert, idx) => (
            <Alert 
              key={idx} 
              className={
                alert.type === 'DANGER' ? 'border-red-500 bg-red-50' :
                alert.type === 'WARNING' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }
            >
              <div className="flex items-start gap-3">
                {alert.type === 'DANGER' && <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                {alert.type === 'WARNING' && <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
                {alert.type === 'INFO' && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className={`font-bold text-sm mb-1 ${
                    alert.type === 'DANGER' ? 'text-red-900' :
                    alert.type === 'WARNING' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    {alert.title}
                  </div>
                  <AlertDescription className={
                    alert.type === 'DANGER' ? 'text-red-700' :
                    alert.type === 'WARNING' ? 'text-yellow-700' :
                    'text-blue-700'
                  }>
                    {alert.message}
                  </AlertDescription>
                  <div className="mt-2 text-sm font-medium">
                    <strong>Action:</strong> {alert.action_required}
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* MARKET INTELLIGENCE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Market Intelligence & Business Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health Score Visual */}
            <div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Market Health</span>
                  <span className={`font-bold text-lg ${getHealthColorSimple(report.market_intelligence.market_health_score)}`}>
                    {report.market_intelligence.market_health_score}/100
                  </span>
                </div>
                <Progress value={report.market_intelligence.market_health_score} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Business Phase</div>
                  <div className="font-bold text-blue-900">{report.market_intelligence.business_phase}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-xs text-purple-600 mb-1">Overall Risk</div>
                  <div className="font-bold">{getRiskBadge(report.market_intelligence.overall_risk)}</div>
                </div>
              </div>
            </div>

            {/* Portfolio Balance */}
            <div>
              <div className="text-sm font-medium mb-3">Portfolio Balance</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                    <span className="text-sm font-medium">Superstars</span>
                  </div>
                  <Badge variant="secondary">{report.market_intelligence.portfolio_balance.superstars}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Rising Stars</span>
                  </div>
                  <Badge variant="secondary">{report.market_intelligence.portfolio_balance.rising_stars}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Cash Cows</span>
                  </div>
                  <Badge variant="secondary">{report.market_intelligence.portfolio_balance.cash_cows}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Dead Weights</span>
                  </div>
                  <Badge variant="destructive">{report.market_intelligence.portfolio_balance.dead_weights}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.market_intelligence.trends.hot_categories.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-orange-900">Hot Categories</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {report.market_intelligence.trends.hot_categories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800">{cat}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {report.market_intelligence.trends.declining_categories.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-900">Declining Categories</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {report.market_intelligence.trends.declining_categories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">{cat}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Risk Factors & Opportunities */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.market_intelligence.risk_factors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Factors
                </div>
                <ul className="space-y-1">
                  {report.market_intelligence.risk_factors.map((risk, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {report.market_intelligence.opportunities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-green-700 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Opportunities
                </div>
                <ul className="space-y-1">
                  {report.market_intelligence.opportunities.map((opp, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* STRATEGIC RECOMMENDATIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.strategic_recommendations.slice(0, 5).map((rec, idx) => (
              <div 
                key={idx}
                className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{
                  borderColor: rec.priority >= 9 ? '#dc2626' : rec.priority >= 7 ? '#f59e0b' : '#3b82f6'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={rec.priority >= 9 ? 'destructive' : rec.priority >= 7 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      Priority {rec.priority}/10
                    </Badge>
                    <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rec.timeline}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{rec.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                
                <div className="bg-blue-50 rounded p-3 mb-3">
                  <div className="text-xs font-bold text-blue-900 mb-2">ACTION STEPS:</div>
                  <ol className="text-sm space-y-1">
                    {rec.action_steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex gap-2">
                        <span className="text-blue-600 font-bold">{stepIdx + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex items-start justify-between text-sm">
                  <div>
                    <div className="text-gray-600">Expected Outcome:</div>
                    <div className="font-medium text-gray-900">{rec.expected_outcome}</div>
                  </div>
                  {rec.estimated_impact && (
                    <div className="text-right">
                      {rec.estimated_impact.revenue_increase && (
                        <div className="text-green-600 font-bold">+{rec.estimated_impact.revenue_increase}</div>
                      )}
                      {rec.estimated_impact.cost_reduction && (
                        <div className="text-blue-600 font-bold">Save {rec.estimated_impact.cost_reduction}</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <div className="text-xs text-gray-600">AI Confidence: <strong>{rec.confidence}%</strong></div>
                  <Progress value={rec.confidence} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PRODUCT INTELLIGENCE - Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Intelligence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show top performers */}
          <div className="space-y-3">
            {report.product_intelligence.slice(0, 10).map((product, idx) => (
              <div 
                key={idx}
                className={`border-2 rounded-lg p-4 ${getClassificationColor(product.classification)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getClassificationIcon(product.classification)}
                    <div>
                      <div className="font-bold">{product.product_name}</div>
                      {product.size && <span className="text-xs opacity-75">Size: {product.size}</span>}
                    </div>
                  </div>
                  <Badge variant="secondary">{product.classification}</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs opacity-75">Revenue</div>
                    <div className="font-bold">Rp {product.revenue.toLocaleString('id-ID')}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Health Score</div>
                    <div className="font-bold">{product.health_score}/100</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Risk Level</div>
                    <div>{getRiskBadge(product.risk_level)}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Priority</div>
                    <div className="font-bold">{product.action_priority}/10</div>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded p-3 mb-2">
                  <div className="text-xs font-bold mb-1">RECOMMENDED ACTION:</div>
                  <div className="text-sm font-medium mb-2">{product.recommended_action}</div>
                  <div className="text-xs">{product.expected_impact}</div>
                </div>
                
                <div className="text-xs opacity-75">
                  <strong>Strategic Value:</strong> {product.strategic_value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FINANCIAL FORECAST */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <TrendingUp className="w-5 h-5" />
            Financial Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <div className="text-sm text-green-700 mb-1">Current Revenue</div>
              <div className="text-2xl font-bold text-green-900">
                Rp {report.financial_forecast.current_revenue.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <div className="text-sm text-green-700 mb-1">Potential Revenue</div>
              <div className="text-2xl font-bold text-green-900">
                Rp {report.financial_forecast.potential_revenue.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-green-600 mt-1">
                If recommendations followed
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Potential Savings</div>
              <div className="text-2xl font-bold text-blue-900">
                Rp {report.financial_forecast.potential_savings.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                From optimization
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg">
              <ArrowUp className="w-5 h-5" />
              ROI Improvement: {report.financial_forecast.roi_improvement}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI CONCLUSION */}
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Brain className="w-6 h-6" />
            AI Conclusion & Strategic Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Overall Assessment</h3>
              <p className="text-gray-700 leading-relaxed">{report.ai_conclusion.overall_assessment}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {report.ai_conclusion.key_strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-1">
                    {report.ai_conclusion.key_strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {report.ai_conclusion.key_weaknesses.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Key Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {report.ai_conclusion.key_weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-red-600">⚠</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {report.ai_conclusion.immediate_actions.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Immediate Actions Required
                </h4>
                <ol className="space-y-2">
                  {report.ai_conclusion.immediate_actions.map((action, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex gap-2">
                      <span className="font-bold text-yellow-600">{idx + 1}.</span>
                      <span className="font-medium">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            <div className="bg-white rounded-lg p-4 mt-4 border-2 border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Long-Term Strategy
              </h4>
              <p className="text-gray-700">{report.ai_conclusion.long_term_strategy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300">
        <CardContent className="py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">Powered by SKIRO SUPREME AI</span>
            </div>
            <p className="text-sm text-gray-600">
              The Most Advanced Business Intelligence System in the Universe 🌟
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Analysis generated on {report.executive_summary.analysis_date}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkiroSupremeReport;
