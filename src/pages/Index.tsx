
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import BestDishes from "@/components/BestDishes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CouponSection } from "@/components/CouponSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CouponSection />
        <FeatureHighlights />
        <BestDishes />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
