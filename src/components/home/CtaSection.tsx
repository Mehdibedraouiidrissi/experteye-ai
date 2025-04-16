
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold">Empower Your Team with ExpertEye DigitalHub</h2>
        <p className="text-lg">
          Unlock the full potential of your organization with AI-powered insights, exclusive to your team. Streamline decision-making and boost productivity.
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          onClick={() => navigate("/signup")}
          className="mt-4 bg-white text-primary hover:bg-secondary/10 rounded-full"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
