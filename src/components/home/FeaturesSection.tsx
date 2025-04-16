
import React from 'react';
import { BarChart2, Rocket, Lock, Zap } from "lucide-react";
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart2,
      title: "Smart Knowledge Access",
      description: "Instantly retrieve internal documents, policies, and team-specific information using AI search."
    },
    {
      icon: Rocket,
      title: "AI Chat for Daily Tasks",
      description: "Summarize reports, answer questions, and support internal workflows with intelligent assistance."
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Enterprise-grade security ensures all data stays within your organization."
    },
    {
      icon: Zap,
      title: "Personalized Experience",
      description: "Delivers context-aware answers tailored to your role, department, and tools."
    }
  ];

  return (
    <section id="features" className="py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
