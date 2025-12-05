import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check, Rocket, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  const benefits = [
    "Upload CSV & langsung dapat insight",
    "AI Consultant 24/7 siap jawab pertanyaan",
    "Dashboard lengkap dalam 1 halaman",
    "Deteksi deadstock otomatis",
    "Size analytics mendalam",
    "100% gratis untuk early adopters"
  ];

  return (
    <section className="relative py-32 px-4 md:px-6 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 backdrop-blur-sm">
            <Rocket className="w-6 h-6 text-green-400 animate-bounce" />
            <span className="text-green-200 font-bold text-lg">Early Access - Join Beta Program!</span>
          </div>
          
          {/* Heading */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
              Siap <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Optimasi Stok</span>
              <br />
              dan <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Tingkatkan Profit</span>?
            </h2>
            
            <p className="text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed font-medium">
              Bergabunglah dengan <span className="text-cyan-400 font-bold">early adopters</span> yang sudah menggunakan SKIRO untuk <span className="text-green-400 font-bold">kurangi deadstock 40%</span> dan buat keputusan bisnis lebih data-driven!
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gradient-to-r from-slate-900/80 to-blue-950/80 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4 hover:border-blue-400 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-blue-100 font-medium text-left">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white text-xl px-16 py-8 shadow-2xl hover:shadow-cyan-500/50 transition-all font-bold rounded-xl group"
              onClick={() => navigate('/register')}
            >
              <Zap className="mr-3 w-6 h-6" />
              Mulai Gratis Sekarang
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-400/50 text-blue-200 hover:bg-blue-500/20 backdrop-blur-sm text-xl px-16 py-8 font-semibold rounded-xl"
              onClick={() => navigate('/login')}
            >
              Login Akun Existing
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <p className="text-blue-300 text-lg font-semibold">
              ⚡ Setup dalam 5 menit • 💳 No Credit Card Required • 🔒 Data Aman & Private
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-purple-300">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">
                Beta users mendapat <span className="text-yellow-400 font-bold">lifetime premium access</span> gratis!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default CTA;
