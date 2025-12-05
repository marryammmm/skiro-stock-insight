import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UniversalAnalyticsView from './UniversalAnalyticsView';
import SmartChatConsultant from './SmartChatConsultant';
import { parseAndAnalyzeCSV } from '@/lib/universalCSVAnalyzer';
import { analyzeCSVData } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Upload, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Download,
  Menu,
  X,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface DashboardState {
  isLoading: boolean;
  error: string | null;
  rawData: any[];
  summary: any | null;
  insights: string[];
  conclusion: string | null;
  analytics: any | null;
  universalSummary: any | null;
  universalInsights: string[];
  activeView: 'upload' | 'analytics' | 'consultant' | 'reports';
  activeTab: string;
  fileName: string | null;
  uploadDate: string | null;
}

const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    isLoading: false,
    error: null,
    rawData: [],
    summary: null,
    insights: [],
    conclusion: null,
    analytics: null,
    universalSummary: null,
    universalInsights: [],
    activeView: 'upload',
    activeTab: 'universal',
    fileName: null,
    uploadDate: null,
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Parse and analyze CSV
      const result = await parseAndAnalyzeCSV(file);
      
      // Try to analyze as sales data
      let salesAnalytics = null;
      try {
        salesAnalytics = analyzeCSVData(result.data);
      } catch (e) {
        // Not sales data, that's fine
      }

      setState((prev) => ({
        ...prev,
        rawData: result.data,
        summary: result.summary,
        insights: result.insights,
        conclusion: result.conclusion,
        universalSummary: result.summary,
        universalInsights: result.insights,
        analytics: salesAnalytics,
        isLoading: false,
        activeTab: 'universal',
        fileName: file.name,
        uploadDate: new Date().toLocaleString('id-ID'),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to parse CSV',
        isLoading: false,
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      rawData: [],
      summary: null,
      insights: [],
      conclusion: null,
      analytics: null,
      universalSummary: null,
      universalInsights: [],
      activeView: 'upload',
      activeTab: 'universal',
      fileName: null,
      uploadDate: null,
    });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">📊 Dashboard Analisis CSV</h1>
        <p className="text-gray-600">Upload file CSV apa saja untuk analisis cerdas berbasis konten</p>
      </div>

      {/* File Upload Section */}
      {!state.summary && (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> atau drag and drop
                    </p>
                    <p className="text-xs text-gray-600">CSV (Max. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={state.isLoading}
                  />
                </label>
              </div>

              {state.isLoading && (
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-4">Sedang menganalisis file...</p>
                  </div>
                </div>
              )}

              {state.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {state.summary && (
        <>
          <div className="flex gap-2 justify-end">
            <Button onClick={handleReset} variant="outline">
              🔄 Reset
            </Button>
          </div>

          <Tabs value={state.activeTab} onValueChange={(tab) => setState((prev) => ({ ...prev, activeTab: tab }))}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="universal">📊 Analytics & Insights</TabsTrigger>
              <TabsTrigger value="consultant">💬 AI Consultant</TabsTrigger>
            </TabsList>

            <TabsContent value="universal" className="space-y-6">
              {state.summary && (
                <UniversalAnalyticsView
                  summary={state.summary}
                  insights={state.insights}
                  rawData={state.rawData}
                  conclusion={state.conclusion}
                  salesAnalytics={state.analytics}
                />
              )}
            </TabsContent>

            <TabsContent value="consultant">
              <SmartChatConsultant
                fashionAnalysis={state.universalSummary}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
