
import React from 'react';
import { FileUp, Brain, BarChart2, Rocket } from "lucide-react";
import WorkflowStep from './WorkflowStep';

const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "Upload Your Data",
      description: "Simple data input to get started with your analysis.",
      icon: FileUp
    },
    {
      step: "2",
      title: "AI-Driven Analysis",
      description: "ExpertEye's AI processes and analyzes the data.",
      icon: Brain
    },
    {
      step: "3",
      title: "Get Insights",
      description: "Receive detailed insights or recommendations instantly.",
      icon: BarChart2
    },
    {
      step: "4",
      title: "Take Action",
      description: "Implement solutions to drive business outcomes.",
      icon: Rocket
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-6 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <WorkflowStep 
              key={index}
              step={step.step}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
