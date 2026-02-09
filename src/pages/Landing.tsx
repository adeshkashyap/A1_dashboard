import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ResultsSection from "@/components/landing/ResultsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <ResultsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Landing;
