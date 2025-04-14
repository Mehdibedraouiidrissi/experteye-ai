
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, HardDrive, FileText, Users, Activity, Clock } from "lucide-react";

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
          
          <TabsContent value="resources" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>RAM Usage</span>
                </div>
                <span className="text-muted-foreground">2.4 GB / 8 GB</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span>CPU Usage</span>
                </div>
                <span className="text-muted-foreground">42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>API Requests</span>
                </div>
                <span className="text-muted-foreground">143 / minute</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Vector DB Size</div>
                <div className="text-2xl font-bold">1.2 GB</div>
                <div className="text-xs text-muted-foreground mt-1">12,543 vectors</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Model Size</div>
                <div className="text-2xl font-bold">1.5 GB</div>
                <div className="text-xs text-muted-foreground mt-1">deepseek:1.5b</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Document Processing Queue</span>
                </div>
                <span className="text-muted-foreground">2 pending</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Total Documents</div>
                <div className="text-2xl font-bold">247</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Processed</div>
                <div className="text-2xl font-bold">231</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Processing</div>
                <div className="text-2xl font-bold">16</div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md mt-4">
              <div className="text-sm font-medium mb-2">Document Types</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span>PDF</span>
                  <span className="text-muted-foreground">132 files</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>DOCX</span>
                  <span className="text-muted-foreground">54 files</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>XLSX</span>
                  <span className="text-muted-foreground">28 files</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>TXT</span>
                  <span className="text-muted-foreground">22 files</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>PPTX</span>
                  <span className="text-muted-foreground">8 files</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>SAS</span>
                  <span className="text-muted-foreground">3 files</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Active Users</span>
                </div>
                <span className="text-muted-foreground">12 / 50</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Total Users</div>
                <div className="text-2xl font-bold">50</div>
                <div className="text-xs text-muted-foreground mt-1">3 admins, 47 regular users</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-sm font-medium mb-2">Active Sessions</div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground mt-1">Last hour: 24 unique users</div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md mt-4">
              <div className="text-sm font-medium mb-2">Recent Activity</div>
              <div className="space-y-3 mt-2">
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground mr-2">2m ago:</span>
                  <span>User 'admin' uploaded 2 new documents</span>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground mr-2">15m ago:</span>
                  <span>User 'analyst1' created a new chat session</span>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground mr-2">1h ago:</span>
                  <span>New user 'researcher3' registered</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
