import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Package, AlertCircle } from "lucide-react";

const stats = [
  {
    label: "Total Penjualan Bulan Ini",
    value: "Rp 45.2M",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Produk Aktif",
    value: "248",
    change: "+8 produk baru",
    trend: "neutral",
    icon: Package,
  },
  {
    label: "Stok Kritis",
    value: "12",
    change: "Perlu perhatian",
    trend: "down",
    icon: AlertCircle,
  },
  {
    label: "Turnover Rate",
    value: "89%",
    change: "+5.2%",
    trend: "up",
    icon: TrendingUp,
  },
];

const topProducts = [
  { name: "Kemeja Formal Hitam", size: "L", sold: 156, stock: 24 },
  { name: "Polo Casual Navy", size: "M", sold: 142, stock: 18 },
  { name: "T-Shirt Basic Putih", size: "XL", sold: 138, stock: 45 },
  { name: "Jaket Denim Blue", size: "M", sold: 121, stock: 12 },
];

const DashboardPreview = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Dashboard yang{" "}
            <span className="text-primary">Powerful & Intuitif</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lihat performa bisnis Anda dalam satu pandangan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.trend === "up" ? "bg-success/10" :
                  stat.trend === "down" ? "bg-warning/10" :
                  "bg-info/10"
                }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.trend === "up" ? "text-success" :
                    stat.trend === "down" ? "text-warning" :
                    "text-info"
                  }`} />
                </div>
                <Badge variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "destructive" : "secondary"} className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Top Products */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
          <h3 className="text-xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Produk Terlaris Bulan Ini
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Ukuran: {product.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Terjual</p>
                    <p className="font-bold text-success">{product.sold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Stok</p>
                    <p className={`font-bold ${product.stock < 20 ? "text-warning" : "text-card-foreground"}`}>
                      {product.stock}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default DashboardPreview;
