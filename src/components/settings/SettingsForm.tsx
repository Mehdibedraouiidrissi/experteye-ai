
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterfaceSettings from "./InterfaceSettings";
import RAGSettings from "./RAGSettings";
import ModelSettings from "./ModelSettings";

const SettingsForm = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="interface" className="w-full settings-tabs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="rag-system">RAG System</TabsTrigger>
          <TabsTrigger value="model">LLM Model</TabsTrigger>
        </TabsList>
        <TabsContent value="interface">
          <InterfaceSettings />
        </TabsContent>
        <TabsContent value="rag-system">
          <RAGSettings />
        </TabsContent>
        <TabsContent value="model">
          <ModelSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
