
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const InterfaceSettings = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [showSourceDocuments, setShowSourceDocuments] = useState(true);
  const [showThinkingProcess, setShowThinkingProcess] = useState(true);
  const [chatHistoryVisible, setChatHistoryVisible] = useState(true);

  const handleSaveSettings = () => {
    // In a real implementation, this would save to backend
    toast({
      title: "Settings saved",
      description: "Your interface settings have been updated."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interface Settings</CardTitle>
        <CardDescription>
          Customize how you interact with the ExpertEye interface
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark interface theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-sources">Show Source Documents</Label>
              <p className="text-sm text-muted-foreground">
                Display source documents used for generating answers
              </p>
            </div>
            <Switch
              id="show-sources"
              checked={showSourceDocuments}
              onCheckedChange={setShowSourceDocuments}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="thinking-process">Show Thinking Process</Label>
              <p className="text-sm text-muted-foreground">
                Display AI thinking process during response generation
              </p>
            </div>
            <Switch
              id="thinking-process"
              checked={showThinkingProcess}
              onCheckedChange={setShowThinkingProcess}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chat-history">Chat History Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Show or hide the chat history sidebar
              </p>
            </div>
            <Switch
              id="chat-history"
              checked={chatHistoryVisible}
              onCheckedChange={setChatHistoryVisible}
            />
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save Interface Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default InterfaceSettings;
