
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WorkflowStepProps {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const WorkflowStep = ({ step, title, description, icon: Icon }: WorkflowStepProps) => {
  return (
    <div className="text-center">
      <div className="bg-secondary/10 mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-secondary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{step}. {title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default WorkflowStep;
