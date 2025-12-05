export interface SalesAnalytics {
  totalRevenue: number;
  totalUnits: number;
  productCount: number;
  averagePrice: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  bottomProducts: Array<{ name: string; quantity: number; revenue: number }>;
  sizeDistribution: Array<{ size: string; count: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; units: number }>;
}

export function analyzeCSVData(data: any[]): SalesAnalytics {
  if (!data || data.length === 0) {
    throw new Error('No data to analyze');
  }

  // Detect columns
  const headers = Object.keys(data[0]);
  
  const productCol = headers.find(h => 
    h.toLowerCase().includes('product') || 
    h.toLowerCase().includes('nama') ||
    h.toLowerCase().includes('item')
  );
  
  const quantityCol = headers.find(h => 
    h.toLowerCase().includes('quantity') || 
    h.toLowerCase().includes('qty') ||
    h.toLowerCase().includes('jumlah')
  );
  
  const priceCol = headers.find(h => 
    h.toLowerCase().includes('price') || 
    h.toLowerCase().includes('harga')
  );
  
  const revenueCol = headers.find(h => 
    h.toLowerCase().includes('revenue') || 
    h.toLowerCase().includes('total') ||
    h.toLowerCase().includes('amount')
  );
  
  const sizeCol = headers.find(h => 
    h.toLowerCase().includes('size') || 
    h.toLowerCase().includes('ukuran')
  );
  
  const dateCol = headers.find(h => 
    h.toLowerCase().includes('date') || 
    h.toLowerCase().includes('tanggal') ||
    h.toLowerCase().includes('bulan')
  );

  if (!productCol || !quantityCol) {
    throw new Error('Cannot find product and quantity columns');
  }

  // Calculate metrics
  let totalRevenue = 0;
  let totalUnits = 0;
  const productMap = new Map<string, { quantity: number; revenue: number }>();
  const sizeMap = new Map<string, number>();
  const monthlyMap = new Map<string, { revenue: number; units: number }>();

  data.forEach(row => {
    const product = String(row[productCol] || '').trim();
    const quantity = Number(row[quantityCol]) || 0;
    const price = priceCol ? Number(row[priceCol]) || 0 : 0;
    const revenue = revenueCol ? Number(row[revenueCol]) || 0 : price * quantity;
    const size = sizeCol ? String(row[sizeCol] || '') : '';
    const month = dateCol ? String(row[dateCol] || '').substring(0, 7) : '';

    if (product && quantity > 0) {
      totalUnits += quantity;
      totalRevenue += revenue;

      // Product analysis
      if (!productMap.has(product)) {
        productMap.set(product, { quantity: 0, revenue: 0 });
      }
      const prod = productMap.get(product)!;
      prod.quantity += quantity;
      prod.revenue += revenue;

      // Size distribution
      if (size) {
        sizeMap.set(size, (sizeMap.get(size) || 0) + 1);
      }

      // Monthly trend
      if (month) {
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { revenue: 0, units: 0 });
        }
        const monthly = monthlyMap.get(month)!;
        monthly.revenue += revenue;
        monthly.units += quantity;
      }
    }
  });

  // Process products
  const sortedProducts = Array.from(productMap.entries())
    .map(([name, { quantity, revenue }]) => ({ name, quantity, revenue }))
    .sort((a, b) => b.quantity - a.quantity);

  const topProducts = sortedProducts.slice(0, 5);
  const bottomProducts = sortedProducts.slice(-5).reverse();

  // Process size distribution
  const sizeDistribution = Array.from(sizeMap.entries())
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.count - a.count);

  // Process monthly trends
  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, { revenue, units }]) => ({ month, revenue, units }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalRevenue,
    totalUnits,
    productCount: productMap.size,
    averagePrice: totalUnits > 0 ? totalRevenue / totalUnits : 0,
    topProducts,
    bottomProducts,
    sizeDistribution,
    monthlyTrend,
  };
}
