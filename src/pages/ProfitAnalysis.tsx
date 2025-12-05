import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import ProfitMaximizerDashboard from '@/components/ProfitMaximizerDashboard';
import type { FashionAnalysisResult } from '@/lib/fashionAnalyzer';

const ProfitAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<FashionAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load analysis data from localStorage
    const loadAnalysisData = () => {
      try {
        const storedAnalysis = localStorage.getItem('fashionAnalysis');
        if (storedAnalysis) {
          const parsedAnalysis = JSON.parse(storedAnalysis);
          setAnalysis(parsedAnalysis);
          setError(null);
        } else {
          setError('Belum ada data analisis. Silakan upload data penjualan terlebih dahulu.');
        }
      } catch (err) {
        console.error('Error loading analysis:', err);
        setError('Terjadi kesalahan saat memuat data analisis.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();

    // Listen for storage changes (when new data is uploaded)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashionAnalysis') {
        loadAnalysisData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            <p className="text-lg text-gray-700">Memuat data profit analysis...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="bg-yellow-50 border-yellow-300">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <AlertDescription>
            <p className="font-semibold text-yellow-900 mb-2">{error || 'Data tidak tersedia'}</p>
            <p className="text-sm text-yellow-800">
              Untuk menggunakan Profit Maximizer, silakan:
            </p>
            <ol className="text-sm text-yellow-800 mt-2 ml-4 list-decimal">
              <li>Klik menu "Upload Data" di sidebar</li>
              <li>Upload file Excel data penjualan Anda</li>
              <li>Sistem akan otomatis menganalisis dan menampilkan insight profit</li>
            </ol>
          </AlertDescription>
        </Alert>

        <Card className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-12 h-12 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-green-900">Profit Maximizer Pro</h2>
                <p className="text-green-700">Sistem AI untuk Meningkatkan Profit hingga 2-3x Lipat</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-bold text-gray-900 mb-1">Analisis Mendalam</h3>
                <p className="text-sm text-gray-600">
                  AI menganalisis setiap produk untuk temukan peluang profit tersembunyi
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-bold text-gray-900 mb-1">Strategi Pricing</h3>
                <p className="text-sm text-gray-600">
                  Rekomendasi harga optimal berdasarkan demand dan margin produk
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-bold text-gray-900 mb-1">Cash Flow Optimizer</h3>
                <p className="text-sm text-gray-600">
                  Percepat perputaran modal untuk profit 3x lebih cepat
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ProfitMaximizerDashboard analysis={analysis} />
    </div>
  );
};

export default ProfitAnalysis;
