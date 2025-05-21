
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server } from "lucide-react";
import ResourcesTab from "./ResourcesTab";
import DocumentsTab from "./DocumentsTab";
import UsersTab from "./UsersTab";

const AdminPanel = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>
          Monitor system health and resource usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
