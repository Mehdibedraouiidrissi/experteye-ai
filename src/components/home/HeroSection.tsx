
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, ChartBar } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920" 
          alt="Automotive background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Intelligent Auto Pricing <span className="text-primary">Solutions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl">
            Our AI-powered platform analyzes market data to provide accurate vehicle pricing, giving you the competitive edge in automotive sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")} 
              className="gap-2 bg-primary hover:bg-primary/90 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/chatdemo")} 
              className="gap-2 border-primary text-primary hover:bg-primary/10 rounded-full transition-all"
            >
              Try AI Assistant <ChartBar className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Accurate Market Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
