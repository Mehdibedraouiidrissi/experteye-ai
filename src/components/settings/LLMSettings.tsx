
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface LLMSettingsProps {
  temperature: number;
  setTemperature: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  modelKnowledge: string;
  setModelKnowledge: (value: string) => void;
}

const LLMSettings = ({
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  modelKnowledge,
  setModelKnowledge
}: LLMSettingsProps) => {
  return (
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
  );
};

export default LLMSettings;
