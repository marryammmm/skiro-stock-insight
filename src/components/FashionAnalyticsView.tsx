import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain } from 'lucide-react';
import type { FashionAnalysisResult } from '@/lib/fashionAnalyzer';
import SkiroSupremeReport from './SkiroSupremeReport';

interface FashionAnalyticsViewProps {
  analysis: FashionAnalysisResult;
}

const FashionAnalyticsView: React.FC<FashionAnalyticsViewProps> = ({ analysis }) => {
  const { supremeAIReport } = analysis;

  return (
    <div className="space-y-6">
      {/* SKIRO SUPREME AI - THE ONLY REPORT YOU NEED */}
      {supremeAIReport ? (
        <SkiroSupremeReport report={supremeAIReport} />
      ) : (
        <Alert className="border-blue-500 bg-blue-50">
          <Brain className="w-5 h-5 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>SKIRO SUPREME AI</strong> sedang memproses data Anda... Jika tidak muncul, silakan re-upload file CSV.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FashionAnalyticsView;
