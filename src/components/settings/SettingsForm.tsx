
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

// Import our component files
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
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
        <CardDescription>
          Configure the behavior of your ExpertEye system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="document" className="w-full settings-tabs">
          <TabsList className="mb-6">
            <TabsTrigger value="document">
              Document
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
          
          <TabsContent value="document" className="p-1">
            <DocumentSettings 
              chunkSize={chunkSize}
              setChunkSize={setChunkSize}
              chunkOverlap={chunkOverlap}
              setChunkOverlap={setChunkOverlap}
            />
          </TabsContent>
          
          <TabsContent value="llm" className="p-1">
            <LLMSettings 
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              modelKnowledge={modelKnowledge}
              setModelKnowledge={setModelKnowledge}
            />
          </TabsContent>
          
          <TabsContent value="retrieval" className="p-1">
            <RetrievalSettings 
              embeddingModel={embeddingModel}
              setEmbeddingModel={setEmbeddingModel}
              retrievalCount={retrievalCount}
              setRetrievalCount={setRetrievalCount}
              useReranking={useReranking}
              setUseReranking={setUseReranking}
            />
          </TabsContent>
          
          <TabsContent value="ui" className="p-1">
            <InterfaceSettings 
              defaultShowThinking={defaultShowThinking}
              setDefaultShowThinking={setDefaultShowThinking}
              enableTextToSpeech={enableTextToSpeech}
              setEnableTextToSpeech={setEnableTextToSpeech}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-6 bg-background/50">
        <Button onClick={handleSaveSettings} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
