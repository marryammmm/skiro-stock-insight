import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-to-br from-primary via-primary-light to-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-glow/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Mulai Sekarang - Gratis 30 Hari</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Siap Mengoptimalkan Stok Anda?
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan ratusan UMKM pakaian yang sudah meningkatkan efisiensi stok dan mengurangi deadstock hingga 40% dengan Skiro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="group">
              Mulai Analisis Gratis
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Jadwalkan Demo
            </Button>
          </div>
          
          <p className="text-sm text-white/70">
            Tidak perlu kartu kredit • Setup dalam 5 menit • Support 24/7
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
