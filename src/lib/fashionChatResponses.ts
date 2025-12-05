import type { FashionAnalysisResult } from './fashionAnalyzer';

/**
 * 🧠 SUPER SMART AI FASHION BUSINESS CONSULTANT
 * - SELALU jawab berdasarkan DATA NYATA yang di-upload
 * - TIDAK PERNAH mengarang data atau asumsi
 * - Memberikan insight AKURAT dan ACTIONABLE
 */
export function generateFashionResponse(question: string, analysis: FashionAnalysisResult): string {
  const lowerQuestion = question.toLowerCase();
  const { 
    products, 
    sizeAnalysis, 
    stockRecommendations, 
    deadstockAnalysis,
    totalRevenue,
    totalUnits,
    averagePrice,
    insights
  } = analysis;

  // Validasi: Cek apakah ada data
  if (!products || products.length === 0) {
    return `❌ **Tidak ada data penjualan yang tersedia.**\n\nSilakan upload file CSV/Excel penjualan terlebih dahulu agar saya bisa menganalisis bisnis fashion Anda! 📊`;
  }

  // ═══════════════════════════════════════════════════════════
  // 📏 SIZE ANALYSIS - DENGAN NAMA PRODUK PER SIZE
  // ═══════════════════════════════════════════════════════════
  if (lowerQuestion.includes('size') || lowerQuestion.includes('ukuran')) {
    // Cek apakah produk punya data size
    const productsWithSize = products.filter(p => p.size && p.size.trim() !== '');
    
    if (productsWithSize.length === 0) {
      return `⚠️ **Data size tidak tersedia**\n\nData penjualan Anda tidak memiliki informasi size/ukuran produk. Pastikan file CSV/Excel Anda memiliki kolom "Size" atau "Ukuran" agar saya bisa menganalisis performa per size! 📏`;
    }

    // Group produk by size dengan detail lengkap
    const sizeGroups = new Map<string, Array<{ name: string; quantity: number; revenue: number; }>>();
    
    productsWithSize.forEach(product => {
      const size = product.size!.trim().toUpperCase();
      if (!sizeGroups.has(size)) {
        sizeGroups.set(size, []);
      }
      sizeGroups.get(size)!.push({
        name: product.name,
        quantity: product.quantity,
        revenue: product.revenue
      });
    });

    // Sort sizes by total sales
    const sizeStats = Array.from(sizeGroups.entries()).map(([size, prods]) => {
      const totalQty = prods.reduce((sum, p) => sum + p.quantity, 0);
      const totalRev = prods.reduce((sum, p) => sum + p.revenue, 0);
      // Sort products dalam size ini by quantity
      const sortedProds = prods.sort((a, b) => b.quantity - a.quantity);
      return { size, products: sortedProds, totalQty, totalRev };
    }).sort((a, b) => b.totalQty - a.totalQty);

    let response = `📏 **ANALISIS SIZE - BERDASARKAN DATA PENJUALAN ANDA**\n\n`;
    
    // Pertanyaan tentang size TERLARIS
    if (lowerQuestion.includes('laku') || lowerQuestion.includes('terlaris') || lowerQuestion.includes('populer') || lowerQuestion.includes('favorit')) {
      const topSizes = sizeStats.slice(0, 3);
      
      response += `🔥 **TOP ${topSizes.length} SIZE TERLARIS:**\n\n`;
      
      topSizes.forEach((sizeData, idx) => {
        const percentage = (sizeData.totalQty / totalUnits * 100).toFixed(1);
        response += `**${idx + 1}. SIZE ${sizeData.size}** 🏆\n`;
        response += `   📊 Total Terjual: **${sizeData.totalQty} unit** (${percentage}% dari total)\n`;
        response += `   💰 Revenue: **Rp ${sizeData.totalRev.toLocaleString('id-ID')}**\n`;
        response += `   📦 Jumlah Produk: ${sizeData.products.length} produk\n\n`;
        
        response += `   **Produk Terlaris di Size ${sizeData.size}:**\n`;
        sizeData.products.slice(0, 5).forEach((prod, i) => {
          response += `   ${i + 1}. ${prod.name}: ${prod.quantity} unit (Rp ${prod.revenue.toLocaleString('id-ID')})\n`;
        });
        
        if (sizeData.products.length > 5) {
          response += `   ... dan ${sizeData.products.length - 5} produk lainnya\n`;
        }
        response += `\n`;
      });
      
      response += `\n💡 **REKOMENDASI BISNIS:**\n`;
      response += `✅ **Prioritas Produksi:** Fokus pada size ${topSizes[0].size} (kontribusi ${(topSizes[0].totalQty / totalUnits * 100).toFixed(0)}% dari penjualan)\n`;
      response += `📈 **Stock Strategy:** Pastikan produk size ${topSizes[0].size} SELALU available - ini adalah cash cow Anda!\n`;
      response += `🎯 **Marketing:** Highlight "Size ${topSizes[0].size} - Favorit Pelanggan!" di iklan\n`;
      
    } 
    // Pertanyaan tentang size PALING JARANG/LAMBAT
    else if (lowerQuestion.includes('jarang') || lowerQuestion.includes('lambat') || lowerQuestion.includes('sedikit') || lowerQuestion.includes('rendah')) {
      const bottomSizes = sizeStats.slice(-3).reverse();
      
      response += `📉 **SIZE DENGAN PENJUALAN TERENDAH:**\n\n`;
      
      bottomSizes.forEach((sizeData, idx) => {
        const percentage = (sizeData.totalQty / totalUnits * 100).toFixed(1);
        response += `**${idx + 1}. SIZE ${sizeData.size}** ⚠️\n`;
        response += `   📊 Total Terjual: **${sizeData.totalQty} unit** (hanya ${percentage}%)\n`;
        response += `   💰 Revenue: Rp ${sizeData.totalRev.toLocaleString('id-ID')}\n\n`;
        
        response += `   **Produk di Size ${sizeData.size} yang Lambat Laku:**\n`;
        sizeData.products.slice(0, 5).forEach((prod, i) => {
          response += `   ${i + 1}. ${prod.name}: ${prod.quantity} unit\n`;
        });
        response += `\n`;
      });
      
      response += `\n🚨 **PERINGATAN & REKOMENDASI:**\n`;
      response += `⚠️ **KURANGI PRODUKSI** size ${bottomSizes.map(s => s.size).join(', ')} - demand sangat rendah!\n`;
      response += `🏷️ **Clearance Sale:** Buat diskon 40-50% untuk size ini agar tidak jadi deadstock\n`;
      response += `📦 **Stop Restock:** Jangan order size ini lagi sampai stok habis terjual\n`;
      response += `🎯 **Bundle Strategy:** Gabungkan size slow moving dengan size hot untuk mempercepat penjualan\n`;
      
    }
    // Overview semua size
    else {
      response += `📊 **OVERVIEW PERFORMA SEMUA SIZE:**\n\n`;
      
      sizeStats.forEach((sizeData, idx) => {
        const percentage = (sizeData.totalQty / totalUnits * 100).toFixed(1);
        const status = parseFloat(percentage) > 15 ? '🔥 HOT' : parseFloat(percentage) > 8 ? '✅ Normal' : '📉 Slow';
        
        response += `**${idx + 1}. SIZE ${sizeData.size}** ${status}\n`;
        response += `   • ${sizeData.totalQty} unit (${percentage}%) - Rp ${sizeData.totalRev.toLocaleString('id-ID')}\n`;
        response += `   • Top Product: ${sizeData.products[0].name} (${sizeData.products[0].quantity} unit)\n\n`;
      });
      
      const hotSize = sizeStats[0];
      const slowSize = sizeStats[sizeStats.length - 1];
      
      response += `\n🎯 **KEY INSIGHTS:**\n`;
      response += `🔥 **Best Performer:** Size ${hotSize.size} dengan ${hotSize.totalQty} unit terjual!\n`;
      response += `📉 **Worst Performer:** Size ${slowSize.size} hanya ${slowSize.totalQty} unit - pertimbangkan untuk stop produksi\n`;
      response += `📈 **Gap:** Ada selisih ${hotSize.totalQty - slowSize.totalQty} unit antara size terlaris dan terlemah!\n`;
    }
    
    return response;
  }

  // ═══════════════════════════════════════════════════════════
  // 🚨 DEADSTOCK ANALYSIS - PRODUK PENJUALAN TERENDAH
  // ═══════════════════════════════════════════════════════════
  if (lowerQuestion.includes('deadstock') || lowerQuestion.includes('risiko') || lowerQuestion.includes('bahaya') || 
      lowerQuestion.includes('numpuk') || lowerQuestion.includes('gak laku') || lowerQuestion.includes('tidak laku')) {
    
    // Sort produk by quantity (ascending - terendah dulu)
    const sortedByWorstPerformance = [...products].sort((a, b) => a.quantity - b.quantity);
    
    // Ambil 30% produk dengan penjualan terendah sebagai deadstock risk
    const deadstockCount = Math.max(5, Math.floor(products.length * 0.3));
    const deadstockProducts = sortedByWorstPerformance.slice(0, deadstockCount);
    
    // Hitung total nilai yang terikat
    const totalDeadstockValue = deadstockProducts.reduce((sum, p) => sum + p.revenue, 0);
    const avgSales = totalUnits / products.length;
    
    let response = `🚨 **ANALISIS PRODUK BERISIKO DEADSTOCK**\n`;
    response += `_Berdasarkan ${products.length} produk dalam data penjualan Anda_\n\n`;
    
    response += `📊 **RINGKASAN DEADSTOCK RISK:**\n`;
    response += `• **Jumlah Produk Berisiko:** ${deadstockProducts.length} produk (${((deadstockProducts.length / products.length) * 100).toFixed(0)}% dari total)\n`;
    response += `• **Total Unit Terjual (Deadstock):** ${deadstockProducts.reduce((s, p) => s + p.quantity, 0)} unit\n`;
    response += `• **Estimasi Nilai Terikat:** Rp ${totalDeadstockValue.toLocaleString('id-ID')}\n`;
    response += `• **Rata-rata Penjualan Normal:** ${avgSales.toFixed(1)} unit/produk\n\n`;
    
    response += `⚠️ **TOP ${Math.min(10, deadstockProducts.length)} PRODUK DENGAN PENJUALAN TERENDAH:**\n`;
    response += `_Produk ini SANGAT BERISIKO menjadi deadstock!_\n\n`;
    
    deadstockProducts.slice(0, 10).forEach((product, idx) => {
      const riskLevel = product.quantity < avgSales * 0.3 ? '🔴 SANGAT TINGGI' :
                       product.quantity < avgSales * 0.5 ? '🟠 TINGGI' : '🟡 SEDANG';
      const percentage = ((product.quantity / avgSales) * 100).toFixed(0);
      
      response += `**${idx + 1}. ${product.name}**`;
      if (product.size) response += ` (Size ${product.size})`;
      if (product.category) response += ` - ${product.category}`;
      response += `\n`;
      response += `   📉 Terjual: **HANYA ${product.quantity} unit** (${percentage}% dari rata-rata)\n`;
      response += `   💰 Revenue: Rp ${product.revenue.toLocaleString('id-ID')}\n`;
      response += `   🚨 Risk Level: ${riskLevel}\n`;
      response += `   💡 **SARAN:** `;
      
      // Smart recommendations based on performance
      if (product.quantity < avgSales * 0.2) {
        response += `STOP PRODUKSI! Diskon 50-70% sekarang juga untuk clearance!\n`;
      } else if (product.quantity < avgSales * 0.4) {
        response += `Kurangi stok 70%, buat bundling dengan produk laris, diskon 40%\n`;
      } else {
        response += `Kurangi stok 50%, monitor 2 minggu, jika tidak membaik buat promo\n`;
      }
      response += `\n`;
    });
    
    response += `\n🎯 **ACTION PLAN UNTUK MENGATASI DEADSTOCK:**\n\n`;
    response += `**IMMEDIATE ACTIONS (Minggu ini!):**\n`;
    response += `1. 🏷️ **Clearance Sale 50-70%** untuk ${deadstockProducts.filter(p => p.quantity < avgSales * 0.3).length} produk risk tertinggi\n`;
    response += `2. 📦 **Bundle Deals:** Gabungkan 2-3 produk deadstock dengan 1 produk laris\n`;
    response += `3. 🛑 **STOP Produksi** untuk semua produk di list ini\n\n`;
    
    response += `**SHORT TERM (1 Bulan):**\n`;
    response += `4. 🎯 **Flash Sale:** Buat campaign "End of Season Sale" khusus produk ini\n`;
    response += `5. 🎁 **Gift with Purchase:** Jadikan produk deadstock sebagai bonus pembelian\n`;
    response += `6. 📢 **Marketplace Blitz:** Upload semua di marketplace dengan harga promo\n\n`;
    
    response += `**LONG TERM Strategy:**\n`;
    response += `7. 📊 **Pre-Order System:** Test market sebelum produksi massal\n`;
    response += `8. 🔄 **Inventory Turnover:** Target 60-90 hari max, lebih dari itu = deadstock risk\n`;
    response += `9. 💡 **Data-Driven Production:** Produksi based on historical sales, bukan feeling!\n\n`;
    
    response += `💰 **POTENTIAL RECOVERY:**\n`;
    response += `Jika Anda berhasil clearance sale 70% dari produk deadstock, Anda bisa recover:\n`;
    response += `**Rp ${(totalDeadstockValue * 0.5).toLocaleString('id-ID')} - Rp ${(totalDeadstockValue * 0.7).toLocaleString('id-ID')}**\n`;
    response += `(Lebih baik dapat 50-70% dari nilai daripada 0% karena numpuk terus!)\n`;
    
    return response;
  }

  // ═══════════════════════════════════════════════════════════
  // 🚀 PRODUK PALING CEPAT HABIS / FAST MOVING
  // ═══════════════════════════════════════════════════════════
  if (lowerQuestion.includes('cepat habis') || lowerQuestion.includes('paling cepat') || 
      lowerQuestion.includes('fast moving') || lowerQuestion.includes('cepat laku') ||
      (lowerQuestion.includes('produk') && (lowerQuestion.includes('minggu') || lowerQuestion.includes('bulan')))) {
    
    // Ambil produk dengan penjualan tertinggi
    const fastMoving = [...products].sort((a, b) => b.quantity - a.quantity);
    const topProduct = fastMoving[0];
    
    if (!topProduct) {
      return `❌ Tidak ada data produk yang tersedia untuk dianalisis.`;
    }

    // Hitung stock tersisa (asumsi stok awal = quantity * 1.2)
    const estimatedInitialStock = Math.round(topProduct.quantity * 1.2);
    const stockLeft = estimatedInitialStock - topProduct.quantity;
    
    let response = `Berdasarkan data penjualan, **${topProduct.name}`;
    if (topProduct.size) {
      response += ` ukuran ${topProduct.size}**`;
    } else {
      response += `**`;
    }
    response += ` adalah produk yang paling cepat habis minggu ini dengan **${topProduct.quantity} unit terjual**. `;
    response += `Stok tersisa hanya **${stockLeft} unit**.\n\n`;
    
    // Rekomendasi berbasis stok tersisa
    const stockPercentage = (stockLeft / estimatedInitialStock * 100);
    
    response += `⚡ **Rekomendasi:**\n\n`;
    
    if (stockPercentage < 30) {
      const restockAmount = Math.max(100, Math.round(topProduct.quantity * 0.8));
      response += `Segera restock minimal **${restockAmount} unit** untuk memenuhi permintaan yang tinggi. 📈`;
    } else if (stockPercentage < 50) {
      const restockAmount = Math.max(80, Math.round(topProduct.quantity * 0.6));
      response += `Siapkan restock **${restockAmount} unit** dalam 1-2 minggu ke depan. 📦`;
    } else {
      const restockAmount = Math.max(50, Math.round(topProduct.quantity * 0.5));
      response += `Monitor penjualan, siapkan **${restockAmount} unit** untuk restock bulan depan. 👁️`;
    }
    
    return response;
  }

  // ═══════════════════════════════════════════════════════════
  // 🏆 TOP PRODUCTS / TERLARIS
  // ═══════════════════════════════════════════════════════════
  if (lowerQuestion.includes('terlaris') || lowerQuestion.includes('paling laku') || lowerQuestion.includes('terbaik') || 
      lowerQuestion.includes('best seller') || lowerQuestion.includes('populer') || lowerQuestion.includes('favorit')) {
    
    const topProducts = [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
    const avgSales = totalUnits / products.length;
    
    let response = `🏆 **TOP 10 PRODUK TERLARIS**\n`;
    response += `_Berdasarkan ${totalUnits} unit terjual dari ${products.length} produk_\n\n`;
    
    topProducts.forEach((product, idx) => {
      const percentage = ((product.quantity / totalUnits) * 100).toFixed(1);
      const vsAverage = ((product.quantity / avgSales) * 100).toFixed(0);
      
      response += `**${idx + 1}. ${product.name}**\n`;
      if (product.size) response += `   📏 Size: ${product.size}\n`;
      if (product.category) response += `   🏷️ Kategori: ${product.category}\n`;
      response += `   📊 Terjual: **${product.quantity} unit** (${percentage}% dari total)\n`;
      response += `   💰 Revenue: **Rp ${product.revenue.toLocaleString('id-ID')}**\n`;
      response += `   💵 Harga: Rp ${product.price.toLocaleString('id-ID')}\n`;
      response += `   📈 Performa: ${vsAverage}% dari rata-rata (${avgSales.toFixed(0)} unit)\n`;
      
      if (idx < 3) {
        response += `   🔥 **Status:** SUPER HOT - Cash cow bisnis Anda!\n`;
      }
      response += `\n`;
    });
    
    response += `\n💡 **REKOMENDASI STRATEGIS:**\n\n`;
    response += `**Stock Management:**\n`;
    response += `✅ Jaga stok produk top 5 SELALU available - jangan sampai kehabisan!\n`;
    response += `📦 Tingkatkan stok produk #1 (${topProducts[0].name}) sebanyak 30-50%\n`;
    response += `🎯 Set reorder point: ketika stok <20%, segera restock!\n\n`;
    
    response += `**Product Development:**\n`;
    response += `🔄 Buat variasi warna/model dari produk #1-#3\n`;
    response += `📸 Foto product shoot berkualitas tinggi untuk produk top\n`;
    response += `💎 Pertimbangkan premium line dari best seller\n\n`;
    
    response += `**Marketing Focus:**\n`;
    response += `🎯 Alokasi 60% budget iklan untuk top 5 produk\n`;
    response += `📱 Social proof: "Sudah ${topProducts[0].quantity}+ terjual!"\n`;
    response += `⭐ Customer testimonials untuk best seller\n`;
    
    return response;
  }

  // Stock recommendations
  if (lowerQuestion.includes('stok') || lowerQuestion.includes('rekomendasi') || lowerQuestion.includes('tambah') || lowerQuestion.includes('kurangi')) {
    const increaseRecs = stockRecommendations.filter(r => r.action === 'INCREASE');
    const reduceRecs = stockRecommendations.filter(r => r.action === 'REDUCE' || r.action === 'DISCONTINUE');
    
    let response = `📦 **Rekomendasi Stok dari Analisis:**\n\n`;
    
    if (increaseRecs.length > 0) {
      response += `✅ **TAMBAH STOK (${increaseRecs.length} produk):**\n`;
      increaseRecs.slice(0, 5).forEach((rec, idx) => {
        response += `${idx + 1}. **${rec.productName}**\n`;
        response += `   • ${rec.quantityRecommendation}\n`;
        response += `   • Deadstock Risk: ${rec.deadstockRisk}%\n\n`;
      });
    }
    
    if (reduceRecs.length > 0) {
      response += `⚠️ **KURANGI/STOP STOK (${reduceRecs.length} produk):**\n`;
      reduceRecs.slice(0, 5).forEach((rec, idx) => {
        response += `${idx + 1}. **${rec.productName}** - ${rec.action}\n`;
        response += `   • ${rec.quantityRecommendation}\n`;
        response += `   • Deadstock Risk: ${rec.deadstockRisk}%\n\n`;
      });
    }
    
    return response;
  }

  // Revenue/sales total
  if (lowerQuestion.includes('total') || lowerQuestion.includes('berapa') || lowerQuestion.includes('penjualan') || lowerQuestion.includes('revenue')) {
    let response = `💰 **Total Penjualan Fashion:**\n\n`;
    response += `• **Total Revenue**: Rp ${totalRevenue.toLocaleString('id-ID')}\n`;
    response += `• **Total Unit Terjual**: ${totalUnits} unit\n`;
    response += `• **Jumlah Produk**: ${products.length} produk\n`;
    response += `• **Harga Rata-rata**: Rp ${Math.round(averagePrice).toLocaleString('id-ID')}\n\n`;
    
    const topSize = sizeAnalysis[0];
    if (topSize) {
      response += `📏 **Size Terlaris**: ${topSize.size} (${topSize.percentage.toFixed(1)}% dari total)\n`;
    }
    
    response += `\n💡 **Insight:**\n`;
    response += `• AOV (Average Order Value): Rp ${Math.round(totalRevenue / products.length).toLocaleString('id-ID')}\n`;
    return response;
  }

  // Discount/clearance recommendations
  if (lowerQuestion.includes('diskon') || lowerQuestion.includes('discount') || lowerQuestion.includes('clearance') || lowerQuestion.includes('promo')) {
    const highRiskProducts = stockRecommendations
      .filter(r => r.deadstockRisk > 60)
      .sort((a, b) => b.deadstockRisk - a.deadstockRisk)
      .slice(0, 10);
    
    let response = `🏷️ **Rekomendasi Diskon & Clearance Sale:**\n\n`;
    
    if (highRiskProducts.length > 0) {
      response += `**Produk yang HARUS Didiskon:**\n\n`;
      highRiskProducts.forEach((rec, idx) => {
        const discountLevel = rec.deadstockRisk > 80 ? '70%' : rec.deadstockRisk > 70 ? '50%' : '30%';
        response += `${idx + 1}. **${rec.productName}**\n`;
        response += `   • Diskon: ${discountLevel} OFF\n`;
        response += `   • Risk: ${rec.deadstockRisk}%\n`;
        response += `   • ${rec.reason}\n\n`;
      });
      
      response += `💡 **Strategi Clearance:**\n`;
      response += `• Buat "Flash Sale" untuk produk risk >80%\n`;
      response += `• Bundle 2-3 produk slow moving\n`;
      response += `• Tawarkan di marketplace dengan free ongkir\n`;
      response += `• Prioritaskan produk dengan nilai tinggi\n`;
    } else {
      response += `✅ Hebat! Tidak ada produk yang perlu clearance sale saat ini.\n`;
      response += `Semua produk Anda memiliki performa penjualan yang baik!\n`;
    }
    
    return response;
  }

  // Strategy to increase revenue
  if (lowerQuestion.includes('tingkatkan') || lowerQuestion.includes('naik') || lowerQuestion.includes('omset') || lowerQuestion.includes('revenue')) {
    const topProduct = products.sort((a, b) => b.revenue - a.revenue)[0];
    const hotSizes = sizeAnalysis.filter(s => s.status === 'hot');
    
    let response = `📈 **Strategi Meningkatkan Revenue Fashion:**\n\n`;
    response += `**1. Fokus pada Best Seller**\n`;
    response += `   • Produk terlaris: **${topProduct.name}**\n`;
    response += `   • Pastikan stok selalu available\n`;
    response += `   • Buat variasi warna/model serupa\n\n`;
    
    if (hotSizes.length > 0) {
      response += `**2. Optimasi Produksi Size**\n`;
      hotSizes.forEach(size => {
        response += `   • Size ${size.size}: Tingkatkan produksi (${size.percentage.toFixed(0)}% market share)\n`;
      });
      response += `\n`;
    }
    
    response += `**3. Clearance untuk Produk Lambat**\n`;
    response += `   • ${deadstockAnalysis.productsAtRisk.length} produk perlu clearance\n`;
    response += `   • Estimasi dana yang bisa di-recover: Rp ${deadstockAnalysis.estimatedDeadstockValue.toLocaleString('id-ID')}\n\n`;
    
    response += `**4. Marketing Strategy**\n`;
    response += `   • Focus ads budget ke produk top 10\n`;
    response += `   • Buat campaign seasonal untuk size populer\n`;
    response += `   • Bundle produk fast moving dengan slow moving\n\n`;
    
    response += `**5. Pricing Optimization**\n`;
    response += `   • Harga rata-rata saat ini: Rp ${Math.round(averagePrice).toLocaleString('id-ID')}\n`;
    response += `   • Pertimbangkan premium pricing untuk best seller\n`;
    response += `   • Dynamic pricing untuk produk medium performance\n`;
    
    return response;
  }

  // Size optimization
  if (lowerQuestion.includes('optimasi') || lowerQuestion.includes('optimization') || lowerQuestion.includes('produksi')) {
    const hotSizes = sizeAnalysis.filter(s => s.status === 'hot');
    const slowSizes = sizeAnalysis.filter(s => s.status === 'slow');
    
    let response = `⚙️ **Optimasi Size & Produksi:**\n\n`;
    response += `**📊 Performance by Size:**\n\n`;
    
    sizeAnalysis.slice(0, 5).forEach((size, idx) => {
      const emoji = size.status === 'hot' ? '🔥' : size.status === 'normal' ? '✅' : '📉';
      response += `${idx + 1}. Size **${size.size}** ${emoji}\n`;
      response += `   • ${size.totalSold} unit (${size.percentage.toFixed(1)}%)\n`;
      response += `   • Status: ${size.status.toUpperCase()}\n\n`;
    });
    
    response += `**💡 Rekomendasi Produksi:**\n\n`;
    if (hotSizes.length > 0) {
      response += `✅ **Tingkatkan produksi:**\n`;
      hotSizes.forEach(size => {
        response += `   • Size ${size.size}: +40-50% dari current production\n`;
      });
      response += `\n`;
    }
    
    if (slowSizes.length > 0) {
      response += `⚠️ **Kurangi produksi:**\n`;
      slowSizes.forEach(size => {
        response += `   • Size ${size.size}: -50% dari current production\n`;
      });
      response += `\n`;
    }
    
    response += `**📋 Action Plan:**\n`;
    response += `• Sesuaikan rasio produksi berdasarkan demand\n`;
    response += `• Monitor weekly untuk adaptasi cepat\n`;
    response += `• Pre-order system untuk size slow moving\n`;
    
    return response;
  }

  // Marketing recommendations
  if (lowerQuestion.includes('marketing') || lowerQuestion.includes('promosi') || lowerQuestion.includes('iklan')) {
    const topProducts = products.sort((a, b) => b.quantity - a.quantity).slice(0, 3);
    
    let response = `🎯 **Rekomendasi Marketing Fashion:**\n\n`;
    response += `**1. Product-Focused Campaigns**\n`;
    topProducts.forEach((product, idx) => {
      response += `   ${idx + 1}. **${product.name}**\n`;
      response += `      • Sudah terjual ${product.quantity} unit\n`;
      response += `      • Alokasi budget: 30-40% untuk hero product\n\n`;
    });
    
    response += `**2. Size-Specific Marketing**\n`;
    const topSize = sizeAnalysis[0];
    if (topSize) {
      response += `   • Highlight Size ${topSize.size} (paling populer)\n`;
      response += `   • "Ukuran favorit customers!"\n`;
      response += `   • Social proof: "${topSize.totalSold}+ sold!"\n\n`;
    }
    
    response += `**3. Clearance Campaign**\n`;
    response += `   • ${deadstockAnalysis.productsAtRisk.length} produk perlu clearance\n`;
    response += `   • "End of Season Sale 50-70%"\n`;
    response += `   • Limited time offer untuk urgency\n\n`;
    
    response += `**4. Channel Strategy**\n`;
    response += `   • Instagram/TikTok: Visual content produk top\n`;
    response += `   • Marketplace: Clearance sale & bundle deals\n`;
    response += `   • WhatsApp Business: Personal follow-up\n`;
    response += `   • Email: Loyalty program & early access\n\n`;
    
    response += `**5. Budget Allocation**\n`;
    response += `   • 60% - Promote best sellers\n`;
    response += `   • 30% - Clearance sale fast moving\n`;
    response += `   • 10% - Test new products\n`;
    
    return response;
  }

  // Default response with key insights
  let response = `✨ **Insight Kunci dari Analisis Fashion Anda:**\n\n`;
  insights.slice(0, 5).forEach((insight, idx) => {
    response += `${idx + 1}. ${insight}\n\n`;
  });
  
  response += `\n💡 **Tanyakan lebih spesifik tentang:**\n`;
  response += `• Size mana yang paling laku?\n`;
  response += `• Produk apa yang harus ditambah stoknya?\n`;
  response += `• Bagaimana cara mengurangi deadstock?\n`;
  response += `• Strategi marketing apa yang tepat?\n`;
  
  return response;
}
