
import React from 'react';
import { BarChart2, Rocket, Lock, Zap } from "lucide-react";
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart2,
      title: "Real-Time Insights",
      description: "Instant data-driven reports and recommendations to keep you ahead."
    },
    {
      icon: Rocket,
      title: "Predictive Analytics",
      description: "Predict future trends using advanced machine learning algorithms."
    },
    {
      icon: Lock,
      title: "Seamless Integration",
      description: "Easily integrates with your existing systems and workflows."
    },
    {
      icon: Zap,
      title: "Scalable",
      description: "Suitable for businesses of all sizes – from startups to enterprises."
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
