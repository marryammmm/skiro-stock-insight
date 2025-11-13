import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Skiro
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Fitur
          </a>
          <a href="#dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            AI Konsultan
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Harga
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Masuk
          </Button>
          <Button>
            Coba Gratis
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
