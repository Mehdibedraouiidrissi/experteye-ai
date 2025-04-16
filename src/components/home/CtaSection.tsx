
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-primary/5 py-24 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Business Intelligence?
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Start using ExpertEye today and see how our AI assistant can help you make smarter decisions, faster.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => navigate("/login")}
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/chatdemo")}
          >
            Try AI Assistant
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
