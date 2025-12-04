import { useState, useCallback } from "react";
import { Upload, FileArchive, CheckCircle2, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PackageUploadStatus } from "../types/appsAgentsOffer";

interface PackageUploaderProps {
  onUploadComplete: (url: string, fileName: string) => void;
  initialFile?: { url: string; fileName: string };
}

export const PackageUploader = ({ onUploadComplete, initialFile }: PackageUploaderProps) => {
  const [uploadStatus, setUploadStatus] = useState<PackageUploadStatus>({
    isUploading: false,
    progress: 0,
    url: initialFile?.url,
    fileName: initialFile?.fileName,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Package file must be less than 50MB",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus({ isUploading: true, progress: 0, file });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('offer-packages')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('offer-packages')
        .getPublicUrl(fileName);

      setUploadStatus({
        isUploading: false,
        progress: 100,
        url: publicUrl,
        fileName: file.name,
      });

      onUploadComplete(publicUrl, file.name);

      toast({
        title: "Package uploaded",
        description: "Your package file has been uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed",
      });
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload package",
        variant: "destructive",
      });
    }
  }, [onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback(() => {
    setUploadStatus({ isUploading: false, progress: 0 });
  }, []);

  if (uploadStatus.url && uploadStatus.fileName) {
    return (
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">{uploadStatus.fileName}</p>
                <p className="text-sm text-muted-foreground">Package uploaded successfully</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (uploadStatus.isUploading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Uploading package...</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadStatus.progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardContent className="pt-6">
        <label className="flex flex-col items-center gap-4 cursor-pointer">
          <div className="p-4 rounded-full bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-1">
              Upload Package File
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Drop your ZIP file here or click to browse
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileArchive className="h-4 w-4" />
              <span>ZIP files only • Max 50MB</span>
            </div>
          </div>
          <input
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </label>
        {uploadStatus.error && (
          <p className="mt-4 text-sm text-destructive text-center">{uploadStatus.error}</p>
        )}
      </CardContent>
    </Card>
  );
};
