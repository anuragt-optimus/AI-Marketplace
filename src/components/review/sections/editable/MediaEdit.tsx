import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface MediaEditProps {
  data: {
    logos?: {
      small?: string;
      medium?: string;
      large?: string;
      wide?: string;
      hero?: string;
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
        small: data?.logos?.small || "",
        medium: data?.logos?.medium || "",
        large: data?.logos?.large || "",
        wide: data?.logos?.wide || "",
        hero: data?.logos?.hero || "",
      },
      screenshots: data?.screenshots || [""],
    }
  });

  const screenshots = watch("screenshots") || [""];
  const logos = watch("logos");

  // Track uploaded files for API submission
  const [uploadedFiles, setUploadedFiles] = useState<{
    logoSmall?: File;
    logoMedium?: File;
    logoLarge?: File;
    logoWide?: File;
    logoHero?: File;
    screenshots?: File[];
  }>({
    screenshots: []
  });

  // File upload refs
  const logoRefs = {
    small: useRef<HTMLInputElement>(null),
    medium: useRef<HTMLInputElement>(null),
    large: useRef<HTMLInputElement>(null),
    wide: useRef<HTMLInputElement>(null),
    hero: useRef<HTMLInputElement>(null),
  };
  
  const screenshotRefs = useRef<(HTMLInputElement | null)[]>(
    screenshots.map(() => null)
  );

  const handleLogoUpload = (logoType: keyof typeof logos, file: File) => {
    if (file && file.type === 'image/png') {
      const url = URL.createObjectURL(file);
      setValue(`logos.${logoType}`, url);
      
      // Track the file for API upload
      const logoFileKey = `logo${logoType.charAt(0).toUpperCase() + logoType.slice(1)}` as keyof typeof uploadedFiles;
      setUploadedFiles(prev => ({
        ...prev,
        [logoFileKey]: file
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
    if (logoRefs[logoType].current) {
      logoRefs[logoType].current!.value = "";
    }
    
    // Remove tracked file
    const logoFileKey = `logo${logoType.charAt(0).toUpperCase() + logoType.slice(1)}` as keyof typeof uploadedFiles;
    setUploadedFiles(prev => ({
      ...prev,
      [logoFileKey]: undefined
    }));
  };

  const removeScreenshot = (index: number) => {
    if (screenshots.length > 1) {
      const updated = screenshots.filter((_, i) => i !== index);
      setValue("screenshots", updated);
      // Update refs array
      screenshotRefs.current = screenshotRefs.current.filter((_, i) => i !== index);
      
      // Remove tracked file
      setUploadedFiles(prev => {
        const newScreenshots = [...(prev.screenshots || [])];
        newScreenshots.splice(index, 1);
        return {
          ...prev,
          screenshots: newScreenshots
        };
      });
    } else {
      // If it's the last screenshot, just clear it
      setValue("screenshots", [""]);
      if (screenshotRefs.current[0]) {
        screenshotRefs.current[0]!.value = "";
      }
      
      // Clear tracked files
      setUploadedFiles(prev => ({
        ...prev,
        screenshots: []
      }));
    }
  };

  const addScreenshot = () => {
    if (screenshots.length < 5) {
      setValue("screenshots", [...screenshots, ""]);
      screenshotRefs.current.push(null);
    }
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
        logoSmall: uploadedFiles.logoSmall,
        logoWide: uploadedFiles.logoWide,
        logoMedium: uploadedFiles.logoMedium,
        logoLarge: uploadedFiles.logoLarge,
        logoHero: uploadedFiles.logoHero,
        screenshots: filteredScreenshotFiles
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-base font-semibold">Logos</Label>
          <p className="text-xs text-muted-foreground">
            Upload PNG format logos only. All logos should have transparent backgrounds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Small Logo (48x48)</Label>
            <div className="space-y-2">
              <Input
                ref={logoRefs.small}
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload('small', file);
                }}
                className="cursor-pointer"
              />
              {logos.small && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <img src={logos.small} alt="Small logo preview" className="w-12 h-12 object-contain rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLogo('small')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Medium Logo (90x90)</Label>
            <div className="space-y-2">
              <Input
                ref={logoRefs.medium}
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload('medium', file);
                }}
                className="cursor-pointer"
              />
              {logos.medium && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <img src={logos.medium} alt="Medium logo preview" className="w-16 h-16 object-contain rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLogo('medium')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
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
          
          <div className="space-y-2">
            <Label className="text-sm">Wide Logo (255x115)</Label>
            <div className="space-y-2">
              <Input
                ref={logoRefs.wide}
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload('wide', file);
                }}
                className="cursor-pointer"
              />
              {logos.wide && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <img src={logos.wide} alt="Wide logo preview" className="w-24 h-12 object-contain rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLogo('wide')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm">Hero Logo (815x300)</Label>
            <div className="space-y-2">
              <Input
                ref={logoRefs.hero}
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload('hero', file);
                }}
                className="cursor-pointer"
              />
              {logos.hero && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <img src={logos.hero} alt="Hero logo preview" className="w-32 h-12 object-contain rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLogo('hero')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Screenshots (Max 5)</Label>
          {screenshots.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addScreenshot}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Screenshot
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  ref={(el) => {
                    screenshotRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleScreenshotUpload(index, file);
                  }}
                  className="flex-1 cursor-pointer"
                  placeholder={`Screenshot ${index + 1}`}
                />
                {screenshots.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeScreenshot(index)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {screenshot && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1} preview`} 
                    className="w-24 h-14 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentScreenshots = [...screenshots];
                      currentScreenshots[index] = "";
                      setValue("screenshots", currentScreenshots);
                      if (screenshotRefs.current[index]) {
                        screenshotRefs.current[index]!.value = "";
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Upload up to 5 PNG screenshots to showcase your offer (1280x720 recommended, max 5MB each)
        </p>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
