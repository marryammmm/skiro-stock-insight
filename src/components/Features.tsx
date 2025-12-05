import { Upload, Brain, Calculator, AlertCircle } from "lucide-react";
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
    icon: Calculator,
    title: "Kalkulator Harga",
    description: "Tentukan harga jual ideal berdasarkan COGS, biaya operasional, komisi platform, dan margin keuntungan yang Anda inginkan.",
  },
  {
    icon: AlertCircle,
    title: "Deteksi Deadstock",
    description: "Identifikasi produk dengan penjualan terendah dan dapatkan rekomendasi aksi spesifik untuk mengoptimalkan stok.",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
            Fitur Utama SKIRO
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola stok dengan presisi tinggi
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-900 bg-white group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
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
