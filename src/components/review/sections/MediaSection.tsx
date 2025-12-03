import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface MediaSectionProps {
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
}

export const MediaSection = ({ data }: MediaSectionProps) => {
  const hasLogos = data.logos && Object.values(data.logos).some(url => url && url.trim() !== "");
  const hasScreenshots = data.screenshots && data.screenshots.length > 0;

  if (!hasLogos && !hasScreenshots) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No media assets uploaded yet</p>
        <p className="text-sm">Add logos and screenshots to showcase your offer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logos Section */}
      {hasLogos && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Logos</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.logos?.small && (
              <div className="p-3 bg-muted rounded-lg text-center space-y-2">
                <img 
                  src={data.logos.small} 
                  alt="Small logo" 
                  className="w-12 h-12 mx-auto object-contain bg-white rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-12 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center text-xs text-muted-foreground">Error</div>';
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Small (48x48)</p>
              </div>
            )}
            
            {data.logos?.medium && (
              <div className="p-3 bg-muted rounded-lg text-center space-y-2">
                <img 
                  src={data.logos.medium} 
                  alt="Medium logo" 
                  className="w-16 h-16 mx-auto object-contain bg-white rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-16 h-16 mx-auto bg-gray-200 rounded border flex items-center justify-center text-xs text-muted-foreground">Error</div>';
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Medium (90x90)</p>
              </div>
            )}
            
            {data.logos?.large && (
              <div className="p-3 bg-muted rounded-lg text-center space-y-2">
                <img 
                  src={data.logos.large} 
                  alt="Large logo" 
                  className="w-20 h-20 mx-auto object-contain bg-white rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-20 h-20 mx-auto bg-gray-200 rounded border flex items-center justify-center text-xs text-muted-foreground">Error</div>';
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Large (216x216)</p>
              </div>
            )}
            
            {data.logos?.wide && (
              <div className="p-3 bg-muted rounded-lg text-center space-y-2">
                <img 
                  src={data.logos.wide} 
                  alt="Wide logo" 
                  className="w-24 h-12 mx-auto object-contain bg-white rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-24 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center text-xs text-muted-foreground">Error</div>';
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Wide (255x115)</p>
              </div>
            )}
            
            {data.logos?.hero && (
              <div className="p-3 bg-muted rounded-lg text-center space-y-2 sm:col-span-2 lg:col-span-3">
                <img 
                  src={data.logos.hero} 
                  alt="Hero logo" 
                  className="w-32 h-12 mx-auto object-contain bg-white rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-32 h-12 mx-auto bg-gray-200 rounded border flex items-center justify-center text-xs text-muted-foreground">Error</div>';
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Hero (815x300)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Screenshots Section */}
      {hasScreenshots && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Screenshots ({data.screenshots?.length || 0}/5)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.screenshots?.map((screenshot, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={screenshot} 
                  alt={`Screenshot ${idx + 1}`} 
                  className="w-full h-32 sm:h-40 object-cover rounded border hover:shadow-md transition-shadow"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-32 sm:h-40 bg-gray-200 rounded border flex items-center justify-center text-sm text-muted-foreground">Image not found</div>';
                    }
                  }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={screenshot} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Screenshot {idx + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
