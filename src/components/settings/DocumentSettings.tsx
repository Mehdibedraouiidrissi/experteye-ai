
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface DocumentSettingsProps {
  chunkSize: number;
  setChunkSize: (value: number) => void;
  chunkOverlap: number;
  setChunkOverlap: (value: number) => void;
}

const DocumentSettings = ({
  chunkSize,
  setChunkSize,
  chunkOverlap,
  setChunkOverlap
}: DocumentSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Document Chunking</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Control how documents are split for processing and retrieval
        </p>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="chunk-size">Chunk Size (tokens)</Label>
              <span className="text-sm text-muted-foreground">{chunkSize}</span>
            </div>
            <Slider 
              id="chunk-size"
              min={100} 
              max={1000} 
              step={10}
              value={[chunkSize]}
              onValueChange={(value) => setChunkSize(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Smaller chunks are more precise but may lose context. Larger chunks preserve context but may retrieve irrelevant information.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="chunk-overlap">Chunk Overlap (%)</Label>
              <span className="text-sm text-muted-foreground">{chunkOverlap}%</span>
            </div>
            <Slider 
              id="chunk-overlap"
              min={0} 
              max={100} 
              step={5}
              value={[chunkOverlap]}
              onValueChange={(value) => setChunkOverlap(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Higher overlap helps maintain context between chunks but increases storage requirements.
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Processing Options</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure additional document processing options
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-ocr">Enable OCR</Label>
              <p className="text-sm text-muted-foreground">
                Use OCR to extract text from images and scanned documents
              </p>
            </div>
            <Switch id="enable-ocr" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="extract-metadata">Extract Metadata</Label>
              <p className="text-sm text-muted-foreground">
                Extract document metadata like author, creation date, and titles
              </p>
            </div>
            <Switch id="extract-metadata" defaultChecked={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
