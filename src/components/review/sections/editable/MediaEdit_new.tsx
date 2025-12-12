import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface MediaEditProps {
  data: {
    logos?: {
      large?: string;
    };
    screenshots?: string[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const MediaEdit = ({ data, onSave, onCancel, isSaving = false }: MediaEditProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      logos: {
        large: data?.logos?.large || "",
      },
      screenshots: data?.screenshots || [""],
    }
  });

  const screenshots = watch("screenshots") || [""];
  const logos = watch("logos");

  // Track uploaded files for API submission
  const [uploadedFiles, setUploadedFiles] = useState<{
    logoLarge?: File;
    screenshots?: File[];
  }>({
    screenshots: []
  });

  // File upload refs
  const logoRefs = {
    large: useRef<HTMLInputElement>(null),
  };
  
  const screenshotRefs = useRef<(HTMLInputElement | null)[]>(
    screenshots.map(() => null)
  );

  const handleLogoUpload = (logoType: keyof typeof logos, file: File) => {
    if (file && file.type === 'image/png') {
      const url = URL.createObjectURL(file);
      setValue(`logos.${logoType}`, url);
      
      // Track the file for API upload
      setUploadedFiles(prev => ({
        ...prev,
        logoLarge: file
      }));
    } else {
      alert('Please select a PNG image file only.');
    }
  };

  const handleScreenshotUpload = (index: number, file: File) => {
    if (file && file.type === 'image/png') {
      const url = URL.createObjectURL(file);
      const currentScreenshots = [...screenshots];
      currentScreenshots[index] = url;
      setValue("screenshots", currentScreenshots);
      
      // Track the file for API upload
      setUploadedFiles(prev => {
        const newScreenshots = [...(prev.screenshots || [])];
        newScreenshots[index] = file;
        return {
          ...prev,
          screenshots: newScreenshots
        };
      });
    } else {
      alert('Please select a PNG image file only.');
    }
  };

  const removeLogo = (logoType: keyof typeof logos) => {
    setValue(`logos.${logoType}`, "");
    
    // Clear the file upload input
    if (logoRefs.large.current) {
      logoRefs.large.current.value = '';
    }
    
    // Remove from uploaded files
    setUploadedFiles(prev => ({
      ...prev,
      logoLarge: undefined
    }));
  };

  const removeScreenshot = (index: number) => {
    const currentScreenshots = screenshots.filter((_, i) => i !== index);
    setValue("screenshots", currentScreenshots);
    
    // Remove the corresponding ref
    screenshotRefs.current = screenshotRefs.current.filter((_, i) => i !== index);
    
    // Remove from uploaded files
    setUploadedFiles(prev => {
      const newScreenshots = [...(prev.screenshots || [])];
      newScreenshots.splice(index, 1);
      return {
        ...prev,
        screenshots: newScreenshots
      };
    });
  };

  const addScreenshot = () => {
    const newScreenshots = [...screenshots, ""];
    setValue("screenshots", newScreenshots);
    
    // Add a new ref
    screenshotRefs.current.push(null);
  };

  const handleFormSubmit = (formData: any) => {
    // Filter out empty screenshots
    const filteredScreenshots = formData.screenshots.filter((url: string) => url.trim() !== "");
    
    // Filter out undefined screenshot files
    const filteredScreenshotFiles = uploadedFiles.screenshots?.filter(file => file !== undefined) || [];
    
    onSave({
      ...formData,
      screenshots: filteredScreenshots,
      // Include the actual file objects for API upload
      files: {
        logoLarge: uploadedFiles.logoLarge,
        screenshots: filteredScreenshotFiles
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <div className="space-y-1">
          <Label className="text-base font-semibold">Logos</Label>
          <p className="text-xs text-muted-foreground">
            Upload PNG format logos only. All logos should have transparent backgrounds.
          </p>
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-sm">Large Logo (216x216)</Label>
            <div className="space-y-2">
              <Input
                ref={logoRefs.large}
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload('large', file);
                }}
                className="cursor-pointer"
              />
              {logos.large && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <img src={logos.large} alt="Large logo preview" className="w-20 h-20 object-contain rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLogo('large')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-1">
          <Label className="text-base font-semibold">Screenshots</Label>
          <p className="text-xs text-muted-foreground">
            Upload up to 5 screenshots in PNG format (1280x720 resolution recommended).
          </p>
        </div>
        
        <div className="space-y-4 mt-4">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm">Screenshot {index + 1}</Label>
              <div className="space-y-2">
                <Input
                  ref={(el) => screenshotRefs.current[index] = el}
                  type="file"
                  accept="image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleScreenshotUpload(index, file);
                  }}
                  className="cursor-pointer"
                />
                {screenshot && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <img src={screenshot} alt={`Screenshot ${index + 1} preview`} className="w-32 h-18 object-contain rounded" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScreenshot(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {screenshots.length < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={addScreenshot}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Screenshot
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
