
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BrainCircuit, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ThinkingProcessProps {
  thinking: string;
  className?: string;
}

const ThinkingProcess = ({ thinking, className }: ThinkingProcessProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("mt-2 mb-4", className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
      >
        <BrainCircuit className="h-3.5 w-3.5" />
        <span>Thinking Process</span>
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {expanded && (
        <Card className="p-3 text-xs bg-muted/70 text-muted-foreground font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
          {thinking}
        </Card>
      )}
    </div>
  );
};

export default ThinkingProcess;
