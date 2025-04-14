
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MoreHorizontal,
  FileText,
  FilePieChart,
  FileSpreadsheet,
  FileImage,
  FileSliders,
  Search,
  Eye,
  RefreshCw,
  Download,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "xls" | "ppt" | "txt" | "sas";
  size: number;
  pages: number;
  chunks: number;
  lastUpdated: Date;
  status: "processed" | "processing" | "failed";
}

const DocumentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      name: "Annual Financial Report 2023.pdf",
      type: "pdf",
      size: 4500000,
      pages: 58,
      chunks: 220,
      lastUpdated: new Date(2023, 4, 15),
      status: "processed",
    },
    {
      id: "doc2",
      name: "Strategic Planning 2024-2025.docx",
      type: "doc",
      size: 2100000,
      pages: 32,
      chunks: 126,
      lastUpdated: new Date(2023, 4, 10),
      status: "processed",
    },
    {
      id: "doc3",
      name: "Regional Market Analysis.xlsx",
      type: "xls",
      size: 1800000,
      pages: 15,
      chunks: 45,
      lastUpdated: new Date(2023, 4, 8),
      status: "processed",
    },
    {
      id: "doc4",
      name: "Product Roadmap Presentation.pptx",
      type: "ppt",
      size: 3200000,
      pages: 24,
      chunks: 40,
      lastUpdated: new Date(2023, 4, 5),
      status: "processed",
    },
    {
      id: "doc5",
      name: "Research_Paper_2023.txt",
      type: "txt",
      size: 500000,
      pages: 12,
      chunks: 35,
      lastUpdated: new Date(2023, 4, 3),
      status: "processing",
    },
    {
      id: "doc6",
      name: "Data Analysis Code.sas",
      type: "sas",
      size: 250000,
      pages: 5,
      chunks: 18,
      lastUpdated: new Date(2023, 4, 1),
      status: "failed",
    },
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "xls":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "ppt":
        return <FilePieChart className="h-5 w-5 text-orange-500" />;
      case "txt":
        return <FileText className="h-5 w-5 text-gray-500" />;
      case "sas":
        return <FileSliders className="h-5 w-5 text-purple-500" />;
      default:
        return <FileImage className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed from the system.",
    });
  };

  const handleReprocess = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "processing" as const } : doc
      )
    );
    
    toast({
      title: "Reprocessing document",
      description: "The document will be reprocessed shortly.",
    });
    
    // Simulate processing completion after a delay
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: "processed" as const,
                chunks: doc.chunks + Math.floor(Math.random() * 10),
                lastUpdated: new Date(),
              }
            : doc
        )
      );
      
      toast({
        title: "Document processed",
        description: "The document has been successfully reprocessed.",
      });
    }, 3000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Library</CardTitle>
        <CardDescription>
          Manage your uploaded documents
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden md:table-cell">Pages</TableHead>
                <TableHead className="hidden md:table-cell">Chunks</TableHead>
                <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        <span className="truncate max-w-[150px] md:max-w-[250px]">
                          {doc.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatFileSize(doc.size)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {doc.pages}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {doc.chunks}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {doc.lastUpdated.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          doc.status === "processed" && "border-green-500 text-green-500",
                          doc.status === "processing" && "border-blue-500 text-blue-500",
                          doc.status === "failed" && "border-red-500 text-red-500"
                        )}
                      >
                        {doc.status === "processing" ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : doc.status === "processed" ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Document preview",
                                description: "This feature is coming soon.",
                              });
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReprocess(doc.id)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reprocess
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Document download",
                                description: "This feature is coming soon.",
                              });
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentList;
