
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RAGSettings = () => {
  const { toast } = useToast();
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [topK, setTopK] = useState(3);
  const [temperature, setTemperature] = useState(0.7);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [modelKnowledge, setModelKnowledge] = useState("hybrid");

  const handleSaveSettings = () => {
    // In a real implementation, this would save to backend
    toast({
      title: "RAG settings saved",
      description: "Your retrieval and generation settings have been updated."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RAG System Settings</CardTitle>
        <CardDescription>
          Configure retrieval and generation parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="chunk-size">Document Chunk Size: {chunkSize}</Label>
              <div className="w-64">
                <Slider
                  id="chunk-size"
                  min={100}
                  max={2000}
                  step={100}
                  value={[chunkSize]}
                  onValueChange={(value) => setChunkSize(value[0])}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Size of text chunks from documents (in characters). Smaller chunks can be more specific but may lose context.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="chunk-overlap">Chunk Overlap: {chunkOverlap}</Label>
              <div className="w-64">
                <Slider
                  id="chunk-overlap"
                  min={0}
                  max={500}
                  step={50}
                  value={[chunkOverlap]}
                  onValueChange={(value) => setChunkOverlap(value[0])}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Overlap between chunks (in characters) to maintain context across boundaries.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-k">Top-K Results: {topK}</Label>
              <div className="w-64">
                <Slider
                  id="top-k"
                  min={1}
                  max={10}
                  step={1}
                  value={[topK]}
                  onValueChange={(value) => setTopK(value[0])}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Number of document chunks to retrieve for each query.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Response Temperature: {temperature.toFixed(1)}</Label>
              <div className="w-64">
                <Slider
                  id="temperature"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Controls creativity vs determinism in responses. Higher values produce more creative outputs.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="model-knowledge">Knowledge Approach</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  How the system combines document and model knowledge.
                </p>
              </div>
              <Select value={modelKnowledge} onValueChange={setModelKnowledge}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document-only">Document Knowledge Only</SelectItem>
                  <SelectItem value="model-only">Model Knowledge Only</SelectItem>
                  <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="web-search">Enable Web Search</Label>
              <p className="text-sm text-muted-foreground">
                Allow system to search the web when documents don't have answers
              </p>
            </div>
            <Switch
              id="web-search"
              checked={useWebSearch}
              onCheckedChange={setUseWebSearch}
            />
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save RAG Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default RAGSettings;
