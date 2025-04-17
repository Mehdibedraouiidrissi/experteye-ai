
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";
import Logo from "@/components/shared/Logo";

const HomeNavbar = () => {
  const navigate = useNavigate();
  
  return (
    <header className="border-b py-4 px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
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
