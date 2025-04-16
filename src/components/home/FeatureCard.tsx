
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="border-none shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      <CardContent className="pt-6">
        <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <Icon className="text-secondary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
