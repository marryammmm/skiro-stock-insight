# SKIRO SMART FILE READER - Demo & Testing Guide

## 🎉 FITUR BARU: SUPPORT EXCEL (.xlsx) + SMART DETECTION!

### Apa yang Baru?

**1. Multi-Format Support**
- ✅ CSV files (.csv)
- ✅ Excel files (.xlsx, .xls)
- ✅ Auto-detect file type

**2. SMART Column Detection**
Sistem tidak lagi bergantung pada nama kolom! Sekarang sistem **menganalisis ISI data** untuk mendeteksi:
- **Product Name**: Deteksi dari pattern text (jersey, celana, dress, brand names)
- **Category**: Deteksi dari repetitiveness (nilai yang sering muncul)
- **Variant/Size**: Deteksi dari pattern (S, M, L, XL, XXL, warna, kombinasi)
- **Price**: Deteksi dari angka besar (>1000) dengan range konsisten
- **Quantity**: Deteksi dari angka kecil (0-1000) dengan rata-rata wajar
- **SKU**: Deteksi dari alphanumeric unik (>80% uniqueness)
- **Date**: Deteksi dari format tanggal

**3. Intelligent Analysis**
- Pattern recognition dari content
- Statistical validation (average, range, uniqueness)
- Multi-language support (Indonesia & English)
- Confidence scoring untuk setiap deteksi

### Cara Kerja Smart Detection

```
STEP 1: READ FILE
├─ CSV → PapaParse
└─ XLSX → SheetJS (xlsx library)

STEP 2: ANALYZE CONTENT (bukan nama kolom!)
├─ Ambil sample 20 rows pertama
├─ Test setiap value dengan pattern detection:
│  ├─ isLikelyProductName() → Cek fashion keywords, brand, descriptive text
│  ├─ isLikelyCategory() → Cek repetitiveness (>5%)
│  ├─ isLikelyVariant() → Cek size patterns (S/M/L/XL), colors
│  ├─ isLikelyPrice() → Cek angka besar, range consistency
│  ├─ isLikelyQuantity() → Cek angka kecil, average <500
│  ├─ isLikelySKU() → Cek alphanumeric, uniqueness >80%
│  └─ isLikelyDate() → Cek date formats
├─ Score setiap kolom (0-100%)
└─ Pilih kolom dengan score tertinggi

STEP 3: MAP & ANALYZE
├─ Convert data ke FashionProduct[]
├─ Run all analytics (size, category, stock, deadstock)
├─ Generate Intelligence Reports (V1 & V2)
└─ Return complete analysis
```

### Format File yang Didukung

**Contoh 1: Excel dari gambar user (Penjualan 29/10 - 04/11)**
```
| ID Produk | Produk | Kode Variasi | Nama Variasi | Kode Variasi | SKU Induk | Penjualan | Penjualan |
|-----------|--------|--------------|--------------|--------------|-----------|-----------|-----------|
| 16667794540 | DMNT Jersey Setelan Teamwear S | 20681891098 | L,Dixie Black | JRS-DXI-BLACK-L | JRS-DXI-BLACK | 1.165.992 | 544.160 |
```

Sistem akan deteksi:
- Kolom 1 (ID Produk) → SKU (alphanumeric unik)
- Kolom 2 (Produk) → Product Name (ada "DMNT", "Jersey", "Teamwear")
- Kolom 4 (Nama Variasi) → Variant (ada "L", "Dixie Black")
- Kolom 7 (Penjualan angka besar) → Price
- Kolom 8 (Penjualan angka kecil/quantity) → Quantity

**Contoh 2: CSV Sederhana**
```
Nama Barang,Ukuran,Jumlah,Harga Satuan
Kaos Polos Navy,M,150,45000
Celana Jeans Hitam,L,89,120000
Dress Motif Bunga,XL,45,95000
```

Sistem akan deteksi:
- Kolom 0 → Product (ada keywords fashion)
- Kolom 1 → Variant (pattern S/M/L/XL)
- Kolom 2 → Quantity (angka kecil, avg <500)
- Kolom 3 → Price (angka besar >1000)

**Contoh 3: Excel Tanpa Header**
```
| DMNT Jersey Fantasy | Short Sleeve (SS),M | 119.998 | 209.999 |
| DMNT Celana Futsal | M | 1.704.969 | 934.983 |
| DMNT Trackpants | XL | 1.370.800 | 134.100 |
```

Sistem tetap bisa deteksi:
- Kolom 0 → Product (DMNT + item type)
- Kolom 1 → Variant (size patterns)
- Kolom 2 & 3 → Deteksi mana Price dan mana Quantity dari distribusi angka

### Testing dengan File Excel User

File Excel yang user upload memiliki struktur:
- ID Produk (SKU)
- Produk (nama produk dengan size)
- Kode Variasi (nomor)
- Nama Variasi (size + warna, e.g., "L,Dixie Black")
- SKU Induk
- Penjualan (periode 29/10-04/11) - PRICE
- Penjualan (periode 05/11-11/11) - QUANTITY atau sebaliknya
- Tingkat Perubahan (%)

**Expected Detection:**
1. Column "Produk" atau "Nama Variasi" → Product Name
2. Column "Nama Variasi" → Variant/Size
3. Column dengan angka besar (1.165.992, 544.160) → Price
4. Column dengan angka kecil relative → Quantity
5. Confidence: 70-90% (karena ada dua kolom penjualan yang mirip)

### Console Output yang Akan Muncul

```
🚀 Starting SMART file analysis...
📁 Reading file: penjualan_data.xlsx
📊 File type: XLSX
✅ File loaded: 25 rows
📋 Header detected: ID Produk, Produk, Kode Variasi, ...

🧠 Starting SMART column detection...

=== Analyzing Column 0: "ID Produk" ===
  Sample values: ["16667794540","16667794540",...]
  Scores: Product=0% Category=0% Variant=0% Price=0% Qty=0% SKU=95%

=== Analyzing Column 1: "Produk" ===
  Sample values: ["DMNT Jersey Setelan Teamwear S",...]
  Scores: Product=100% Category=5% Variant=20% Price=0% Qty=0% SKU=0%

=== Analyzing Column 3: "Nama Variasi" ===
  Sample values: ["L,Dixie Black","M,Dixie Black",...]
  Scores: Product=30% Category=10% Variant=85% Price=0% Qty=0% SKU=0%

=== Analyzing Column 6: "Penjualan" ===
  Sample values: [1165992, 604995, 241998,...]
  Scores: Product=0% Category=0% Variant=0% Price=90% Qty=30% SKU=0%

=== Analyzing Column 7: "Penjualan" ===
  Sample values: [544160, 208118, 120999,...]
  Scores: Product=0% Category=0% Variant=0% Price=75% Qty=85% SKU=0%

=== FINAL MAPPING ===
Product: Column 1 (100%)
Variant: Column 3 (85%)
Price: Column 6 (90%)
Quantity: Column 7 (85%)
SKU: Column 0 (95%)

✅ SMART detection complete!
   Confidence: 91.7%

✅ Processed 23 unique products
🎉 Analysis complete!
```

### Keunggulan Smart Detection

**VS Old Method (Column Name Based):**
```
OLD: ❌ Gagal jika nama kolom "Penjualan" (ambiguous)
NEW: ✅ Deteksi dari ISI - kolom mana yang berisi harga vs quantity

OLD: ❌ Harus sesuai keywords (Jumlah, Qty, Quantity)
NEW: ✅ Deteksi dari pattern angka (range, distribusi, avg)

OLD: ❌ Tidak bisa baca file tanpa header
NEW: ✅ Bisa! Sistem analyze content langsung

OLD: ❌ Confusion antara Size column vs Quantity (1,2,3...)
NEW: ✅ Size 1-10 di-reject, harus ada pattern S/M/L atau >10
```

### Error Handling

**Jika detection confidence < 30%:**
```
Error: Gagal mendeteksi kolom penting (product/price/quantity). 
Pastikan file berisi data penjualan yang valid.
```

**Jika file format salah:**
```
Error: Format file tidak didukung. Gunakan CSV atau XLSX
```

**Jika tidak ada produk valid:**
```
Error: Tidak ada produk valid ditemukan. 
Pastikan file berisi data penjualan yang benar.
```

### Upload UI Changes

**Before:**
```
"CSV dari Shopee, Tokopedia, Bukalapak, atau format apapun"
accept=".csv"
```

**After:**
```
"CSV atau Excel (.xlsx) dari platform apapun"
"Sistem akan otomatis mendeteksi struktur data 🧠"
accept=".csv,.xlsx,.xls"
```

### Test Cases

1. ✅ Upload Excel seperti gambar user (multi-kolom penjualan)
2. ✅ Upload CSV sederhana (Nama, Size, Jumlah, Harga)
3. ✅ Upload Excel tanpa header (pure data)
4. ✅ Upload file dengan kolom ambiguous (dua kolom "Penjualan")
5. ✅ Upload file dengan mixed language (Indo + English)

### Libraries Used

```json
{
  "xlsx": "^0.18.5",          // Excel file reader
  "papaparse": "^5.4.1",      // CSV file reader
  "jspdf": "^2.5.2",          // PDF generation
  "jspdf-autotable": "^3.8.4" // PDF tables
}
```

---

## 🎯 SUMMARY

Sistem SKIRO sekarang **SUPER PINTAR**:
- ✅ Bisa baca CSV dan Excel
- ✅ Tidak perlu nama kolom yang perfect
- ✅ Deteksi dari ISI data (pattern recognition)
- ✅ Multi-language support
- ✅ Confidence scoring
- ✅ Robust error handling
- ✅ Works dengan file real-world yang messy!

**User tinggal upload file apapun, sistem yang urus sisanya!** 🚀
