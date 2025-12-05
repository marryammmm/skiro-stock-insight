import { Button } from "@/components/ui/button";
import { Package, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Skiro
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isAuthenticated ? (
            <>
              <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Fitur
              </a>
              <a href="/#dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="/#ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                AI Konsultan
              </a>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                👋 Halo, {user?.name || 'User'}
              </span>
              {user?.businessName && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {user.businessName}
                </span>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate('/login')}>
                Masuk
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Coba Gratis
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                📊 Dashboard
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
