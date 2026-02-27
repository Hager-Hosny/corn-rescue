import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TeamSection from "@/components/sections/TeamSection";
import GameSection from "@/components/sections/GameSection";
import ProductsSection from "@/components/sections/ProductsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TeamSection />
      <GameSection />
      <ProductsSection />

      {/* Footer */}
      <footer className="py-8 px-4 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-display text-lg font-bold text-primary mb-2">🌽 Cornflex</p>
          <p className="font-body text-sm text-muted-foreground">
            Turning Corn Waste into Sustainable Solutions © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
