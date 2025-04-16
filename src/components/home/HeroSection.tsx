
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-24 px-6 hero-gradient">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Transform Your Business with Expert AI Insights
          </h1>
          <p className="text-xl text-muted-foreground">
            Leverage cutting-edge AI to make smarter decisions, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate("/signup")} className="gap-2 bg-primary hover:bg-primary/90 rounded-full">
              Start Using ExpertEye <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/chat")} className="border-primary text-primary hover:bg-primary/10 rounded-full">
              Try AI Assistant
            </Button>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
            alt="AI data analysis visualization" 
            className="rounded-lg shadow-xl w-full object-cover aspect-video animate-fade-in"
          />
          <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
            <p className="text-sm font-medium">Trusted by 500+ companies</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
