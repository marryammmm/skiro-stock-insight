import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp, Package } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-glow/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Stock Analysis</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Akhiri Era{" "}
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary-glow bg-clip-text text-transparent">
              Deadstock
            </span>
            {" "}dengan Data
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Platform analisis stok cerdas untuk UMKM pakaian. Prediksi permintaan, optimalkan produksi, tingkatkan profit—semua berbasis data nyata.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="group">
              Mulai Analisis Gratis
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group">
              <BarChart3 className="mr-2 w-4 h-4" />
              Lihat Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-2xl">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Akurasi Prediksi</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">40%</div>
              <div className="text-sm text-muted-foreground">Pengurangan Stok Mati</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">2x</div>
              <div className="text-sm text-muted-foreground">Peningkatan Efisiensi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
