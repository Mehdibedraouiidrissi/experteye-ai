
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Transform Your Business with Expert AI Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl">
            Leverage cutting-edge AI to make smarter decisions, faster. Our intelligent document analysis helps you extract valuable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")} 
              className="gap-2 bg-primary hover:bg-primary/90 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Start Using ExpertEye <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/chatdemo")} 
              className="border-primary text-primary hover:bg-primary/10 rounded-full transition-all"
            >
              Try AI Assistant
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10 rounded-xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920" 
            alt="Professional team analyzing data" 
            className="w-full object-cover aspect-video rounded-xl transition-all hover:scale-105 duration-700"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
