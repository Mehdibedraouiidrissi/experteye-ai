
import { useEffect } from "react";
import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CtaSection from "@/components/home/CtaSection";
import Footer from "@/components/home/Footer";
import ChatButton from "@/components/home/ChatButton";

const HomePage = () => {
  useEffect(() => {
    document.title = "ExpertEye - Intelligent Document Analysis";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <Footer />
      <ChatButton />
    </div>
  );
};

export default HomePage;
