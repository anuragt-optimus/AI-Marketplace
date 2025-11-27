import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface OfferListingSectionProps {
  data: {
    name?: string;
    searchSummary?: string;
    shortDescription?: string;
    description?: string;
    gettingStartedInstructions?: string;
    contacts?: {
      support?: {
        name?: string;
        email?: string;
        phone?: string;
        url?: string;
      };
      engineering?: {
        name?: string;
        email?: string;
        phone?: string;
      };
    };
    marketingUrls?: {
      website?: string;
      privacyPolicy?: string;
      termsOfUse?: string;
      supportUrl?: string;
    };
    media?: {
      logos?: {
        small?: string;
        medium?: string;
        large?: string;
        wide?: string;
        hero?: string;
      };
      screenshots?: string[];
      videos?: string[];
    };
  };
}

export const OfferListingSection = ({ data }: OfferListingSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Listing Information */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Offer Name</h4>
          <p className="text-sm text-foreground">{data.name || "Not set"}</p>
        </div>

        {data.searchSummary && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Search Summary</h4>
            <p className="text-sm text-muted-foreground">{data.searchSummary}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.searchSummary.length} / 100 characters
            </p>
          </div>
        )}

        {data.shortDescription && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Short Description</h4>
            <p className="text-sm text-muted-foreground">{data.shortDescription}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {data.shortDescription.length} / 200 characters
              </p>
<<<<<<< HEAD
               <Badge variant={data.shortDescription.length <= 200 ? "default" : "destructive"}>
                {data.shortDescription.length <= 200 ? "✓ Valid" : "⚠️ Too long"}
              </Badge> 
=======
              <Badge variant={data.shortDescription.length <= 200 ? "default" : "destructive"}>
                {data.shortDescription.length <= 200 ? "✓ Valid" : "⚠️ Too long"}
              </Badge>
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
            </div>
          </div>
        )}

        {data.description && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>
        )}

        {data.gettingStartedInstructions && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Getting Started Instructions</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {data.gettingStartedInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {(data.contacts?.support || data.contacts?.engineering) && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Contacts</h4>
          <div className="space-y-3">
            {data.contacts.support && (
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="text-xs font-medium text-foreground">Support Contact</p>
                {data.contacts.support.name && (
                  <p className="text-sm text-foreground">{data.contacts.support.name}</p>
                )}
                {data.contacts.support.email && (
                  <p className="text-sm text-primary">{data.contacts.support.email}</p>
                )}
                {data.contacts.support.phone && (
                  <p className="text-sm text-muted-foreground">{data.contacts.support.phone}</p>
                )}
                {data.contacts.support.url && (
                  <a href={data.contacts.support.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Support URL <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
            
            {data.contacts.engineering && (
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="text-xs font-medium text-foreground">Engineering Contact</p>
                {data.contacts.engineering.name && (
                  <p className="text-sm text-foreground">{data.contacts.engineering.name}</p>
                )}
                {data.contacts.engineering.email && (
                  <p className="text-sm text-primary">{data.contacts.engineering.email}</p>
                )}
                {data.contacts.engineering.phone && (
                  <p className="text-sm text-muted-foreground">{data.contacts.engineering.phone}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Marketing URLs */}
      {data.marketingUrls && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Marketing URLs</h4>
          <div className="space-y-2">
            {data.marketingUrls.website && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-foreground">Website</span>
                <a href={data.marketingUrls.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  {data.marketingUrls.website} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {data.marketingUrls.privacyPolicy && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-foreground">Privacy Policy</span>
                <a href={data.marketingUrls.privacyPolicy} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {data.marketingUrls.termsOfUse && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-foreground">Terms of Use</span>
                <a href={data.marketingUrls.termsOfUse} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {data.marketingUrls.supportUrl && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-foreground">Support URL</span>
                <a href={data.marketingUrls.supportUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media */}
      {data.media && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Media Assets</h4>
          <div className="space-y-4">
            {data.media.logos && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Logos</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(data.media.logos).map(([size, url]) => (
                    url && (
                      <div key={size} className="p-3 bg-muted rounded-lg text-center">
                        <img src={url} alt={`${size} logo`} className="w-16 h-16 mx-auto mb-2 object-contain" />
                        <p className="text-xs text-muted-foreground capitalize">{size}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {data.media.screenshots && data.media.screenshots.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Screenshots ({data.media.screenshots.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {data.media.screenshots.map((screenshot, idx) => (
                    <img key={idx} src={screenshot} alt={`Screenshot ${idx + 1}`} className="w-full h-32 object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}

            {data.media.videos && data.media.videos.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Videos ({data.media.videos.length})
                </p>
                <div className="space-y-2">
                  {data.media.videos.map((video, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded">
                      <a href={video} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        Video {idx + 1} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
