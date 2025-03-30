
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface InterfaceSettingsProps {
  defaultShowThinking: boolean;
  setDefaultShowThinking: (value: boolean) => void;
  enableTextToSpeech: boolean;
  setEnableTextToSpeech: (value: boolean) => void;
}

const InterfaceSettings = ({
  defaultShowThinking,
  setDefaultShowThinking,
  enableTextToSpeech,
  setEnableTextToSpeech
}: InterfaceSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Chat Interface</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure chat interface behavior
          </p>
        </div>
        
        <div className="space-y-5">
          <div className="flex items-center justify-between space-x-2">
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
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
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
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">API Configuration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure API endpoints and data locations
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-path" className="text-base">Ollama API Path</Label>
            <Input 
              id="api-path" 
              placeholder="http://localhost:11434" 
              defaultValue="http://localhost:11434"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              The URL where your Ollama instance is running
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="docs-directory" className="text-base">Document Directory</Label>
            <Input 
              id="docs-directory" 
              placeholder="/path/to/documents" 
              defaultValue="/data/documents"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Directory where documents are stored and monitored for changes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSettings;
