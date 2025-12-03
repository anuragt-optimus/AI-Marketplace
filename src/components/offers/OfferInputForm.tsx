import { useState, useEffect } from "react";
import { Upload, Globe, Sparkles, Eye, EyeOff, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OfferTypeSelector } from "@/components/offers/OfferTypeSelector";

interface FilePreviewProps {
  file: File;
}

const FilePreview = ({ file }: FilePreviewProps) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const loadPreview = async () => {
      setLoading(true);
      
      if (file.type === 'text/plain') {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            // Limit preview to first 1000 characters
            setContent(text.slice(0, 1000) + (text.length > 1000 ? '...' : ''));
            setLoading(false);
          };
          reader.readAsText(file);
        } catch (error) {
          setContent('Unable to preview this file');
          setLoading(false);
        }
      } else if (file.type === 'application/pdf') {
        // Create object URL for PDF preview
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        setContent(''); // We'll show the PDF in an iframe
        setLoading(false);
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                 file.type === 'application/msword') {
        // For Word documents, we'll show a proper preview with file info
        // Since proper DOCX parsing requires complex libraries, we'll provide a rich preview instead
        try {
          const fileSizeKB = (file.size / 1024).toFixed(1);
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
          const lastModified = file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown';
          
          let previewContent = `📄 Word Document Preview\n\n`;
          previewContent += `File Name: ${file.name}\n`;
          previewContent += `File Size: ${fileSizeKB} KB (${fileSizeMB} MB)\n`;
          previewContent += `File Type: ${file.type || 'Microsoft Word Document'}\n`;
          previewContent += `Last Modified: ${lastModified}\n\n`;
          
          if (file.name.endsWith('.docx')) {
            previewContent += `📋 Document Format: Modern Word Document (DOCX)\n`;
            previewContent += `✅ Compatible with Microsoft Word 2007 and later\n`;
            previewContent += `✅ Will be processed for text extraction during offer generation\n\n`;
          } else {
            previewContent += `📋 Document Format: Legacy Word Document (DOC)\n`;
            previewContent += `✅ Compatible with older Microsoft Word versions\n`;
            previewContent += `✅ Will be processed for text extraction during offer generation\n\n`;
          }
          
          previewContent += `🔄 Processing Information:\n`;
          previewContent += `• The document will be analyzed during offer generation\n`;
          previewContent += `• Text content will be extracted and used for marketplace listing\n`;
          previewContent += `• Document formatting and structure will be preserved\n`;
          previewContent += `• All text, headings, and key information will be captured\n\n`;
          
          previewContent += `💡 What's included in processing:\n`;
          previewContent += `• Product descriptions and features\n`;
          previewContent += `• Technical specifications\n`;
          previewContent += `• Benefits and use cases\n`;
          previewContent += `• Any relevant marketing content`;
          
          setContent(previewContent);
          setLoading(false);
        } catch (error) {
          setContent(`Word Document: ${file.name}\n\nFile will be processed during offer generation to extract text content for your marketplace listing.`);
          setLoading(false);
        }
      } else {
        setContent('File preview is not available for this file type. The file will be processed during offer generation.');
        setLoading(false);
      }
    };

    loadPreview();
    
    // Cleanup function to revoke object URLs
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file]);

  return (
    <div className="p-4 bg-background border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">File Preview</h4>
        <Badge variant="secondary" className="text-xs">
          {file.name}
        </Badge>
      </div>
      
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading preview...</div>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {pdfUrl ? (
            // PDF Preview
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">PDF Preview:</p>
              <iframe
                src={pdfUrl}
                className="w-full h-40 border rounded"
                title={`Preview of ${file.name}`}
              />
              <p className="text-xs text-muted-foreground">
                Full PDF will be processed during offer generation.
              </p>
            </div>
          ) : (
            // Text content preview
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
              {content}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

interface OfferInputFormProps {
  onGenerate: (url: string, offerAlias: string, offerType: string) => void;
}

export const OfferInputForm = ({ onGenerate }: OfferInputFormProps) => {
  const [selectedOfferType, setSelectedOfferType] = useState<string | null>(null);
  const [offerAlias, setOfferAlias] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewedFiles, setPreviewedFiles] = useState<Set<number>>(new Set());

  // Define available offer types directly (or import from constants)
  const availableOfferTypes = [
    { value: "SaaS", label: "SaaS", description: "Software as a Service" },
    { value: "managed-service", label: "Managed Service", description: "Managed Application" },
    { value: "consulting-service", label: "Consulting Service", description: "Professional Services" },
    { value: "azure-application", label: "Azure Application", description: "Azure Application Offer" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setPreviewedFiles(new Set()); // Reset previews when new files are selected
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    const newPreviewed = new Set(previewedFiles);
    newPreviewed.delete(index);
    // Update indices for remaining previewed files
    const updatedPreviewed = new Set<number>();
    newPreviewed.forEach(fileIndex => {
      if (fileIndex > index) {
        updatedPreviewed.add(fileIndex - 1);
      } else if (fileIndex < index) {
        updatedPreviewed.add(fileIndex);
      }
    });
    setPreviewedFiles(updatedPreviewed);
  };

  const togglePreview = (index: number) => {
    const newPreviewed = new Set(previewedFiles);
    if (newPreviewed.has(index)) {
      newPreviewed.delete(index);
    } else {
      newPreviewed.add(index);
    }
    setPreviewedFiles(newPreviewed);
  };

  const handleSubmit = () => {
    if (offerAlias && websiteUrl && selectedOfferType) {
      onGenerate(websiteUrl, offerAlias, selectedOfferType);
    }
  };

  // Validate alias format: 3-50 chars, letters, numbers, hyphens, and spaces
  const isValidAlias = /^[a-zA-Z0-9\s-]{3,50}$/.test(offerAlias);
  const canSubmit = selectedOfferType && offerAlias && websiteUrl && isValidAlias;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Offer Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Offer Type Selection */}
          <OfferTypeSelector
            offerTypes={availableOfferTypes}
            selectedType={selectedOfferType}
            onSelect={setSelectedOfferType}
          />

          {/* Offer Alias */}
          <div className="space-y-2">
            <Label htmlFor="alias" className="text-sm font-medium">
              Offer Alias
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="alias"
              type="text"
              placeholder="My SaaS Product"
              value={offerAlias}
              onChange={(e) => setOfferAlias(e.target.value)}
              className={offerAlias && !isValidAlias ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              3-50 characters, letters (uppercase/lowercase), numbers, hyphens, and spaces
            </p>
            {offerAlias && !isValidAlias && (
              <p className="text-xs text-destructive">
                Invalid format. Use only letters, numbers, hyphens, and spaces.
              </p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
              Product Website URL
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="https://yourproduct.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              AI will analyze your website to generate the marketplace listing
            </p>
          </div>

          {/* Optional Files */}
          <div className="space-y-2">
            <Label htmlFor="files" className="text-sm font-medium">
              Additional Documents (Optional)
            </Label>
            
            {files.length === 0 ? (
              <label
                htmlFor="files"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  only pdf/doc allowed
                </span>
                <input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePreview(index)}
                          >
                            {previewedFiles.has(index) ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide Preview
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {previewedFiles.has(index) && (
                        <FilePreview file={file} />
                      )}
                    </div>
                  ))}
                </div>
                
                <label
                  htmlFor="files-add"
                  className="flex items-center justify-center w-full h-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Add more files</span>
                  <input
                    id="files-add"
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Info Box */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 space-y-2 text-sm">
              <p className="font-medium">What happens next?</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• AI analyzes your website and extracts key information</li>
                <li>• Generates professional marketplace descriptions</li>
                <li>• Suggests pricing, categories, and technical details</li>
                <li>• You review and customize everything before publishing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Marketplace Listing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
