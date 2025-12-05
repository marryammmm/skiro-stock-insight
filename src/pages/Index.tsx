import { useState, useEffect } from "react";
import HeroNew from "@/components/HeroNew";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Always show splash on page load/refresh
    setShowSplash(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <HeroNew showNavbar={!showSplash} />
    </div>
  );
};

export default Index;
