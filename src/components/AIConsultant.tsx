import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Sparkles, Send, Zap, TrendingUp, BarChart3 } from "lucide-react";

const sampleQuestions = [
  "Produk apa yang paling cepat habis bulan lalu?",
  "Ukuran mana yang paling jarang terjual?",
  "Apa strategi terbaik untuk mengurangi stok kemeja?",
  "Kapan waktu terbaik untuk restock produk terlaris?",
];

const AIConsultant = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 via-indigo-100/10 to-purple-100/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-200/50 backdrop-blur-sm shadow-lg">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Powered by Advanced AI</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                  AI Konsultan Bisnis
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  yang Selalu Siap Membantu
                </span>
              </h2>
              
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-blue-100 shadow-sm">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-base text-slate-700 leading-relaxed">
                  Tanyakan apapun tentang stok Anda dalam bahasa natural. AI kami akan menganalisis data penjualan dan memberikan insight serta rekomendasi strategis untuk membantu keputusan bisnis Anda.
                </p>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm border border-blue-100/50 shadow-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-slate-700">Contoh Pertanyaan:</p>
              </div>
              <div className="grid gap-3">
                {sampleQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 cursor-pointer group border border-blue-100/50 hover:border-blue-300/50 hover:shadow-md"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <p className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors leading-relaxed">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-base font-semibold">
              <Brain className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Mulai Konsultasi dengan AI
              <Sparkles className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          {/* Right: Premium Chat Interface */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl" />
            
            <Card className="relative overflow-hidden bg-white/80 backdrop-blur-xl border-2 border-blue-100/50 shadow-2xl">
              {/* Glassmorphism Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 p-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl animate-pulse" />
                    <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Skiro AI Assistant</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                      <p className="text-sm text-blue-100">Online • Siap membantu Anda</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">

                {/* Chat Messages Area */}
                <div className="space-y-5 min-h-[300px] max-h-[400px] overflow-y-auto">
                  {/* User message */}
                  <div className="flex justify-end animate-in slide-in-from-right duration-500">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-md px-5 py-3.5 max-w-[85%] shadow-lg">
                        <p className="text-sm leading-relaxed font-medium">Produk apa yang paling cepat habis minggu ini?</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Typing Indicator (optional) */}
                  <div className="flex gap-3 animate-in slide-in-from-left duration-500" style={{animationDelay: '300ms'}}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-md opacity-50" />
                      <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100/50 rounded-2xl rounded-tl-md px-5 py-4 shadow-md">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Berdasarkan data penjualan, <strong className="text-blue-700">Kemeja Formal Hitam ukuran L</strong> adalah produk yang paling cepat habis minggu ini dengan <strong className="text-blue-700">156 unit terjual</strong>. 
                        </p>
                        
                        <div className="mt-3 p-3 rounded-xl bg-white/80 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-semibold text-slate-700">Status Stok</p>
                          </div>
                          <p className="text-xs text-slate-600">Stok tersisa: <strong className="text-red-600">24 unit</strong></p>
                        </div>
                        
                        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-semibold text-blue-900">Rekomendasi AI</p>
                          </div>
                          <p className="text-xs text-blue-800 leading-relaxed">
                            Segera restock minimal <strong>100 unit</strong> untuk memenuhi permintaan yang tinggi dan hindari kehabisan stok.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input area */}
                <div className="relative pt-4 border-t border-blue-100">
                  <div className="flex gap-3">
                    <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center gap-3 bg-gradient-to-br from-slate-50 to-blue-50/50 hover:from-white hover:to-blue-50 border-2 border-blue-100 hover:border-blue-300 rounded-xl px-5 py-3.5 transition-all duration-200 shadow-sm hover:shadow-md">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-slate-500 font-medium">Ketik pertanyaan Anda...</span>
                      </div>
                    </div>
                    <Button size="icon" className="shrink-0 h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-3 text-center">
                    AI ini menggunakan teknologi machine learning untuk analisis data Anda
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
