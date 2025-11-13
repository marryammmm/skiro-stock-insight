import { Upload, Brain, BarChart3, AlertCircle, TrendingUp, Package } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Upload,
    title: "Impor CSV Otomatis",
    description: "Unggah data penjualan dalam sekali klik. Sistem kami secara cerdas mendeteksi produk, ukuran, harga, dan stok.",
  },
  {
    icon: Brain,
    title: "AI Konsultan Bisnis",
    description: "Tanya apapun tentang stok Anda. AI kami memberikan wawasan dan rekomendasi berbasis data real-time.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Interaktif",
    description: "Visualisasi tren penjualan, performa produk, dan analisis ukuran dalam grafik yang mudah dipahami.",
  },
  {
    icon: AlertCircle,
    title: "Notifikasi Stok Kritis",
    description: "Dapatkan peringatan otomatis untuk produk yang menipis atau menumpuk di gudang.",
  },
  {
    icon: TrendingUp,
    title: "Prediksi Permintaan",
    description: "Model forecasting cerdas membantu Anda merencanakan produksi berdasarkan pola penjualan historis.",
  },
  {
    icon: Package,
    title: "Rekomendasi Reorder",
    description: "Sistem otomatis memberi tahu kapan dan berapa banyak stok yang perlu ditambah untuk setiap produk.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Fitur yang Membuat{" "}
            <span className="text-primary">Bisnis Lebih Cerdas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola stok dengan presisi tinggi
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
