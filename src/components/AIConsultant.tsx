import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Sparkles } from "lucide-react";

const sampleQuestions = [
  "Produk apa yang paling cepat habis bulan lalu?",
  "Ukuran mana yang paling jarang terjual?",
  "Apa strategi terbaik untuk mengurangi stok kemeja?",
  "Kapan waktu terbaik untuk restock produk terlaris?",
];

const AIConsultant = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-glow/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              AI Konsultan Bisnis{" "}
              <span className="text-primary">yang Selalu Siap</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tanyakan apapun tentang stok Anda dalam bahasa natural. AI kami akan menganalisis data penjualan dan memberikan insight serta rekomendasi strategis untuk membantu keputusan bisnis Anda.
            </p>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Contoh pertanyaan:</p>
              <div className="grid gap-2">
                {sampleQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-primary-light transition-colors" />
                    {question}
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" className="group">
              Coba AI Konsultan
              <Brain className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          {/* Right: Chat Preview */}
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">Skiro AI Assistant</p>
                  <p className="text-xs text-muted-foreground">Siap membantu analisis stok Anda</p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4 py-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">Produk apa yang paling cepat habis minggu ini?</p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-card-foreground leading-relaxed">
                      Berdasarkan data penjualan, <strong>Kemeja Formal Hitam ukuran L</strong> adalah produk yang paling cepat habis minggu ini dengan 156 unit terjual. Stok tersisa hanya 24 unit. 
                      <br/><br/>
                      Rekomendasi: Segera restock minimal 100 unit untuk memenuhi permintaan yang tinggi. 📈
                    </p>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <div className="flex-1 bg-muted/50 rounded-lg px-4 py-2 text-sm text-muted-foreground flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Tanyakan sesuatu...
                </div>
                <Button size="icon" className="shrink-0">
                  <span className="sr-only">Kirim</span>
                  →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
