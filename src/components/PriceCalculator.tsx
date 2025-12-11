import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calculator, AlertCircle, TrendingUp, Copy, Info, HelpCircle, Divide, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface CalculationResult {
  recommendedPrice: number;
  profitMargin: number;
  totalCosts: number;
  breakdown: {
    operational: number;
    operationalItems: { label: string; amount: number }[];
    platformCommission: number;
    platformCommissionItems: { label: string; amount: number }[];
    marketing: number;
    marketingItems: { label: string; amount: number }[];
    other: number;
    otherItems: { label: string; amount: number }[];
  };
}

const PriceCalculator: React.FC = () => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [calculationMode, setCalculationMode] = useState<'recommended' | 'margin'>('recommended');
  
  // Mini calculator state
  const [showMiniCalc, setShowMiniCalc] = useState(false);
  const [calcNum1, setCalcNum1] = useState('');
  const [calcNum2, setCalcNum2] = useState('');
  const [calcOperation, setCalcOperation] = useState<'divide' | 'calculator'>('divide');
  const [calcResult, setCalcResult] = useState<number | null>(null);
  
  // Calculator mode state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcCurrentOp, setCalcCurrentOp] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);
  
  // Form state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [cogs, setCogs] = useState('');
  
  // Other costs - Enhanced for better accuracy
  const [affiliateCommission, setAffiliateCommission] = useState('');
  const [advertisingROI, setAdvertisingROI] = useState('');
  const [operationalCost, setOperationalCost] = useState('');
  const [packagingCost, setPackagingCost] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  
  // Calculation result
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [targetPrice, setTargetPrice] = useState('');

  // Show info dialog on first load
  useEffect(() => {
    const hasSeenInfo = localStorage.getItem('priceCalculatorInfoSeen');
    if (!hasSeenInfo) {
      setShowInfoDialog(true);
      localStorage.setItem('priceCalculatorInfoSeen', 'true');
    }
  }, []);

  const parseNumber = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatInputCurrency = (value: string): string => {
    const number = parseNumber(value);
    if (number === 0) return '';
    return number.toLocaleString('id-ID');
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(formatInputCurrency(value));
  };

  const handlePercentageChange = (setter: (value: string) => void, maxValue: number = 100) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); // Allow numbers and decimal point
    const numValue = parseFloat(value);
    
    // Limit to maxValue
    if (!isNaN(numValue) && numValue > maxValue) {
      setter(maxValue.toString());
    } else {
      setter(value);
    }
  };

  const calculatePrice = () => {
    const cogsValue = parseNumber(cogs);
    if (cogsValue === 0) {
      alert('Mohon masukkan Biaya Pokok Penjualan (COGS)');
      return;
    }

    // ========== SMART PRICING ALGORITHM ==========
    
    // 1. Platform Commission (realistic Shopee/Tokopedia model)
    const dynamicCommission = cogsValue * 0.04; // 4% platform fee
    
    // 2. Category-based commission (berbeda per kategori)
    let categoryCommission = 0;
    const finalCategory = category === 'other' ? customCategory : category;
    
    // Komisi berbeda per kategori (realistis)
    const categoryRates: { [key: string]: number } = {
      'fashion-pria': 0.03,
      'fashion-wanita': 0.03,
      'fashion-anak': 0.025,
      'sepatu': 0.035,
      'tas-dompet': 0.03,
      'aksesoris': 0.025,
      'olahraga': 0.03,
      'muslim': 0.025,
    };
    
    if (finalCategory && categoryRates[finalCategory]) {
      categoryCommission = cogsValue * categoryRates[finalCategory];
    } else if (finalCategory) {
      categoryCommission = cogsValue * 0.02; // Default 2%
    }

    const totalPlatformCommission = dynamicCommission + categoryCommission;

    // 3. Calculate ALL operational costs
    const affiliateValue = parseNumber(affiliateCommission);
    const affiliateCost = (affiliateValue / 100) * cogsValue; // Affiliate % dari COGS
    
    const roiValue = parseNumber(advertisingROI);
    const operationalValue = parseNumber(operationalCost);
    const packagingValue = parseNumber(packagingCost);
    const shippingValue = parseNumber(shippingCost);
    const laborValue = parseNumber(laborCost);

    // 4. Total ALL costs (ini yang harus ditutup dulu!)
    const totalDirectCosts = cogsValue; // Modal produk
    const totalOperationalCosts = operationalValue + packagingValue + shippingValue + laborValue;
    const totalMarketingCosts = affiliateCost + roiValue;
    const totalPlatformFees = totalPlatformCommission;
    
    const totalAllCosts = totalDirectCosts + totalOperationalCosts + totalMarketingCosts + totalPlatformFees;

    // ========== SMART MARGIN CALCULATION ==========
    // Margin harus disesuaikan dengan:
    // 1. Nilai produk (makin mahal, margin bisa lebih kecil %)
    // 2. Total costs (harus profitable)
    // 3. Market positioning - REALISTIC untuk UMKM fashion
    
    let targetMarginPercent = 0;
    
    if (cogsValue <= 50000) {
      // Produk murah (< 50k): Margin 25-30% (realistis untuk UMKM)
      targetMarginPercent = 0.27; // 27% margin
    } else if (cogsValue <= 150000) {
      // Produk menengah (50k-150k): Margin 22-25%
      targetMarginPercent = 0.23; // 23% margin
    } else if (cogsValue <= 300000) {
      // Produk premium (150k-300k): Margin 20-22%
      targetMarginPercent = 0.21; // 21% margin
    } else if (cogsValue <= 500000) {
      // Produk high-end (300k-500k): Margin 18-20%
      targetMarginPercent = 0.19; // 19% margin
    } else {
      // Produk luxury (> 500k): Margin 15-18%
      targetMarginPercent = 0.17; // 17% margin
    }
    
    // 5. Calculate recommended price with SMART margin
    // Formula: Price = Total Costs / (1 - Margin%)
    // Ini memastikan margin yang diinginkan tercapai SETELAH semua biaya
    const recommendedPrice = Math.ceil(totalAllCosts / (1 - targetMarginPercent));
    
    // 6. Calculate actual profit margin (untuk verifikasi)
    const actualProfit = recommendedPrice - totalAllCosts;
    const actualMarginPercent = (actualProfit / recommendedPrice) * 100;
    
    // 7. Round to nearest psychological price (pricing psychology)
    let finalPrice = recommendedPrice;
    if (recommendedPrice < 100000) {
      // Untuk harga < 100k: bulatkan ke 900, 500, atau 000
      const lastDigits = recommendedPrice % 1000;
      if (lastDigits > 500) {
        finalPrice = Math.ceil(recommendedPrice / 1000) * 1000 - 100; // e.g., 45900
      } else {
        finalPrice = Math.floor(recommendedPrice / 1000) * 1000 + 900; // e.g., 44900
      }
    } else {
      // Untuk harga >= 100k: bulatkan ke 9000 atau 5000
      const lastDigits = recommendedPrice % 10000;
      if (lastDigits > 5000) {
        finalPrice = Math.ceil(recommendedPrice / 10000) * 10000 - 1000; // e.g., 149000
      } else {
        finalPrice = Math.floor(recommendedPrice / 10000) * 10000 + 9000; // e.g., 139000
      }
    }
    
    // Recalculate margin dengan harga final
    const finalProfit = finalPrice - totalAllCosts;
    const finalMarginPercent = (finalProfit / finalPrice) * 100;

    // Build detailed breakdown
    const operationalItems: { label: string; amount: number }[] = [
      { label: 'Biaya pokok penjualan (COGS)', amount: cogsValue }
    ];
    if (operationalValue > 0) operationalItems.push({ label: 'Biaya operasional', amount: operationalValue });
    if (packagingValue > 0) operationalItems.push({ label: 'Biaya packaging', amount: packagingValue });
    if (shippingValue > 0) operationalItems.push({ label: 'Biaya pengiriman', amount: shippingValue });
    if (laborValue > 0) operationalItems.push({ label: 'Biaya tenaga kerja', amount: laborValue });

    const platformItems: { label: string; amount: number }[] = [
      { label: 'Komisi platform (4%)', amount: dynamicCommission }
    ];
    if (categoryCommission > 0) {
      const categoryRate = categoryRates[finalCategory] ? (categoryRates[finalCategory] * 100) : 2;
      platformItems.push({ 
        label: `Komisi kategori (${categoryRate}%)`, 
        amount: categoryCommission 
      });
    }

    const marketingItems: { label: string; amount: number }[] = [];
    if (affiliateCost > 0) marketingItems.push({ label: `Komisi afiliasi (${affiliateValue}%)`, amount: affiliateCost });
    if (roiValue > 0) marketingItems.push({ label: 'Belanja iklan (ROI)', amount: roiValue });

    setResult({
      recommendedPrice: finalPrice,
      profitMargin: finalMarginPercent,
      totalCosts: totalAllCosts,
      breakdown: {
        operational: totalDirectCosts + totalOperationalCosts,
        operationalItems,
        platformCommission: totalPlatformFees,
        platformCommissionItems: platformItems,
        marketing: totalMarketingCosts,
        marketingItems,
        other: 0,
        otherItems: [],
      },
    });
  };

  const handleReset = () => {
    setProductName('');
    setCategory('');
    setCustomCategory('');
    setCogs('');
    setAffiliateCommission('');
    setAdvertisingROI('');
    setOperationalCost('');
    setPackagingCost('');
    setShippingCost('');
    setLaborCost('');
    setTargetPrice('');
    setResult(null);
  };

  const copyPrice = () => {
    if (result) {
      navigator.clipboard.writeText(result.recommendedPrice.toString());
      alert('Harga berhasil disalin!');
    }
  };

  const calculateMini = () => {
    const num1 = parseNumber(calcNum1);
    const num2 = parseNumber(calcNum2);
    
    if (num1 === 0 || num2 === 0) {
      alert('Mohon masukkan kedua angka');
      return;
    }
    
    setCalcResult(Math.round(num1 / num2));
  };

  const resetMiniCalc = () => {
    setCalcNum1('');
    setCalcNum2('');
    setCalcResult(null);
  };

  const copyCalcResult = () => {
    if (calcResult !== null) {
      navigator.clipboard.writeText(calcResult.toString());
      alert('Hasil berhasil disalin!');
    }
  };

  const openMiniCalcFor = (field: 'operational' | 'labor') => {
    setCalcOperation('divide');
    setCalcNum1('');
    setCalcNum2('');
    setCalcResult(null);
    setShowMiniCalc(true);
  };

  const switchToCalculatorMode = () => {
    setCalcOperation('calculator');
    handleCalcClear();
  };

  const switchToDivideMode = () => {
    setCalcOperation('divide');
    resetMiniCalc();
  };

  // Calculator functions
  const handleCalcNumber = (num: string) => {
    if (calcWaitingForOperand) {
      setCalcDisplay(num);
      setCalcWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? num : calcDisplay + num);
    }
  };

  const handleCalcOperator = (op: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (calcPrevValue === null) {
      setCalcPrevValue(inputValue);
    } else if (calcCurrentOp) {
      const currentValue = calcPrevValue || 0;
      const newValue = performCalculation(currentValue, inputValue, calcCurrentOp);
      setCalcDisplay(String(newValue));
      setCalcPrevValue(newValue);
    }

    setCalcWaitingForOperand(true);
    setCalcCurrentOp(op);
  };

  const performCalculation = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleCalcEquals = () => {
    const inputValue = parseFloat(calcDisplay);

    if (calcCurrentOp && calcPrevValue !== null) {
      const newValue = performCalculation(calcPrevValue, inputValue, calcCurrentOp);
      setCalcDisplay(String(newValue));
      setCalcPrevValue(null);
      setCalcCurrentOp(null);
      setCalcWaitingForOperand(true);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrevValue(null);
    setCalcCurrentOp(null);
    setCalcWaitingForOperand(false);
  };

  const handleCalcDecimal = () => {
    if (calcWaitingForOperand) {
      setCalcDisplay('0.');
      setCalcWaitingForOperand(false);
    } else if (calcDisplay.indexOf('.') === -1) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleCalcBackspace = () => {
    if (!calcWaitingForOperand) {
      const newDisplay = calcDisplay.slice(0, -1);
      setCalcDisplay(newDisplay || '0');
    }
  };

  const copyCalculatorResult = () => {
    navigator.clipboard.writeText(calcDisplay);
    alert('Hasil berhasil disalin!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-4 sm:p-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" 
             style={{
               backgroundSize: '200% 100%',
               animation: 'shimmer 3s infinite'
             }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Kalkulator Harga
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">
                  Dapatkan saran harga jual ideal berdasarkan total biaya usaha Anda
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="text-xs bg-white text-blue-900 hover:bg-blue-50 shadow-md px-2 py-1"
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="w-3 h-3 mr-1" />
              Cara Penggunaan
            </Button>
          </div>
        </div>
        <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Bagaimana cara penggunaan Kalkulator Harga?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-3 sm:space-y-4 text-sm sm:text-base">
            <p className="text-gray-700">
              Dengan kalkulator simulasi ini, Anda dapat memperkirakan harga jual yang ideal berdasarkan total biaya produksi dan operasional. 
              Masukkan detail biaya dengan lengkap untuk mendapatkan rekomendasi harga yang akurat.
            </p>
            <p className="text-gray-700">
              Keputusan akhir penentuan harga sepenuhnya ada di tangan Anda sebagai penjual.
            </p>
            <p className="font-medium text-gray-900">
              Harap konfirmasi bahwa Anda memahami fungsi kalkulator harga sebelum melanjutkan.
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowInfoDialog(false)}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                onClick={() => setShowInfoDialog(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Saya Mengerti
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Mini Calculator Dialog */}
      <Dialog open={showMiniCalc} onOpenChange={setShowMiniCalc}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-xl flex items-center gap-2">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              {calcOperation === 'divide' ? 'Kalkulator Pembagian' : 'Kalkulator'}
            </DialogTitle>
          </DialogHeader>
          
          {calcOperation === 'divide' ? (
            /* Mode Pembagian */
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Gunakan untuk menghitung biaya per produk dengan mudah
              </p>

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="calcNum1" className="text-xs sm:text-sm">Total biaya</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                    <Input
                      id="calcNum1"
                      placeholder="Contoh: 3.000.000"
                      value={calcNum1}
                      onChange={handleInputChange(setCalcNum1)}
                      className="pl-8 sm:pl-10 text-sm"
                    />
                  </div>
                </div>

                <div className="text-center text-xl sm:text-2xl font-bold text-gray-400">÷</div>

                <div>
                  <Label htmlFor="calcNum2" className="text-xs sm:text-sm">Jumlah produksi</Label>
                  <Input
                    id="calcNum2"
                    placeholder="Contoh: 300"
                    value={calcNum2}
                    onChange={(e) => setCalcNum2(e.target.value)}
                    type="number"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>

              {/* Result */}
              {calcResult !== null && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Biaya per produk</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600">
                          {formatCurrency(calcResult)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyCalcResult}
                        className="text-blue-600 hover:bg-blue-100"
                      >
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetMiniCalc}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={calculateMini}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Hitung
                </Button>
              </div>

              {/* Switch to Calculator */}
              <Button
                variant="ghost"
                onClick={switchToCalculatorMode}
                className="w-full text-sm text-blue-600 hover:text-blue-700"
              >
                Beralih ke Kalkulator Lengkap
              </Button>

              {/* Example */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Contoh:</strong> Biaya operasional bulanan Rp3.000.000 dibagi 300 produk = Rp10.000/produk
                </p>
              </div>
            </div>
          ) : (
            /* Mode Kalkulator */
            <div className="space-y-4">
              {/* Display */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border-2 border-blue-200 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-blue-100/30 animate-pulse"></div>
                <div className="relative text-right">
                  <div className="text-xs sm:text-sm text-blue-600 mb-2 h-5 sm:h-6 font-mono font-semibold">
                    {calcCurrentOp && calcPrevValue !== null ? `${calcPrevValue} ${calcCurrentOp}` : '\u00A0'}
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent break-all font-mono tracking-tight drop-shadow-sm">
                    {calcDisplay}
                  </div>
                </div>
              </div>

              {/* Calculator Buttons */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {/* Row 1 */}
                <Button
                  onClick={handleCalcClear}
                  className="h-14 sm:h-16 text-base sm:text-lg font-bold bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  AC
                </Button>
                <Button
                  onClick={handleCalcBackspace}
                  className="h-14 sm:h-16 text-base sm:text-lg font-bold bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 hover:from-blue-300 hover:via-blue-400 hover:to-blue-500 text-blue-900 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  ⌫
                </Button>
                <Button
                  onClick={copyCalculatorResult}
                  className="h-14 sm:h-16 text-base sm:text-lg font-bold bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 hover:from-blue-300 hover:via-blue-400 hover:to-blue-500 text-blue-900 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  onClick={() => handleCalcOperator('/')}
                  className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  ÷
                </Button>

                {/* Row 2 */}
                <Button onClick={() => handleCalcNumber('7')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">7</Button>
                <Button onClick={() => handleCalcNumber('8')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">8</Button>
                <Button onClick={() => handleCalcNumber('9')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">9</Button>
                <Button
                  onClick={() => handleCalcOperator('*')}
                  className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  ×
                </Button>

                {/* Row 3 */}
                <Button onClick={() => handleCalcNumber('4')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">4</Button>
                <Button onClick={() => handleCalcNumber('5')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">5</Button>
                <Button onClick={() => handleCalcNumber('6')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">6</Button>
                <Button
                  onClick={() => handleCalcOperator('-')}
                  className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  −
                </Button>

                {/* Row 4 */}
                <Button onClick={() => handleCalcNumber('1')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">1</Button>
                <Button onClick={() => handleCalcNumber('2')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">2</Button>
                <Button onClick={() => handleCalcNumber('3')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">3</Button>
                <Button
                  onClick={() => handleCalcOperator('+')}
                  className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  +
                </Button>

                {/* Row 5 */}
                <Button onClick={() => handleCalcNumber('0')} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 col-span-2">0</Button>
                <Button onClick={handleCalcDecimal} className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-50 to-blue-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 text-slate-800 border border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">.</Button>
                <Button
                  onClick={handleCalcEquals}
                  className="h-14 sm:h-16 text-xl sm:text-2xl font-bold bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  =
                </Button>
              </div>

              {/* Switch to Divide */}
              <Button
                variant="ghost"
                onClick={switchToDivideMode}
                className="w-full text-sm text-blue-600 hover:text-blue-700"
              >
                Kembali ke Mode Pembagian
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Main Calculator */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Panel - Input Form */}
        <div className="space-y-6">
          {/* Calculation Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold">Rekomendasi Harga Ritel (SRP)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600">
                Kalkulator akan menampilkan harga ritel yang direkomendasikan berdasarkan total biaya yang Anda masukkan.
              </p>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold">1. Info produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="productName" className="text-xs sm:text-sm">Nama produk</Label>
                <Input
                  id="productName"
                  placeholder="Masukkan nama produk"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-xs sm:text-sm">*Kategori produk fashion</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1 text-sm">
                    <SelectValue placeholder="Pilih kategori produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pakaian-pria">Pakaian Pria</SelectItem>
                    <SelectItem value="pakaian-wanita">Pakaian Wanita</SelectItem>
                    <SelectItem value="pakaian-anak">Pakaian Anak</SelectItem>
                    <SelectItem value="hijab">Hijab & Busana Muslim</SelectItem>
                    <SelectItem value="tas">Tas & Dompet</SelectItem>
                    <SelectItem value="sepatu">Sepatu & Sandal</SelectItem>
                    <SelectItem value="aksesoris">Aksesoris Fashion</SelectItem>
                    <SelectItem value="batik">Batik & Tenun</SelectItem>
                    <SelectItem value="kaos">Kaos & T-Shirt</SelectItem>
                    <SelectItem value="kemeja">Kemeja</SelectItem>
                    <SelectItem value="celana">Celana</SelectItem>
                    <SelectItem value="rok">Rok & Dress</SelectItem>
                    <SelectItem value="jaket">Jaket & Outer</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {category === 'other' && (
                <div>
                  <Label htmlFor="customCategory" className="text-xs sm:text-sm">Nama kategori custom</Label>
                  <Input
                    id="customCategory"
                    placeholder="Masukkan nama kategori"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="cogs" className="text-xs sm:text-sm">*Biaya Pokok Penjualan (COGS)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">COGS (Cost of Goods Sold)</h4>
                        <p className="text-sm text-gray-700">
                          Total biaya langsung untuk memproduksi produk. 
                          Termasuk: bahan baku, biaya produksi, dan biaya pembelian dari supplier.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contoh:</strong> Jika Anda membeli kaos dari supplier seharga Rp50.000, maka COGS = Rp50.000.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                  <Input
                    id="cogs"
                    placeholder="0"
                    value={cogs}
                    onChange={handleInputChange(setCogs)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Biaya komisi dinamis 4% akan digunakan pada simulasi.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Other Costs - ENHANCED */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold">2. Biaya lainnya (Opsional)</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Tambahkan biaya tambahan untuk perhitungan yang lebih akurat</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="affiliate" className="text-xs sm:text-sm">Komisi afiliasi (%)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">Komisi Afiliasi</h4>
                        <p className="text-sm text-gray-700">
                          Biaya komisi yang dibayarkan kepada affiliate/reseller yang membantu menjual produk Anda.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contoh:</strong> Jika memberikan komisi 10% kepada reseller, masukkan angka 10.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative mt-1">
                  <Input
                    id="affiliate"
                    placeholder="0"
                    value={affiliateCommission}
                    onChange={handlePercentageChange(setAffiliateCommission, 100)}
                    className="pr-8 text-sm"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="roi" className="text-xs sm:text-sm">Belanja iklan (ROI)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">Belanja Iklan (ROI)</h4>
                        <p className="text-sm text-gray-700">
                          Biaya iklan untuk mempromosikan produk (Facebook Ads, Instagram Ads, Google Ads, dll).
                        </p>
                        <p className="text-sm text-gray-600">
                          Masukkan estimasi biaya iklan per produk yang terjual.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                  <Input
                    id="roi"
                    placeholder="0"
                    value={advertisingROI}
                    onChange={handleInputChange(setAdvertisingROI)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="operational" className="text-xs sm:text-sm">Biaya operasional</Label>
                  <button
                    type="button"
                    onClick={() => openMiniCalcFor('operational')}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded p-0.5 transition-colors"
                    title="Buka Kalkulator Mini"
                  >
                    <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">Biaya Operasional</h4>
                        <p className="text-sm text-gray-700">
                          Biaya operasional bisnis per produk seperti: listrik, sewa tempat, utilitas, dll.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contoh:</strong> Jika biaya operasional bulanan Rp3.000.000 dan produksi 300 produk, 
                          maka biaya per produk = Rp3.000.000 ÷ 300 = Rp10.000
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Hitung: biaya operasional ÷ jumlah produksi produk</span>
                </p>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                  <Input
                    id="operational"
                    placeholder="0"
                    value={operationalCost}
                    onChange={handleInputChange(setOperationalCost)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
              </div>

              {/* NEW FIELDS for better accuracy */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="packaging" className="text-xs sm:text-sm">Biaya packaging</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">Biaya Packaging</h4>
                        <p className="text-sm text-gray-700">
                          Biaya untuk kemasan produk (plastik, kardus, bubble wrap, stiker, dll).
                        </p>
                        <p className="text-sm text-gray-600">
                          Masukkan biaya packaging per produk.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                  <Input
                    id="packaging"
                    placeholder="0"
                    value={packagingCost}
                    onChange={handleInputChange(setPackagingCost)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="shipping" className="text-xs sm:text-sm">Biaya pengiriman</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">Biaya Pengiriman</h4>
                        <p className="text-sm text-gray-700">
                          Biaya kirim jika ditanggung penjual (ongkir gratis).
                        </p>
                        <p className="text-sm text-gray-600">
                          Masukkan estimasi biaya pengiriman per produk jika Anda menanggung ongkir.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                  <Input
                    id="shipping"
                    placeholder="0"
                    value={shippingCost}
                    onChange={handleInputChange(setShippingCost)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label htmlFor="labor" className="text-xs sm:text-sm">Biaya tenaga kerja</Label>
                  <button
                    type="button"
                    onClick={() => openMiniCalcFor('labor')}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded p-0.5 transition-colors"
                    title="Buka Kalkulator Mini"
                  >
                    <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm">Biaya Tenaga Kerja</h4>
                        <p className="text-sm text-gray-700">
                          Biaya tenaga kerja per produk untuk karyawan yang membantu proses produksi/packing/QC.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contoh:</strong> Jika gaji karyawan Rp1.000.000/bulan dan produksi 200 produk, 
                          maka biaya per produk = Rp1.000.000 ÷ 200 = Rp5.000
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Hitung: Total gaji karyawan ÷ jumlah produksi per bulan</span>
                </p>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">Rp</span>
                  <Input
                    id="labor"
                    placeholder="0"
                    value={laborCost}
                    onChange={handleInputChange(setLaborCost)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 text-sm"
            >
              Hapus semua
            </Button>
            <Button
              onClick={calculatePrice}
              className="flex-1 bg-blue-900 hover:bg-blue-950 text-sm"
            >
              Hitung
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Klik "Hitung" untuk mendapatkan hasilnya
          </p>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-4">
          {/* Price Result Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Rekomendasi harga ritel
                </CardTitle>
                {result && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyPrice}
                    className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                  >
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {result ? formatCurrency(result.recommendedPrice) : 'Rp0'}
                </div>
                {result && (
                  <p className="text-xs text-gray-600 mt-2 px-2 sm:px-4">
                    Harga ini dihitung berdasarkan total biaya + margin keuntungan yang disesuaikan dengan kategori produk dan harga dasar
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          {result && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base font-semibold">Total biaya</CardTitle>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(result.totalCosts)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Operational Costs */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-xs sm:text-sm text-gray-700">
                      Biaya operasional ({((result.breakdown.operational / result.totalCosts) * 100).toFixed(2)}%)
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-gray-900">
                      {formatCurrency(result.breakdown.operational)}
                    </span>
                  </div>
                  {result.breakdown.operationalItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-gray-600 ml-3 mb-0.5">
                      <span>{item.label}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>

                {/* Platform Commission */}
                {result.breakdown.platformCommission > 0 && (
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-xs sm:text-sm text-gray-700">
                        Komisi platform ({((result.breakdown.platformCommission / result.totalCosts) * 100).toFixed(2)}%)
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">
                        {formatCurrency(result.breakdown.platformCommission)}
                      </span>
                    </div>
                    {result.breakdown.platformCommissionItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-600 ml-3 mb-0.5">
                        <span>{item.label}</span>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Other Costs */}
                {result.breakdown.other > 0 && (
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-xs sm:text-sm text-gray-700">
                        Biaya lainnya ({((result.breakdown.other / result.totalCosts) * 100).toFixed(2)}%)
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">
                        {formatCurrency(result.breakdown.other)}
                      </span>
                    </div>
                    {result.breakdown.otherItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-600 ml-3 mb-0.5">
                        <span>{item.label}</span>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}


        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default PriceCalculator;
