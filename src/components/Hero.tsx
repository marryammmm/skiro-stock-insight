import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, MessageSquare, BarChart3, TrendingUp, Package, Sparkles, Send, FileSpreadsheet, Brain, Target, ShoppingBag, AlertTriangle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState("");

  const actualFeatures = [
    {
      icon: FileSpreadsheet,
      title: "Smart CSV Reader",
      description: "Upload data penjualan CSV/Excel. Sistem otomatis deteksi kolom produk, size, harga, dan quantity - bahkan format Indonesia!",
      color: "from-blue-600 to-cyan-600",
      gradient: "group-hover:from-blue-500 group-hover:to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI Chatbot Consultant",
      description: "Tanya \"Size mana yang paling laku?\" atau \"Produk berisiko deadstock?\" - AI jawab berdasarkan DATA REAL Anda, bukan asumsi!",
      color: "from-purple-600 to-pink-600",
      gradient: "group-hover:from-purple-500 group-hover:to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Dashboard Terpadu",
      description: "Semua analisis dalam 1 halaman: Top products, size performance, revenue breakdown, category analysis - no navigation!",
      color: "from-orange-600 to-red-600",
      gradient: "group-hover:from-orange-500 group-hover:to-red-500"
    },
    {
      icon: AlertTriangle,
      title: "Deadstock Detection",
      description: "Deteksi otomatis produk penjualan terendah dengan saran konkret: kurangi stok berapa persen, diskon berapa, kapan stop produksi.",
      color: "from-red-600 to-rose-600",
      gradient: "group-hover:from-red-500 group-hover:to-rose-500"
    },
    {
      icon: TrendingUp,
      title: "Size Analytics",
      description: "Analisis mendalam size mana yang HOT (>15% penjualan) vs SLOW (<8%). Tampilkan nama produk per size untuk keputusan produksi.",
      color: "from-green-600 to-emerald-600",
      gradient: "group-hover:from-green-500 group-hover:to-emerald-500"
    },
    {
      icon: Target,
      title: "Smart Recommendations",
      description: "Rekomendasi stok real-time: tambah 50% untuk top sellers, kurangi 70% untuk slow movers, dengan estimasi recovery value.",
      color: "from-indigo-600 to-blue-600",
      gradient: "group-hover:from-indigo-500 group-hover:to-blue-500"
    }
  ];

  const sampleQuestions = [
    "Size apa yang paling banyak terjual di data saya?",
    "Produk mana yang berisiko deadstock tinggi?",
    "Produk fashion apa yang paling laku?",
    "Bagaimana cara meningkatkan revenue bisnis fashion?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 max-w-7xl">
          {/* Logo & Brand Section */}
          <div className="flex flex-col items-center text-center space-y-12 mb-16">
            {/* Logo */}
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <TrendingUp className="w-14 h-14 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  SKIRO
                </h2>
                <p className="text-sm text-blue-300 font-semibold tracking-widest">SMART STOCK INSIGHT</p>
              </div>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-8 max-w-5xl">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-blue-200 font-semibold">Platform #1 untuk Deadstock Prevention</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white animate-fade-in-up leading-tight">
                Stop Rugi Gara-Gara
                <br />
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                  Deadstock!
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto leading-relaxed">
                Platform AI-Powered untuk UMKM Fashion yang ingin <span className="text-cyan-400 font-bold">optimasi stok</span>, <span className="text-green-400 font-bold">kurangi deadstock 40%</span>, dan <span className="text-yellow-400 font-bold">tingkatkan profit</span> dengan data-driven decisions.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 text-white text-lg px-12 py-8 shadow-2xl hover:shadow-blue-500/50 transition-all font-bold rounded-xl group"
                onClick={() => navigate('/register')}
              >
                🚀 Mulai Gratis Sekarang
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-12 py-8 border-2 border-blue-400 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm rounded-xl font-semibold"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>

            {/* Trust Indicators - Updated for New Startup */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-4xl">
              <div className="text-center space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Beta
                </div>
                <div className="text-blue-300 text-sm font-medium">Early Access Program</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-blue-300 text-sm font-medium">Akurasi Analisis Data</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-blue-300 text-sm font-medium">AI Consultant Ready</div>
              </div>
            </div>
          </div>

          {/* Features Section - Real System Features */}
          <div className="space-y-12 mt-32">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 backdrop-blur-sm">
                <Package className="w-5 h-5 text-orange-400" />
                <span className="text-orange-200 font-semibold">Fitur Berdasarkan Sistem yang Sebenarnya</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white">
                Fitur yang <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Actually Work</span>
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Bukan janji kosong! Ini adalah fitur REAL yang sudah kami build dan test dengan data penjualan asli.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {actualFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-slate-900/90 to-blue-950/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 border border-blue-400/20 hover:border-blue-400/60 hover:-translate-y-2"
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                    
                    <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-blue-200 leading-relaxed group-hover:text-blue-100 transition-colors">
                      {feature.description}
                    </p>

                    {/* Number badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                      <span className="text-blue-300 font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AI Consultant Demo Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm">
              <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
              <span className="text-purple-200 font-bold text-lg">Powered by Advanced AI</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white">
              Punya <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Consultant</span>
              <br />yang Paham Bisnis Anda
            </h2>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              Tanyakan apapun dalam <span className="text-cyan-400 font-semibold">bahasa Indonesia natural</span>. AI kami akan menganalisis data penjualan REAL Anda dan memberikan <span className="text-green-400 font-semibold">insight actionable</span> - bukan jawaban generic!
            </p>
          </div>

          {/* Sample Questions */}
          <div className="mb-12">
            <p className="text-center text-purple-300 font-semibold mb-6 text-lg">💬 Contoh Pertanyaan Real:</p>
            <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {sampleQuestions.map((question, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-400/30 hover:border-purple-400 rounded-xl p-5 text-purple-100 hover:text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer hover:-translate-y-1"
                  onClick={() => setChatMessage(question)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-400 group-hover:text-purple-300 flex-shrink-0 mt-1" />
                    <span className="font-medium">{question}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Demo Box - More Modern */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30"></div>
              
              <div className="relative bg-gradient-to-br from-slate-900/95 to-purple-950/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-400/40 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 py-5 flex items-center gap-4 border-b border-purple-400/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Skiro AI Assistant</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-purple-100">Online • Ready to analyze your data</p>
                    </div>
                  </div>
                  <div className="ml-auto px-4 py-2 rounded-full bg-purple-500/30 border border-purple-300/30">
                    <span className="text-xs font-semibold">100% Data-Driven</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-8 space-y-6 min-h-[400px] bg-gradient-to-b from-slate-900/50 to-purple-950/50">
                  {/* User Message */}
                  <div className="flex justify-end animate-fade-in">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl rounded-tr-sm px-6 py-4 max-w-[75%] shadow-xl">
                      <p className="font-semibold text-lg">Size apa yang paling banyak terjual di data saya?</p>
                    </div>
                  </div>

                  {/* AI Response - More Detailed */}
                  <div className="flex justify-start animate-fade-in animation-delay-500">
                    <div className="bg-white/10 backdrop-blur-xl border-2 border-purple-300/30 rounded-2xl rounded-tl-sm px-6 py-5 max-w-[85%] shadow-2xl">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1">AI Analysis Complete!</p>
                          <p className="text-purple-200 text-sm">Analyzed 156 products from your sales data</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-4">
                          <p className="text-green-300 font-bold mb-2">🔥 TOP 3 SIZE TERLARIS:</p>
                          <div className="space-y-2 text-white">
                            <p><strong className="text-green-400">1. SIZE L</strong> - 45 unit (28.5% dari total)</p>
                            <p className="text-sm text-green-200 ml-4">Top Product: Kemeja Formal Hitam (18 unit)</p>
                            <p><strong className="text-green-400">2. SIZE M</strong> - 38 unit (24.1%)</p>
                            <p className="text-sm text-green-200 ml-4">Top Product: Rok Plisket Abu (12 unit)</p>
                            <p><strong className="text-green-400">3. SIZE XL</strong> - 29 unit (18.4%)</p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-4">
                          <p className="text-cyan-300 font-bold mb-2">💡 REKOMENDASI BISNIS:</p>
                          <ul className="space-y-1 text-cyan-100 text-sm">
                            <li>✅ Fokus produksi pada Size L (kontribusi 28% penjualan)</li>
                            <li>📈 Pastikan stok Size L SELALU available - ini cash cow Anda!</li>
                            <li>🎯 Marketing: Highlight "Size L - Favorit Pelanggan!"</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input - Modern */}
                <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-t-2 border-purple-400/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Tanyakan tentang deadstock, size analysis, top products..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-6 py-4 bg-slate-800/50 border-2 border-purple-400/30 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-purple-300/50 text-lg backdrop-blur-sm"
                    />
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-xl shadow-lg">
                      <Send className="w-6 h-6" />
                    </Button>
                  </div>
                  <p className="text-purple-300/70 text-sm mt-3 text-center">
                    💬 AI menjawab berdasarkan <span className="text-purple-300 font-semibold">DATA PENJUALAN REAL</span> yang Anda upload - tidak mengarang!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Below Demo */}
          <div className="text-center mt-16 space-y-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white text-xl px-16 py-8 shadow-2xl hover:shadow-purple-500/50 transition-all font-bold rounded-xl group"
              onClick={() => navigate('/register')}
            >
              🎯 Coba AI Consultant Gratis
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <p className="text-purple-200 text-lg">
              Join <span className="text-cyan-400 font-bold">early adopters</span> yang sudah optimasi stok mereka dengan SKIRO
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-purple-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Setup 5 Menit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Hero;
