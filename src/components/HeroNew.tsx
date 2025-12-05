import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, MessageSquare, BarChart3, AlertTriangle, TrendingUp, Calculator, Sparkles, Send, CheckCircle2, Zap, Shield, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";
import ScrollFadeIn from "./ScrollFadeIn";

const Hero = ({ showNavbar = true }: { showNavbar?: boolean }) => {
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Impor CSV Otomatis",
      description: "Unggah data penjualan dalam sekali klik. Sistem kami secara cerdas mendeteksi produk, ukuran, harga, dan stok.",
      color: "from-blue-700 to-blue-900",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: MessageSquare,
      title: "AI Konsultan Bisnis",
      description: "Tanya apapun tentang stok Anda. AI kami memberikan wawasan dan rekomendasi berbasis data real-time.",
      color: "from-blue-800 to-blue-950",
      gradient: "from-blue-100 to-blue-200"
    },
    {
      icon: BarChart3,
      title: "Dashboard Interaktif",
      description: "Visualisasi tren penjualan, performa produk, dan analisis ukuran dalam grafik yang mudah dipahami.",
      color: "from-blue-700 to-blue-900",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: AlertTriangle,
      title: "Deteksi Deadstock Otomatis",
      description: "Identifikasi produk dengan penjualan terendah dan dapatkan rekomendasi aksi spesifik (diskon 30-50%, bundling, atau stop produksi).",
      color: "from-blue-800 to-blue-950",
      gradient: "from-blue-100 to-blue-200"
    },
    {
      icon: TrendingUp,
      title: "Prediksi Permintaan",
      description: "Model forecasting cerdas membantu Anda merencanakan produksi berdasarkan pola penjualan historis.",
      color: "from-blue-700 to-blue-900",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: Calculator,
      title: "Kalkulator Harga",
      description: "Tentukan harga jual ideal berdasarkan COGS, biaya operasional, packaging, shipping, dan margin keuntungan yang Anda inginkan.",
      color: "from-blue-800 to-blue-950",
      gradient: "from-blue-100 to-blue-200"
    }
  ];

  const sampleQuestions = [
    "Produk apa yang paling cepat habis bulan lalu?",
    "Ukuran mana yang paling jarang terjual?",
    "Apa strategi terbaik untuk mengurangi stok kemeja?",
    "Kapan waktu terbaik untuk restock produk terlaris?"
  ];

  const stats = [
    { label: "Analisis Per Hari", value: "10K+", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {showNavbar && (
                <span 
                  className="text-2xl font-black bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.05em'
                  }}
                >
                  SKIRO
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#tentang" className="text-gray-700 hover:text-blue-900 font-medium transition-colors mt-5">
                Tentang Kami
              </a>
              <a href="#fitur" className="text-gray-700 hover:text-blue-900 font-medium transition-colors mt-5">
                Fitur Kami
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-900 font-medium transition-colors mt-5">
                FAQ
              </a>
              <div className="flex items-center gap-3 ml-4">
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-900 text-blue-900 hover:bg-blue-50"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-900 to-blue-950 hover:from-blue-950 hover:to-black text-white"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-blue-100 pt-4">
              <a 
                href="#tentang" 
                className="block text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang Kami
              </a>
              <a 
                href="#fitur" 
                className="block text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur Kami
              </a>
              <a 
                href="#faq" 
                className="block text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-blue-900 text-blue-900"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-950 text-white"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Moving gradient blobs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/30 via-blue-300/20 to-transparent rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-500/25 via-blue-400/15 to-transparent rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-blue-300/20 via-blue-200/10 to-transparent rounded-full filter blur-3xl animate-blob animation-delay-4000" />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 animate-gradient-shift" />
        </div>

        <div className="container relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12 md:mb-16">
            {/* Main Heading with Staggered Fade In */}
            <div className="space-y-3 sm:space-y-4 max-w-4xl px-2 sm:px-4 relative">
              {/* Animated gradient background behind text */}
              <motion.div
                className="absolute -inset-4 sm:-inset-8 -z-10 rounded-2xl sm:rounded-3xl"
                animate={{
                  backgroundImage: [
                    'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(147, 197, 253, 0.3) 100%)',
                    'linear-gradient(135deg, rgba(147, 197, 253, 0.3) 0%, rgba(30, 58, 138, 0.4) 50%, rgba(59, 130, 246, 0.3) 100%)',
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 197, 253, 0.4) 50%, rgba(30, 58, 138, 0.3) 100%)',
                    'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(147, 197, 253, 0.3) 100%)',
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  filter: 'blur(60px)',
                }}
              />
              
              <h1 className={`relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Akhiri Era{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-gray-900">Deadstock</span>
                  <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 md:h-4 bg-yellow-300 -rotate-1 opacity-50 animate-pulse"></span>
                </span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>dengan{" "}
                <span className="bg-gradient-to-r from-blue-900 via-blue-950 to-black bg-clip-text text-transparent">
                  SKIRO
                </span>
              </h1>
              
              <p className={`relative text-sm sm:text-base md:text-lg text-gray-600 font-normal leading-relaxed px-2 transition-all duration-1000 delay-300 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Platform analisis stok cerdas untuk UMKM pakaian
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <ScrollFadeIn>
        <section id="tentang" className="relative py-16 md:py-24 bg-gradient-to-b from-white to-blue-50" style={{scrollMarginTop: '80px'}}>
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tentang SKIRO</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-900 to-blue-950 mx-auto rounded-full"></div>
            </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                SKIRO adalah platform analisis stok berbasis AI yang dirancang khusus untuk membantu UMKM pakaian mengelola inventaris dengan lebih cerdas dan efisien.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Kami memahami tantangan yang dihadapi bisnis pakaian mulai dari masalah deadstock, membutuhkan konsultan bisnis yang tepat, hingga kesulitan dalam menentukan harga jual yang optimal. SKIRO hadir sebagai solusi all-in-one yang mudah digunakan dan terjangkau.
              </p>

            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Misi Kami</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-900 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Membantu UMKM mengoptimalkan stok dan mengurangi deadstock</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-900 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Menyediakan insights berbasis data untuk keputusan bisnis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-900 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Meningkatkan profitabilitas bisnis pakaian Indonesia</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollFadeIn>

      {/* Fitur Kami Section */}
      <ScrollFadeIn>
        <section id="fitur" className="relative py-16 md:py-24 bg-white" style={{scrollMarginTop: '80px'}}>
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Fitur SKIRO </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-900 to-blue-950 mx-auto rounded-full"></div>
              <p className="text-gray-600">Fitur kami hadir untuk membantu anda</p>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeFeature === index;
                return (
                  <div
                    key={index}
                    className={`group relative bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-700 border border-blue-100 hover:border-blue-900 transform hover:-translate-y-2 ${
                      isActive ? 'ring-4 ring-blue-400 scale-105' : ''
                    }`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    <div className="relative z-10">
                      {/* Icon with Advanced Animation */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-900 transition-colors">
                        {feature.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {feature.description}
                      </p>

                      {/* Hover Indicator */}
                      <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity animate-ping"></div>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </section>
      </ScrollFadeIn>

      {/* AI Consultant Demo Section */}
      <ScrollFadeIn>
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 shadow-md">
                <Sparkles className="w-4 h-4 text-blue-800 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-blue-900 tracking-wide">Powered by Skiro Assistant</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-4">
                AI Konsultan Bisnis kami yang Selalu Siap
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Tanyakan apapun tentang kebutuhan Anda, dan AI kami akan memberikan insight serta rekomendasi strategis untuk membantu keputusan bisnis Anda.
              </p>
            </div>

          {/* Sample Questions */}
          <div className="mb-6 sm:mb-8">
            <p className="text-center text-gray-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base px-4"> </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 max-w-4xl mx-auto">
              {sampleQuestions.map((question, index) => (
                <div
                  key={index}
                  className="group bg-white border border-blue-200 rounded-lg p-3 sm:p-4 text-gray-700 hover:border-blue-800 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 duration-300"
                  onClick={() => setChatMessage(question)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-800 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{question}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Demo Box with Premium Design */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-800 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Skiro AI Assistant</h3>
                <p className="text-sm text-blue-100 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-[200px] sm:min-h-[250px] bg-gradient-to-b from-blue-50/30 to-white">
              {/* User Message */}
              <div className="flex justify-end animate-slide-in-right">
                <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl rounded-tr-md px-3 sm:px-4 py-2 sm:py-2.5 max-w-[85%] sm:max-w-[80%] shadow-md">
                  <p className="font-medium text-xs sm:text-sm">Produk apa yang paling cepat habis minggu ini?</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start animate-slide-in-left">
                <div className="bg-white border border-blue-200 rounded-xl rounded-tl-md px-3 sm:px-4 py-3 sm:py-4 max-w-[95%] sm:max-w-[90%] shadow-md">
                  <p className="text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed">
                    Berdasarkan data penjualan, <strong className="text-blue-900 font-black">Kemeja Formal Hitam ukuran L</strong> adalah produk yang paling cepat habis minggu ini dengan <strong className="text-blue-900 font-black">156 unit terjual</strong>. Stok tersisa hanya <strong className="text-red-600 font-black">24 unit</strong>.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-2 border-blue-800 p-2 sm:p-3 rounded-md sm:rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-800">
                      <strong className="text-blue-900 font-bold flex items-center gap-1.5">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                        Rekomendasi:
                      </strong>
                      <span className="block mt-2">Segera restock minimal <strong className="text-blue-900">100 unit</strong> untuk memenuhi permintaan yang tinggi. 📈</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-blue-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tanyakan sesuatu..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 text-gray-800 text-xs sm:text-sm transition-all"
                />
                <Button className="bg-gradient-to-r from-blue-900 to-blue-950 hover:from-blue-950 hover:to-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md transform hover:scale-105 transition-all">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollFadeIn>

      {/* FAQ Section */}
      <ScrollFadeIn>
        <section id="faq" className="relative py-16 md:py-24 bg-white" style={{scrollMarginTop: '80px'}}>
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-900 to-blue-950 mx-auto rounded-full"></div>
              <p className="text-gray-600">Pertanyaan yang sering diajukan tentang SKIRO</p>
            </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Apa itu SKIRO?",
                a: "SKIRO adalah platform analisis stok berbasis AI yang dapat membantu UMKM pakaian di dalam mengelola inventaris, mendeteksi deadstock, mengoptimalkan keuntungan melalui insights berbasis data, konsultasi bisnis dan memperdiksi harga jual dari suatu produk berdasarkan hitungan yang tepat "
              },
              {
                q: "Bagaimana cara kerja SKIRO?",
                a: "Anda cukup upload data penjualan anda di dalam format CSV/Excel. Lalu Sistem kami akan secara otomatis menganalisis data, mengidentifikasi pola penjualan, dan memberikan rekomendasi strategis yang tepat untuk UMKM Anda."
              },
              {
                q: "Apakah SKIRO cocok untuk bisnis kecil?",
                a: "Sangat cocok! SKIRO dirancang khusus untuk UMKM dengan antarmuka yang mudah digunakan dengan harga yang terjangkau"
              },
              {
                q: "Format data apa saja yang didukung?",
                a: "SKIRO mendukung file CSV dan Excel (.xlsx, .xls). Sistem kami akan secara otomatis mendeteksi kolom produk, ukuran, harga, dan quantity dari data yang Anda unggah."
              },
              {
                q: "Apakah data saya aman?",
                a: "Keamanan data adalah prioritas kami. Semua data dienkripsi dan disimpan dengan standar keamanan tinggi. Kami tidak membagikan data Anda kepada pihak ketiga."
              },
              {
                q: "Berapa biaya berlangganan SKIRO?",
                a: "Kami menawarkan paket gratis untuk mencoba fitur dasar, dan paket premium dengan fitur lengkap mulai dari harga yang terjangkau"
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-white border-2 border-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-blue-900 transition-all">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base sm:text-lg font-semibold text-gray-900 group-open:text-blue-900">{faq.q}</span>
                  <span className="ml-2 sm:ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-blue-900 transform group-open:rotate-90 transition-transform" />
                  </span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      </ScrollFadeIn>

      {/* Custom Advanced Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes tilt {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/6287710793375?text=Halo%20Customer%20Support%20SKIRO,%20saya%20ingin%20bertanya%20tentang%20layanan%20SKIRO"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
      >
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-50"></div>
          
          {/* Main button */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-slate-900 text-white text-sm py-2 px-4 rounded-lg shadow-xl whitespace-nowrap">
              <div className="font-semibold">Customer Support SKIRO</div>
              <div className="text-xs text-slate-300 mt-0.5">Hubungi kami via WhatsApp</div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
      </a>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Hero;
