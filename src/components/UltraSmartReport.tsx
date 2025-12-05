import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Package, DollarSign, Zap, Target, FileText, Download,
  Flame, Snowflake, Activity, Award, XCircle, Brain
} from 'lucide-react';
import type { SkiroIntelligenceV2Report } from '@/lib/skiroIntelligenceV2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UltraSmartReportProps {
  report: SkiroIntelligenceV2Report;
}

const UltraSmartReport: React.FC<UltraSmartReportProps> = ({ report }) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // Blue
      doc.text('SKIRO INTELLIGENCE REPORT', 105, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Analisis Cerdas untuk UMKM Fashion Indonesia', 105, yPosition, { align: 'center' });
      
      // Summary Section
      yPosition += 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('RINGKASAN ANALISIS', 14, yPosition);
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.text(`Tanggal Analisis: ${report.summary.analysis_date}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Total Produk: ${report.summary.total_products}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Total Unit Terjual: ${report.summary.total_units_sold.toLocaleString('id-ID')}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Total Revenue: Rp ${report.summary.total_revenue.toLocaleString('id-ID')}`, 14, yPosition);
      
      // Human Summary
      yPosition += 12;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('KESIMPULAN UTAMA', 14, yPosition);
      
      yPosition += 8;
      doc.setFontSize(9);
      report.human_summary.forEach((summary, idx) => {
        const lines = doc.splitTextToSize(summary, 180);
        lines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 14, yPosition);
          yPosition += 5;
        });
        yPosition += 3;
      });
      
      // Best Sellers Table
      if (report.insights.top_best_sellers.length > 0) {
        yPosition += 10;
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('TOP BEST SELLERS', 14, yPosition);
        
        const bestSellersData = report.insights.top_best_sellers.slice(0, 10).map((item, idx) => [
          (idx + 1).toString(),
          item.product_name,
          item.size || '-',
          item.total_qty.toString(),
          `${item.contribution_percentage.toFixed(1)}%`,
          item.label
        ]);
        
        autoTable(doc, {
          startY: yPosition + 5,
          head: [['#', 'Produk', 'Size', 'Qty', '%', 'Status']],
          body: bestSellersData,
          theme: 'grid',
          headStyles: { fillColor: [34, 197, 94], textColor: 255 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 10 },
            2: { cellWidth: 15 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 30 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Deadstock Candidates Table
      if (report.insights.top_deadstock_candidates.length > 0) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(220, 38, 38); // Red
        doc.text('DEADSTOCK CANDIDATES', 14, yPosition);
        
        const deadstockData = report.insights.top_deadstock_candidates.slice(0, 10).map((item, idx) => [
          (idx + 1).toString(),
          item.product_name,
          item.size || '-',
          item.total_qty.toString(),
          `${item.velocity_score.toFixed(1)}%`,
          'URGENT'
        ]);
        
        autoTable(doc, {
          startY: yPosition + 5,
          head: [['#', 'Produk', 'Size', 'Qty', 'Velocity', 'Status']],
          body: deadstockData,
          theme: 'grid',
          headStyles: { fillColor: [220, 38, 38], textColor: 255 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 10 },
            2: { cellWidth: 15 },
            3: { cellWidth: 20 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Recommendations - NAIKKAN
      if (report.recommendations.increase_stock.length > 0) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(34, 197, 94); // Green
        doc.text('REKOMENDASI: NAIKKAN PRODUKSI', 14, yPosition);
        
        const increaseData = report.recommendations.increase_stock.slice(0, 8).map((rec, idx) => [
          (idx + 1).toString(),
          rec.product_name + (rec.size ? ` (${rec.size})` : ''),
          rec.current_sales.toString(),
          rec.quantitative_target || '-',
          rec.confidence.toUpperCase()
        ]);
        
        autoTable(doc, {
          startY: yPosition + 5,
          head: [['#', 'Produk', 'Sales', 'Target', 'Confidence']],
          body: increaseData,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94], textColor: 255 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 10 },
            2: { cellWidth: 20 },
            4: { cellWidth: 25 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Recommendations - TURUNKAN
      if (report.recommendations.decrease_stock.length > 0) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(220, 38, 38); // Red
        doc.text('REKOMENDASI: TURUNKAN PRODUKSI', 14, yPosition);
        
        const decreaseData = report.recommendations.decrease_stock.slice(0, 8).map((rec, idx) => [
          (idx + 1).toString(),
          rec.product_name + (rec.size ? ` (${rec.size})` : ''),
          rec.current_sales.toString(),
          rec.quantitative_target || '-',
          rec.confidence.toUpperCase()
        ]);
        
        autoTable(doc, {
          startY: yPosition + 5,
          head: [['#', 'Produk', 'Sales', 'Target', 'Confidence']],
          body: decreaseData,
          theme: 'striped',
          headStyles: { fillColor: [220, 38, 38], textColor: 255 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 10 },
            2: { cellWidth: 20 },
            4: { cellWidth: 25 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Size Performance
      if (report.insights.size_performance.length > 0) {
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('PERFORMA PER SIZE', 14, yPosition);
        
        const sizeData = report.insights.size_performance.map(size => [
          size.size,
          size.total_sold.toString(),
          `${size.percentage.toFixed(1)}%`,
          size.status.toUpperCase()
        ]);
        
        autoTable(doc, {
          startY: yPosition + 5,
          head: [['Size', 'Total Sold', 'Percentage', 'Status']],
          body: sizeData,
          theme: 'plain',
          headStyles: { fillColor: [99, 102, 241], textColor: 255 },
          styles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Category Performance
      if (report.insights.category_performance.length > 0) {
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('PERFORMA PER KATEGORI', 14, yPosition);
        
        const categoryData = report.insights.category_performance.map(cat => [
          cat.category,
          cat.total_sold.toString(),
          `Rp ${cat.revenue.toLocaleString('id-ID')}`,
          `${cat.percentage.toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: yPosition + 5,
          head: [['Kategori', 'Total Sold', 'Revenue', 'Percentage']],
          body: categoryData,
          theme: 'plain',
          headStyles: { fillColor: [99, 102, 241], textColor: 255 },
          styles: { fontSize: 9 }
        });
      }
      
      // Add footer on last page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Halaman ${i} dari ${pageCount} | Generated by Skiro Intelligence`,
          105,
          290,
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`skiro-intelligence-report-${report.summary.analysis_date}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal generate PDF. Silakan coba lagi.');
    } finally {
      setGenerating(false);
    }
  };

  const getLabelBadge = (label: string) => {
    switch (label) {
      case 'BEST_SELLER':
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <Award size={12} className="mr-1" /> BEST SELLER
        </Badge>;
      case 'SLOW_MOVER':
        return <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0">
          <Activity size={12} className="mr-1" /> SLOW MOVER
        </Badge>;
      case 'DEADSTOCK_CANDIDATE':
        return <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0">
          <XCircle size={12} className="mr-1" /> DEADSTOCK RISK
        </Badge>;
      default:
        return <Badge variant="outline">NORMAL</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'NAIKKAN_PRODUKSI':
        return <Badge className="bg-green-600 text-white">
          <TrendingUp size={12} className="mr-1" /> NAIKKAN
        </Badge>;
      case 'TURUNKAN_PRODUKSI':
        return <Badge className="bg-red-600 text-white">
          <TrendingDown size={12} className="mr-1" /> TURUNKAN
        </Badge>;
      case 'MONITOR':
        return <Badge className="bg-yellow-600 text-white">
          <AlertTriangle size={12} className="mr-1" /> MONITOR
        </Badge>;
      default:
        return <Badge variant="secondary">MAINTAIN</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return <Badge className={colors[confidence as keyof typeof colors] || colors.low}>
      {confidence.toUpperCase()}
    </Badge>;
  };

  const getSizeStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <Flame className="text-red-500" size={20} />;
      case 'cold':
        return <Snowflake className="text-blue-400" size={20} />;
      default:
        return <Activity className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skiro Ultra Smart Intelligence
          </h2>
          <p className="text-gray-600 mt-1">Analisis cerdas berbasis AI untuk UMKM Fashion Indonesia</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="lg"
            onClick={generatePDF}
            disabled={generating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {generating ? (
              <>
                <Activity size={20} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText size={20} className="mr-2" />
                Download PDF Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Quality & Detection Info Alert */}
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300">
        <AlertDescription className="text-sm">
          <div className="font-semibold mb-3 text-lg text-blue-800">✨ Analisis Berkualitas Tinggi</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-gray-600">Total Produk</div>
              <div className="text-xl font-bold text-blue-600">{report.summary.total_products}</div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-gray-600">Total Unit</div>
              <div className="text-xl font-bold text-green-600">{report.summary.total_units_sold.toLocaleString()}</div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-gray-600">Total Revenue</div>
              <div className="text-lg font-bold text-purple-600">Rp {(report.summary.total_revenue / 1000000).toFixed(1)}jt</div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-gray-600">Avg Price</div>
              <div className="text-lg font-bold text-orange-600">Rp {(report.summary.total_revenue / report.summary.total_units_sold).toLocaleString('id-ID', {maximumFractionDigits: 0})}</div>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-blue-700 bg-blue-100 p-2 rounded">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <strong>Smart Detection Aktif:</strong> Sistem secara otomatis mendeteksi kolom Product, Revenue/Total, dan data lainnya dengan akurasi tinggi. 
              Revenue dihitung dari <strong>total pemasukan aktual</strong> di data penjualan (bukan estimasi price × quantity).
            </div>
          </div>
          <div className="mt-2 flex items-start gap-2 text-green-700 bg-green-50 p-2 rounded">
            <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <strong>Auto-Categorization:</strong> Jika data tidak punya kolom kategori, sistem otomatis mengelompokkan produk berdasarkan kemiripan nama produk (AI Smart Grouping).
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            💡 Tip: Buka Console Browser (F12) untuk melihat detail logging analisis data
          </div>
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.summary.total_products}</div>
            <p className="text-xs opacity-75 mt-1">{report.summary.total_records} records analyzed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.summary.total_units_sold.toLocaleString()}</div>
            <p className="text-xs opacity-75 mt-1">units terjual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {report.summary.total_revenue.toLocaleString('id-ID')}</div>
            <p className="text-xs opacity-75 mt-1">omzet penjualan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Analysis Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.summary.analysis_date}</div>
            <p className="text-xs opacity-75 mt-1">tanggal analisis</p>
          </CardContent>
        </Card>
      </div>

      {/* Human Summary - Most Important */}
      <Card className="border-4 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap size={28} />
            📋 Ringkasan Eksekutif
          </CardTitle>
          <p className="text-sm opacity-90 mt-2">Insight paling penting dalam bahasa yang mudah dipahami</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {report.human_summary.map((summary, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-800 text-base leading-relaxed">{summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NAIKKAN PRODUKSI */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <TrendingUp size={24} />
              📈 NAIKKAN PRODUKSI
            </CardTitle>
            <p className="text-sm text-green-700 mt-1">
              Produk dengan demand tinggi - tambah stok segera!
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {report.recommendations.increase_stock.slice(0, 5).map((rec, idx) => {
                const productLabel = rec.size ? `${rec.product_name} (Size ${rec.size})` : rec.product_name;
                return (
                <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900 text-base">{productLabel}</h4>
                      {rec.category && <p className="text-xs text-gray-600 mt-1">🏷️ {rec.category}</p>}
                    </div>
                    {getConfidenceBadge(rec.confidence)}
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="text-gray-700">
                      <strong>Current Sales:</strong> {rec.current_sales} unit
                    </p>
                    <p className="text-green-700">
                      <strong>Target:</strong> {rec.quantitative_target}
                    </p>
                    <p className="text-gray-600 text-xs">{rec.reason}</p>
                    <Alert className="mt-2 bg-green-100 border-green-300">
                      <AlertDescription className="text-xs text-green-800">
                        <strong>Impact:</strong> {rec.expected_impact}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              );
              })}
            </div>
          </CardContent>
        </Card>

        {/* TURUNKAN PRODUKSI */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <TrendingDown size={24} />
              📉 TURUNKAN PRODUKSI
            </CardTitle>
            <p className="text-sm text-red-700 mt-1">
              Produk berisiko deadstock - kurangi atau stop produksi!
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {report.recommendations.decrease_stock.slice(0, 5).map((rec, idx) => {
                const productLabel = rec.size ? `${rec.product_name} (Size ${rec.size})` : rec.product_name;
                return (
                <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900 text-base">{productLabel}</h4>
                      {rec.category && <p className="text-xs text-gray-600 mt-1">🏷️ {rec.category}</p>}
                    </div>
                    {getConfidenceBadge(rec.confidence)}
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="text-gray-700">
                      <strong>Current Sales:</strong> {rec.current_sales} unit (RENDAH!)
                    </p>
                    <p className="text-red-700">
                      <strong>Target:</strong> {rec.quantitative_target}
                    </p>
                    <p className="text-gray-600 text-xs">{rec.reason}</p>
                    <Alert className="mt-2 bg-red-100 border-red-300">
                      <AlertDescription className="text-xs text-red-800">
                        <strong>Impact:</strong> {rec.expected_impact}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Sellers & Deadstock Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <Award size={24} />
              🏆 TOP BEST SELLERS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {report.insights.top_best_sellers.slice(0, 8).map((product, idx) => {
                const productLabel = product.size ? `${product.product_name} (Size ${product.size})` : product.product_name;
                return (
                <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-base">{productLabel}</h5>
                      <p className="text-xs text-gray-500 mt-1">{product.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700 text-lg">{product.total_qty}</div>
                    <div className="text-xs text-gray-600">unit</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      {product.contribution_percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Deadstock Candidates */}
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle size={24} />
              🚨 DEADSTOCK CANDIDATES
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {report.insights.top_deadstock_candidates.slice(0, 8).map((product, idx) => {
                const productLabel = product.size ? `${product.product_name} (Size ${product.size})` : product.product_name;
                return (
                <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-bold">
                      ⚠️
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-base">{productLabel}</h5>
                      <p className="text-xs text-red-600 mt-1">{product.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-700 text-lg">{product.total_qty}</div>
                    <div className="text-xs text-gray-600">unit</div>
                    <Badge className="mt-1 bg-red-600 text-white text-xs">
                      URGENT
                    </Badge>
                  </div>
                </div>
              );
              })}
              {report.insights.top_deadstock_candidates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
                  <p>✅ Tidak ada produk berisiko deadstock!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Size Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={24} />
            📏 Performa Per Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {report.insights.size_performance.map((size, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-2 ${
                size.status === 'hot' ? 'bg-red-50 border-red-300' :
                size.status === 'cold' ? 'bg-blue-50 border-blue-300' :
                'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{size.size}</span>
                  {getSizeStatusIcon(size.status)}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-700">{size.total_sold} unit</div>
                  <div className="text-xs text-gray-600">{size.percentage.toFixed(1)}%</div>
                </div>
                <Badge className={`mt-2 text-xs ${
                  size.status === 'hot' ? 'bg-red-500' :
                  size.status === 'cold' ? 'bg-blue-500' :
                  'bg-gray-500'
                } text-white`}>
                  {size.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={24} />
            🎯 Performa Per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.insights.category_performance.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{cat.category}</h5>
                    <p className="text-xs text-gray-600">
                      {cat.total_sold} unit | Rp {cat.revenue.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{cat.percentage.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">kontribusi</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-700">📝 Catatan & Asumsi</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.notes.map((note, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UltraSmartReport;
