
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Book, ChevronDown, ChevronUp, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";

interface Source {
  id: string;
  title: string;
  page?: number;
  context?: string;
  relevance?: number;
}

interface SourceReferencesProps {
  sources: Source[];
  className?: string;
}

const SourceReferences = ({ sources, className }: SourceReferencesProps) => {
  const [expanded, setExpanded] = useState(false);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  // Sort sources by relevance if available
  const sortedSources = [...sources].sort((a, b) => 
    (b.relevance || 0) - (a.relevance || 0)
  );

  const toggleSourceExpansion = (id: string) => {
    setActiveSource(activeSource === id ? null : id);
  };

  if (!sources.length) return null;

  return (
    <div className={cn("mt-2", className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
      >
        <FileText className="h-3.5 w-3.5" />
        <span>{sources.length} Source{sources.length !== 1 ? 's' : ''}</span>
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {expanded && (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 bg-muted/30 border-b">
            {sortedSources.map((source) => (
              <Badge 
                key={source.id} 
                variant="outline" 
                className={cn(
                  "cursor-pointer transition-colors",
                  activeSource === source.id && "bg-primary/10 border-primary/30"
                )}
                onClick={() => toggleSourceExpansion(source.id)}
              >
                {source.title}
                {source.page && ` (p.${source.page})`}
              </Badge>
            ))}
          </div>
          
          {activeSource && (
            <CardContent className="p-3 text-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Book className="h-3.5 w-3.5" />
                  {sortedSources.find(s => s.id === activeSource)?.title}
                  {sortedSources.find(s => s.id === activeSource)?.page && 
                    ` (Page ${sortedSources.find(s => s.id === activeSource)?.page})`}
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
              <ScrollArea className="h-[100px]">
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {sortedSources.find(s => s.id === activeSource)?.context || 
                    "Context not available for this source."}
                </p>
              </ScrollArea>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default SourceReferences;
