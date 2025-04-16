
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-background via-background/95 to-primary/10">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Transform Your Business with AI-Powered Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl">
            Our intelligent assistant analyzes your documents, extracts key information, and helps you make smarter decisions in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
              Try AI Assistant <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent z-10 rounded-2xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1920" 
            alt="AI assistant analyzing data" 
            className="w-full object-cover aspect-video rounded-2xl transition-all hover:scale-105 duration-700"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
