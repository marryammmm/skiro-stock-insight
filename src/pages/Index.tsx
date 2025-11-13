import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DashboardPreview from "@/components/DashboardPreview";
import AIConsultant from "@/components/AIConsultant";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="dashboard">
        <DashboardPreview />
      </div>
      <div id="ai">
        <AIConsultant />
      </div>
      <CTA />
    </div>
  );
};

export default Index;
