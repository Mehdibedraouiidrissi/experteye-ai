
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";

const HomeNavbar = () => {
  const navigate = useNavigate();
  
  return (
    <header className="border-b py-4 px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/b62e1898-4b6c-49cf-8eea-204a5d62414e.png" 
            alt="ExpertEye Logo" 
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-primary">ExpertEye</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
          <ModeToggle />
          <Button variant="outline" onClick={() => navigate("/login")} className="rounded-full">Log In</Button>
          <Button onClick={() => navigate("/signup")} className="bg-primary hover:bg-primary/90 rounded-full">Get Started</Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <i className="ri-menu-line"></i>
        </Button>
      </div>
    </header>
  );
};

export default HomeNavbar;
