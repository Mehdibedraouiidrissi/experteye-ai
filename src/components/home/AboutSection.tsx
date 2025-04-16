
import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="container mx-auto text-center max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold">About ExpertEye</h2>
        <p className="text-lg text-muted-foreground">
          ExpertEye is an advanced AI-powered platform designed to deliver actionable insights, 
          automate workflows, and optimize decision-making processes for businesses across industries.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-background p-6 rounded-lg shadow-soft hover:shadow-hover transition-all duration-300 border border-border">
            <h3 className="font-bold text-secondary">Innovative</h3>
            <p className="text-sm text-muted-foreground">Cutting-edge AI algorithms for superior results</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-soft hover:shadow-hover transition-all duration-300 border border-border">
            <h3 className="font-bold text-secondary">Accurate</h3>
            <p className="text-sm text-muted-foreground">Precise analysis with 99.8% accuracy rate</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-soft hover:shadow-hover transition-all duration-300 border border-border">
            <h3 className="font-bold text-secondary">Scalable</h3>
            <p className="text-sm text-muted-foreground">Grows with your business needs seamlessly</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
