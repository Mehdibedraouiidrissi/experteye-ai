
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const ModelSettings = () => {
  const { toast } = useToast();
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [modelName, setModelName] = useState("deepseek:1.5b");
  const [maxTokens, setMaxTokens] = useState("512");
  const [status, setStatus] = useState<"unknown" | "available" | "unavailable">("unknown");

  const checkModelAvailability = async () => {
    // In a real implementation, this would check the Ollama API
    try {
      setStatus("available");
      toast({
        title: "Connection successful",
        description: `Connected to ${modelName} via Ollama.`
      });
    } catch (error) {
      setStatus("unavailable");
      toast({
        title: "Connection failed",
        description: "Could not connect to Ollama. Please check the URL and model name.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to backend
    toast({
      title: "Model settings saved",
      description: "Your LLM configuration has been updated."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration</CardTitle>
        <CardDescription>
          Configure the connection to Deepseek via Ollama
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ollama-url">Ollama API URL</Label>
            <Input
              id="ollama-url"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
            />
            <p className="text-xs text-muted-foreground">
              URL of the Ollama API server (default: http://localhost:11434)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-name">Model Name</Label>
            <Select value={modelName} onValueChange={setModelName}>
              <SelectTrigger id="model-name">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek:1.5b">deepseek:1.5b (Default)</SelectItem>
                <SelectItem value="deepseek:7b">deepseek:7b</SelectItem>
                <SelectItem value="deepseek:6.7b-instruct">deepseek:6.7b-instruct</SelectItem>
                <SelectItem value="llama2:7b">llama2:7b</SelectItem>
                <SelectItem value="llama2:13b">llama2:13b</SelectItem>
                <SelectItem value="mistral:7b">mistral:7b</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Model to use for embeddings and responses
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Output Tokens</Label>
            <Input
              id="max-tokens"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              placeholder="512"
              type="number"
            />
            <p className="text-xs text-muted-foreground">
              Maximum tokens to generate in responses
            </p>
          </div>

          {status === "available" && (
            <Alert className="bg-green-500/10 border-green-500/50 text-green-600">
              <AlertDescription className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                LLM is connected and available
              </AlertDescription>
            </Alert>
          )}

          {status === "unavailable" && (
            <Alert className="bg-destructive/10 border-destructive/50 text-destructive">
              <AlertDescription className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                LLM is unavailable. Check Ollama installation and settings.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Button onClick={checkModelAvailability} variant="outline" className="w-full">
              Test Connection
            </Button>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Model Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelSettings;
