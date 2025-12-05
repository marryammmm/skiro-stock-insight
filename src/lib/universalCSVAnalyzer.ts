import Papa from 'papaparse';

// Types for analysis
export interface CSVColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sampleValues: any[];
  uniqueCount: number;
  nullCount: number;
}

export interface CSVContentSummary {
  contentType: 'sales' | 'inventory' | 'customer' | 'financial' | 'employee' | 'timeseries' | 'generic';
  confidence: number;
  rowCount: number;
  columnCount: number;
  columns: CSVColumn[];
  metrics: Record<string, any>;
}

export interface AnalysisResult {
  data: any[];
  summary: CSVContentSummary;
  insights: string[];
  conclusion: string;
}

// Detect column types
function detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';
  
  const booleanCount = nonNullValues.filter(v => 
    v === true || v === false || v === 'true' || v === 'false' || v === 'yes' || v === 'no'
  ).length;
  
  if (booleanCount / nonNullValues.length > 0.8) return 'boolean';
  
  const numberCount = nonNullValues.filter(v => !isNaN(Number(v)) && v !== '').length;
  if (numberCount / nonNullValues.length > 0.8) return 'number';
  
  const datePattern = /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}|^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}/;
  const dateCount = nonNullValues.filter(v => datePattern.test(String(v))).length;
  if (dateCount / nonNullValues.length > 0.6) return 'date';
  
  return 'string';
}

// Analyze columns
function analyzeColumns(data: any[]): CSVColumn[] {
  if (data.length === 0) return [];
  
  const headers = Object.keys(data[0]);
  return headers.map(header => {
    const values = data.map(row => row[header]);
    const nonNullCount = values.filter(v => v !== null && v !== undefined && v !== '').length;
    
    return {
      name: header,
      type: detectColumnType(values),
      sampleValues: values.slice(0, 3),
      uniqueCount: new Set(values.map(v => String(v))).size,
      nullCount: values.length - nonNullCount,
    };
  });
}

// Detect content type based on column names and data patterns
export function detectContentType(columns: CSVColumn[], data: any[]): { type: string; confidence: number } {
  const columnNames = columns.map(c => c.name.toLowerCase());
  const columnStr = columnNames.join(' ');
  
  // Sales pattern
  const salesKeywords = ['product', 'quantity', 'price', 'revenue', 'sales', 'amount', 'unit', 'sold'];
  const salesScore = salesKeywords.reduce((score, keyword) => 
    score + (columnStr.includes(keyword) ? 1 : 0), 0
  );
  
  // Inventory pattern
  const inventoryKeywords = ['stock', 'inventory', 'warehouse', 'sku', 'quantity', 'reorder'];
  const inventoryScore = inventoryKeywords.reduce((score, keyword) => 
    score + (columnStr.includes(keyword) ? 1 : 0), 0
  );
  
  // Customer pattern
  const customerKeywords = ['customer', 'client', 'name', 'email', 'phone', 'address', 'city'];
  const customerScore = customerKeywords.reduce((score, keyword) => 
    score + (columnStr.includes(keyword) ? 1 : 0), 0
  );
  
  // Financial pattern
  const financialKeywords = ['transaction', 'amount', 'revenue', 'expense', 'balance', 'account', 'payment'];
  const financialScore = financialKeywords.reduce((score, keyword) => 
    score + (columnStr.includes(keyword) ? 1 : 0), 0
  );
  
  // Employee pattern
  const employeeKeywords = ['employee', 'staff', 'salary', 'department', 'position', 'hire'];
  const employeeScore = employeeKeywords.reduce((score, keyword) => 
    score + (columnStr.includes(keyword) ? 1 : 0), 0
  );
  
  const scores = [
    { type: 'sales', score: salesScore },
    { type: 'inventory', score: inventoryScore },
    { type: 'customer', score: customerScore },
    { type: 'financial', score: financialScore },
    { type: 'employee', score: employeeScore },
  ];
  
  scores.sort((a, b) => b.score - a.score);
  const topScore = scores[0];
  
  if (topScore.score > 0) {
    return { type: topScore.type, confidence: Math.min(topScore.score / 5, 1) };
  }
  
  return { type: 'generic', confidence: 0 };
}

// Generate smart conclusion with product analysis
export function generateSmartConclusion(summary: CSVContentSummary, data: any[]): string {
  const contentType = summary.contentType;
  const rowCount = summary.rowCount;
  
  let conclusion = '';
  
  if (contentType === 'sales') {
    // Detect product, quantity, price columns
    const productColumn = summary.columns.find(c => 
      c.name.toLowerCase().includes('product') || 
      c.name.toLowerCase().includes('nama') ||
      c.name.toLowerCase().includes('item')
    );
    const quantityColumn = summary.columns.find(c => 
      c.name.toLowerCase().includes('quantity') || 
      c.name.toLowerCase().includes('qty') ||
      c.name.toLowerCase().includes('jumlah')
    );
    const priceColumn = summary.columns.find(c => 
      c.name.toLowerCase().includes('price') || 
      c.name.toLowerCase().includes('harga') ||
      c.name.toLowerCase().includes('amount')
    );
    const revenueColumn = summary.columns.find(c => 
      c.name.toLowerCase().includes('revenue') || 
      c.name.toLowerCase().includes('total')
    );
    
    // Calculate total sales
    let totalRevenue = 0;
    let totalQuantity = 0;
    
    if (quantityColumn) {
      totalQuantity = data.reduce((sum, row) => sum + (Number(row[quantityColumn.name]) || 0), 0);
    }
    
    if (revenueColumn) {
      totalRevenue = data.reduce((sum, row) => sum + (Number(row[revenueColumn.name]) || 0), 0);
    } else if (priceColumn && quantityColumn) {
      totalRevenue = data.reduce((sum, row) => 
        sum + ((Number(row[priceColumn.name]) || 0) * (Number(row[quantityColumn.name]) || 0)), 0
      );
    }
    
    // Calculate product rankings
    const productSales = new Map<string, { quantity: number; revenue: number }>();
    
    data.forEach(row => {
      if (productColumn && quantityColumn) {
        const product = String(row[productColumn.name] || '').trim();
        const qty = Number(row[quantityColumn.name]) || 0;
        const price = Number(row[priceColumn?.name]) || 0;
        const revenue = price * qty || Number(row[revenueColumn?.name]) || 0;
        
        if (product && qty > 0) {
          const existing = productSales.get(product) || { quantity: 0, revenue: 0 };
          productSales.set(product, {
            quantity: existing.quantity + qty,
            revenue: existing.revenue + revenue,
          });
        }
      }
    });
    
    const sorted = Array.from(productSales.entries())
      .sort((a, b) => b[1].quantity - a[1].quantity);
    
    const topProducts = sorted.slice(0, 3);
    const bottomProducts = sorted.slice(-3).reverse();
    
    const totalProducts = sorted.length;
    const avgRevenuePerTransaction = totalRevenue / Math.max(rowCount, 1);
    
    conclusion = `## 📊 Kesimpulan Analisis Penjualan\n\n`;
    conclusion += `Dari total ${rowCount.toLocaleString('id-ID')} transaksi yang dianalisis, sistem mengidentifikasi **${totalProducts} produk unik** `;
    conclusion += `dengan total penjualan sebanyak **${totalQuantity.toLocaleString('id-ID')} unit** dan revenue mencapai **Rp ${totalRevenue.toLocaleString('id-ID')}**. `;
    conclusion += `Rata-rata nilai transaksi mencapai **Rp ${Math.round(avgRevenuePerTransaction).toLocaleString('id-ID')} per transaksi**.\n\n`;
    
    if (topProducts.length > 0) {
      conclusion += `### 🏆 Produk Terlaris (Top 3):\n\n`;
      topProducts.forEach((product, idx) => {
        const percentage = ((product[1].quantity / totalQuantity) * 100).toFixed(1);
        conclusion += `${idx + 1}. **${product[0]}** - ${product[1].quantity.toLocaleString('id-ID')} unit (${percentage}%) dengan revenue Rp ${Math.round(product[1].revenue).toLocaleString('id-ID')}\n`;
      });
      conclusion += '\n';
    }
    
    if (bottomProducts.length > 0) {
      conclusion += `### ⚠️ Produk dengan Penjualan Rendah (Bottom 3):\n\n`;
      bottomProducts.forEach((product, idx) => {
        const percentage = ((product[1].quantity / totalQuantity) * 100).toFixed(1);
        conclusion += `${idx + 1}. **${product[0]}** - ${product[1].quantity.toLocaleString('id-ID')} unit (${percentage}%) dengan revenue Rp ${Math.round(product[1].revenue).toLocaleString('id-ID')}\n`;
      });
      conclusion += '\n';
    }
    
    conclusion += `### 💡 Rekomendasi Bisnis:\n\n`;
    if (topProducts.length > 0) {
      conclusion += `- **Fokus pada produk terlaris**: Produk "${topProducts[0][0]}" merupakan pendorong utama penjualan. Pertahankan stok dan promosi khusus untuk kategori ini.\n`;
    }
    if (bottomProducts.length > 0) {
      conclusion += `- **Review produk lambat**: Produk "${bottomProducts[0][0]}" memiliki performa rendah. Pertimbangkan untuk promosi khusus, reposisi, atau penggantian.\n`;
    }
    conclusion += `- **Diversifikasi**: Tingkatkan marketing untuk produk dengan performa menengah untuk meningkatkan market share.\n`;
    
  } else if (contentType === 'customer') {
    const segments = new Map<string, number>();
    conclusion = `## 👥 Analisis Data Pelanggan\n\n`;
    conclusion += `Dataset ini berisi informasi tentang **${rowCount.toLocaleString('id-ID')} pelanggan** dengan **${summary.columnCount} atribut** per record. `;
    conclusion += `Data pelanggan menunjukkan diversitas yang baik dengan analisis menyeluruh.\n\n`;
    conclusion += `### 📈 Statistik Umum:\n\n- Total Pelanggan: ${rowCount.toLocaleString('id-ID')}\n`;
    conclusion += `- Kolom Data: ${summary.columnCount}\n`;
    conclusion += `- Tingkat Kelengkapan Data: ${(((rowCount * summary.columnCount - summary.metrics.nullCount) / (rowCount * summary.columnCount)) * 100).toFixed(1)}%\n\n`;
    
  } else if (contentType === 'financial') {
    const amountColumn = summary.columns.find(c => 
      c.name.toLowerCase().includes('amount') || 
      c.name.toLowerCase().includes('jumlah') ||
      c.name.toLowerCase().includes('value')
    );
    
    let totalAmount = 0;
    if (amountColumn) {
      totalAmount = data.reduce((sum, row) => sum + (Number(row[amountColumn.name]) || 0), 0);
    }
    
    conclusion = `## 💰 Kesimpulan Analisis Keuangan\n\n`;
    conclusion += `Analisis mencakup **${rowCount.toLocaleString('id-ID')} transaksi keuangan** dengan total nilai **Rp ${Math.round(totalAmount).toLocaleString('id-ID')}**. `;
    conclusion += `Rata-rata transaksi mencapai **Rp ${Math.round(totalAmount / Math.max(rowCount, 1)).toLocaleString('id-ID')}**.\n\n`;
    
  } else if (contentType === 'timeseries') {
    const dateColumn = summary.columns.find(c => c.type === 'date');
    conclusion = `## 📅 Analisis Data Deret Waktu\n\n`;
    conclusion += `Dataset ini berisi **${rowCount.toLocaleString('id-ID')} catatan** data temporal yang tersebar dalam waktu tertentu. `;
    if (dateColumn) {
      conclusion += `Kolom tanggal utama: **${dateColumn.name}**. `;
    }
    conclusion += `Data ini cocok untuk analisis tren dan forecasting.\n\n`;
    
  } else {
    conclusion = `## 📋 Analisis Dataset\n\n`;
    conclusion += `Dataset ini berisi **${rowCount.toLocaleString('id-ID')} baris data** dengan **${summary.columnCount} kolom**. `;
    conclusion += `Tingkat kelengkapan data mencapai ${(((rowCount * summary.columnCount - summary.metrics.nullCount) / (rowCount * summary.columnCount)) * 100).toFixed(1)}%.\n\n`;
  }
  
  return conclusion;
}

// Generate universal insights
export function generateUniversalInsights(summary: CSVContentSummary, data: any[]): string[] {
  const insights: string[] = [];
  
  // Data quality insight
  const totalCells = summary.rowCount * summary.columnCount;
  const dataCompleteness = ((totalCells - summary.metrics.nullCount) / totalCells) * 100;
  insights.push(`Data Quality: ${dataCompleteness.toFixed(1)}% complete dengan ${summary.metrics.nullCount} missing values`);
  
  // Column diversity
  const stringCols = summary.columns.filter(c => c.type === 'string').length;
  const numberCols = summary.columns.filter(c => c.type === 'number').length;
  insights.push(`Structure: ${numberCols} numeric columns, ${stringCols} text columns`);
  
  // Uniqueness insight
  const highUniquenessCols = summary.columns.filter(c => c.uniqueCount > summary.rowCount * 0.8);
  if (highUniquenessCols.length > 0) {
    insights.push(`High Cardinality: ${highUniquenessCols.map(c => c.name).join(', ')} have high uniqueness`);
  }
  
  return insights;
}

// Main analysis function
export async function parseAndAnalyzeCSV(file: File): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.data.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        // Clean data
        const data = results.data
          .filter((row: any) => Object.values(row).some(v => v !== null && v !== ''))
          .slice(0, -1); // Remove empty last row if exists
        
        if (data.length === 0) {
          reject(new Error('No valid data found in CSV'));
          return;
        }
        
        // Analyze structure
        const columns = analyzeColumns(data);
        
        // Calculate metrics
        let nullCount = 0;
        data.forEach(row => {
          Object.values(row).forEach(val => {
            if (val === null || val === undefined || val === '') nullCount++;
          });
        });
        
        // Detect content type
        const { type, confidence } = detectContentType(columns, data);
        
        const summary: CSVContentSummary = {
          contentType: type as any,
          confidence,
          rowCount: data.length,
          columnCount: columns.length,
          columns,
          metrics: { nullCount },
        };
        
        // Generate insights and conclusion
        const insights = generateUniversalInsights(summary, data);
        const conclusion = generateSmartConclusion(summary, data);
        
        resolve({
          data,
          summary,
          insights,
          conclusion,
        });
      },
      error: (error) => reject(error),
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });
  });
}
