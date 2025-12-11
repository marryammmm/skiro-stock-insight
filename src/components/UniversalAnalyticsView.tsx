import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UniversalAnalyticsViewProps {
  summary: any;
  insights: string[];
  rawData: any[];
  conclusion: string | null;
  salesAnalytics?: any;
}

interface SalesAnalytics {
  totalRevenue: number;
  totalUnits: number;
  productCount: number;
  averagePrice: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  bottomProducts: Array<{ name: string; quantity: number; revenue: number }>;
  sizeDistribution: Array<{ size: string; count: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; units: number }>;
}

const UniversalAnalyticsView: React.FC<UniversalAnalyticsViewProps> = ({
  summary,
  insights,
  rawData,
  conclusion,
  salesAnalytics,
}) => {
  const contentTypeLabels: Record<string, string> = {
    sales: '📊 Data Penjualan',
    inventory: '📦 Data Inventaris',
    customer: '👥 Data Pelanggan',
    financial: '💰 Data Keuangan',
    employee: '👔 Data Karyawan',
    timeseries: '📈 Deret Waktu',
    generic: '📋 Data Umum',
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Smart Conclusion Card */}
      {conclusion && (
        <Card className="border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">✨ Kesimpulan Analisis Cerdas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 leading-relaxed">
            <div className="prose prose-sm max-w-none">
              {conclusion.split('\n\n').map((paragraph, idx) => (
                <div key={idx} className="mb-4">
                  {paragraph.includes('###') ? (
                    <>
                      {paragraph.split('\n').map((line, lineIdx) => (
                        <div key={lineIdx}>
                          {line.startsWith('###') ? (
                            <h4 className="font-bold text-blue-900 mt-3 mb-2">{line.replace('###', '').trim()}</h4>
                          ) : line.startsWith('##') ? (
                            <h3 className="font-bold text-lg text-blue-900 mb-2">{line.replace('##', '').trim()}</h3>
                          ) : line.startsWith('-') ? (
                            <div className="ml-4 text-gray-700">• {line.replace('-', '').trim()}</div>
                          ) : line ? (
                            <p className="text-gray-700">{line}</p>
                          ) : null}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-700">{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales Analytics Section (if available) */}
      {salesAnalytics && (
        <div className="space-y-6">
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">📈 Metrik Penjualan Terperinci</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-600">
                    Rp {Math.round(salesAnalytics.totalRevenue).toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Total Units</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {salesAnalytics.totalUnits.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Produk Unik</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {salesAnalytics.productCount}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Rata-rata Harga</div>
                  <div className="text-2xl font-bold text-orange-600">
                    Rp {Math.round(salesAnalytics.averagePrice).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              
              {/* Size Distribution Chart */}
              {salesAnalytics.sizeDistribution && salesAnalytics.sizeDistribution.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-4">📊 Distribusi Ukuran</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesAnalytics.sizeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="size" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Monthly Trends Chart */}
              {salesAnalytics.monthlyTrend && salesAnalytics.monthlyTrend.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-4">📈 Tren Bulanan</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesAnalytics.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#ef4444" name="Revenue" />
                      <Line type="monotone" dataKey="units" stroke="#3b82f6" name="Units" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Data Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600">Content Type</div>
              <div className="text-sm sm:text-lg font-bold text-blue-600 break-words">
                {contentTypeLabels[summary.contentType] || summary.contentType}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600">Confidence</div>
              <div className="text-sm sm:text-lg font-bold text-purple-600">
                {(summary.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600">Rows</div>
              <div className="text-sm sm:text-lg font-bold text-green-600">
                {summary.rowCount.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600">Columns</div>
              <div className="text-sm sm:text-lg font-bold text-orange-600">{summary.columnCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.map((insight, idx) => (
              <Alert key={idx}>
                <AlertDescription className="text-xs sm:text-sm">{insight}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Column Details */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Column Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b sticky top-0 bg-white z-10">
                  <th className="text-left py-2 px-2">Column Name</th>
                  <th className="text-left py-2 px-2">Type</th>
                  <th className="text-left py-2 px-2">Unique</th>
                  <th className="text-left py-2 px-2">Null Count</th>
                </tr>
              </thead>
              <tbody>
                {summary.columns.map((col: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 font-semibold break-words">{col.name}</td>
                    <td className="py-2 px-2">
                      <Badge variant="secondary">{col.type}</Badge>
                    </td>
                    <td className="py-2 px-2">{col.uniqueCount}</td>
                    <td className="py-2 px-2">{col.nullCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalAnalyticsView;
