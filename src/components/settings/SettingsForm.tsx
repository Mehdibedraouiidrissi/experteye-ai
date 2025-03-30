
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const SettingsForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Document Processing Settings
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  
  // LLM Settings
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [modelKnowledge, setModelKnowledge] = useState("hybrid");
  
  // Retrieval Settings
  const [retrievalCount, setRetrievalCount] = useState(4);
  const [useReranking, setUseReranking] = useState(true);
  const [embeddingModel, setEmbeddingModel] = useState("deepseek");
  
  // UI Settings
  const [defaultShowThinking, setDefaultShowThinking] = useState(true);
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(false);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
        <CardDescription>
          Configure the behavior of your ExpertEye system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="document">
          <div className="mb-6">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full">
              <TabsTrigger 
                value="document" 
                className="ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Document Processing
              </TabsTrigger>
              <TabsTrigger 
                value="llm" 
                className="ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                LLM Settings
              </TabsTrigger>
              <TabsTrigger 
                value="retrieval" 
                className="ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Retrieval
              </TabsTrigger>
              <TabsTrigger 
                value="ui" 
                className="ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Interface
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="document" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Document Chunking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Control how documents are split for processing and retrieval
                </p>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="chunk-size">Chunk Size (tokens)</Label>
                      <span className="text-sm text-muted-foreground">{chunkSize}</span>
                    </div>
                    <Slider 
                      id="chunk-size"
                      min={100} 
                      max={1000} 
                      step={10}
                      value={[chunkSize]}
                      onValueChange={(value) => setChunkSize(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Smaller chunks are more precise but may lose context. Larger chunks preserve context but may retrieve irrelevant information.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="chunk-overlap">Chunk Overlap (%)</Label>
                      <span className="text-sm text-muted-foreground">{chunkOverlap}%</span>
                    </div>
                    <Slider 
                      id="chunk-overlap"
                      min={0} 
                      max={100} 
                      step={5}
                      value={[chunkOverlap]}
                      onValueChange={(value) => setChunkOverlap(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher overlap helps maintain context between chunks but increases storage requirements.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Processing Options</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure additional document processing options
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-ocr">Enable OCR</Label>
                      <p className="text-sm text-muted-foreground">
                        Use OCR to extract text from images and scanned documents
                      </p>
                    </div>
                    <Switch id="enable-ocr" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="extract-metadata">Extract Metadata</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract document metadata like author, creation date, and titles
                      </p>
                    </div>
                    <Switch id="extract-metadata" defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="llm" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">LLM Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure the LLM response generation parameters
                </p>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="temperature">Temperature</Label>
                      <span className="text-sm text-muted-foreground">{temperature}</span>
                    </div>
                    <Slider 
                      id="temperature"
                      min={0} 
                      max={1} 
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values produce more deterministic output. Higher values make output more creative.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="max-tokens">Max Output Tokens</Label>
                      <span className="text-sm text-muted-foreground">{maxTokens}</span>
                    </div>
                    <Slider 
                      id="max-tokens"
                      min={256} 
                      max={2048} 
                      step={128}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of tokens the model can generate in response.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Knowledge Sources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Control what knowledge sources the LLM can use when answering questions
                </p>
                
                <RadioGroup value={modelKnowledge} onValueChange={setModelKnowledge}>
                  <div className="flex items-start space-x-3 space-y-0 mb-4">
                    <RadioGroupItem value="documents" id="documents" />
                    <div>
                      <Label htmlFor="documents" className="text-base">Documents Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Only use information from the uploaded documents to answer questions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-y-0 mb-4">
                    <RadioGroupItem value="model" id="model" />
                    <div>
                      <Label htmlFor="model" className="text-base">Model Knowledge</Label>
                      <p className="text-sm text-muted-foreground">
                        Use the LLM's built-in knowledge to answer questions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <div>
                      <Label htmlFor="hybrid" className="text-base">Hybrid</Label>
                      <p className="text-sm text-muted-foreground">
                        Prioritize document information but supplement with model knowledge when needed
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="retrieval" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="ui" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Chat Interface</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure chat interface behavior
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="default-thinking">Show Thinking Process</Label>
                      <p className="text-sm text-muted-foreground">
                        Show the LLM's thinking process by default
                      </p>
                    </div>
                    <Switch 
                      id="default-thinking" 
                      checked={defaultShowThinking}
                      onCheckedChange={setDefaultShowThinking}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="text-to-speech">Enable Text-to-Speech</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable text-to-speech for AI responses
                      </p>
                    </div>
                    <Switch 
                      id="text-to-speech" 
                      checked={enableTextToSpeech}
                      onCheckedChange={setEnableTextToSpeech}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="api-path">Ollama API Path</Label>
                <Input 
                  id="api-path" 
                  placeholder="http://localhost:11434" 
                  defaultValue="http://localhost:11434"
                />
                <p className="text-xs text-muted-foreground">
                  The URL where your Ollama instance is running
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docs-directory">Document Directory</Label>
                <Input 
                  id="docs-directory" 
                  placeholder="/path/to/documents" 
                  defaultValue="/data/documents"
                />
                <p className="text-xs text-muted-foreground">
                  Directory where documents are stored and monitored for changes
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsForm;
