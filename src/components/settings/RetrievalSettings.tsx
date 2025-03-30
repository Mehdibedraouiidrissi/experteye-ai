
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface RetrievalSettingsProps {
  embeddingModel: string;
  setEmbeddingModel: (value: string) => void;
  retrievalCount: number;
  setRetrievalCount: (value: number) => void;
  useReranking: boolean;
  setUseReranking: (value: boolean) => void;
}

const RetrievalSettings = ({
  embeddingModel,
  setEmbeddingModel,
  retrievalCount,
  setRetrievalCount,
  useReranking,
  setUseReranking,
}: RetrievalSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Retrieval Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure how document chunks are retrieved for question answering
        </p>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="embedding-model">Embedding Model</Label>
            <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
              <SelectTrigger id="embedding-model">
                <SelectValue placeholder="Select embedding model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek">Deepseek r1:1.5b</SelectItem>
                <SelectItem value="all-minilm">all-MiniLM-L6-v2</SelectItem>
                <SelectItem value="e5">e5-large</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The embedding model used to convert text to vector representations.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="retrieval-count">Retrieval Count (k)</Label>
              <span className="text-sm text-muted-foreground">{retrievalCount}</span>
            </div>
            <Slider 
              id="retrieval-count"
              min={1} 
              max={10} 
              step={1}
              value={[retrievalCount]}
              onValueChange={(value) => setRetrievalCount(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Number of document chunks to retrieve for each query.
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Advanced Retrieval Options</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure additional retrieval enhancements
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="use-reranking">Use Reranking</Label>
              <p className="text-sm text-muted-foreground">
                Apply a secondary reranking step to improve retrieval quality
              </p>
            </div>
            <Switch 
              id="use-reranking" 
              checked={useReranking}
              onCheckedChange={setUseReranking}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="multi-query">Multi-Query Retrieval</Label>
              <p className="text-sm text-muted-foreground">
                Generate multiple query variations to improve retrieval coverage
              </p>
            </div>
            <Switch id="multi-query" defaultChecked={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetrievalSettings;
