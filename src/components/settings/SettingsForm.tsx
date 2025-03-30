
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

// Import our new component files
import DocumentSettings from "./DocumentSettings";
import LLMSettings from "./LLMSettings";
import RetrievalSettings from "./RetrievalSettings";
import InterfaceSettings from "./InterfaceSettings";

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
              <TabsTrigger value="document">
                Document Processing
              </TabsTrigger>
              <TabsTrigger value="llm">
                LLM Settings
              </TabsTrigger>
              <TabsTrigger value="retrieval">
                Retrieval
              </TabsTrigger>
              <TabsTrigger value="ui">
                Interface
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="document" className="space-y-6">
            <DocumentSettings 
              chunkSize={chunkSize}
              setChunkSize={setChunkSize}
              chunkOverlap={chunkOverlap}
              setChunkOverlap={setChunkOverlap}
            />
          </TabsContent>
          
          <TabsContent value="llm" className="space-y-6">
            <LLMSettings 
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              modelKnowledge={modelKnowledge}
              setModelKnowledge={setModelKnowledge}
            />
          </TabsContent>
          
          <TabsContent value="retrieval" className="space-y-6">
            <RetrievalSettings 
              embeddingModel={embeddingModel}
              setEmbeddingModel={setEmbeddingModel}
              retrievalCount={retrievalCount}
              setRetrievalCount={setRetrievalCount}
              useReranking={useReranking}
              setUseReranking={setUseReranking}
            />
          </TabsContent>
          
          <TabsContent value="ui" className="space-y-6">
            <InterfaceSettings 
              defaultShowThinking={defaultShowThinking}
              setDefaultShowThinking={setDefaultShowThinking}
              enableTextToSpeech={enableTextToSpeech}
              setEnableTextToSpeech={setEnableTextToSpeech}
            />
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
