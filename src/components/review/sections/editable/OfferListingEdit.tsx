import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AITextField } from "@/components/review/AITextField";

interface OfferListingEditProps {
  data: {
    name?: string;
    searchSummary?: string;
    description?: string;
    gettingStartedInstructions?: string;
    contacts?: {
      support?: { name?: string; email?: string; phone?: string; url?: string };
      engineering?: { name?: string; email?: string; phone?: string };
    };
    marketingUrls?: {
      website?: string;
      privacyPolicy?: string;
      termsOfUse?: string;
      supportUrl?: string;
    };
  };
  websiteUrl: string;
  offerId: string;
  existingOfferData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const OfferListingEdit = ({ data, websiteUrl, offerId, existingOfferData, onSave, onCancel, isSaving = false }: OfferListingEditProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: data?.name || "",
      searchSummary: data?.searchSummary || "",
      description: data?.description || "",
      gettingStartedInstructions: data?.gettingStartedInstructions || "",
      contacts: {
        support: {
          name: data?.contacts?.support?.name || "",
          email: data?.contacts?.support?.email || "",
          phone: data?.contacts?.support?.phone || "",
          url: data?.contacts?.support?.url || "",
        },
        engineering: {
          name: data?.contacts?.engineering?.name || "",
          email: data?.contacts?.engineering?.email || "",
          phone: data?.contacts?.engineering?.phone || "",
        },
      },
      marketingUrls: {
        website: data?.marketingUrls?.website || "",
        privacyPolicy: data?.marketingUrls?.privacyPolicy || "",
        termsOfUse: data?.marketingUrls?.termsOfUse || "",
        supportUrl: data?.marketingUrls?.supportUrl || "",
      },
    }
  });

  const searchSummary = watch("searchSummary");

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <AITextField
        fieldName="name"
        section="offer_listing"
        value={watch("name")}
        onChange={(val) => setValue("name", val)}
        label="Offer Name"
        placeholder="Enter offer name"
        maxLength={50}
        websiteUrl={websiteUrl}
        offerId={offerId}
        existingOfferData={existingOfferData}
      />

      <AITextField
        fieldName="searchSummary"
        section="offer_listing"
        value={watch("searchSummary")}
        onChange={(val) => setValue("searchSummary", val)}
        label="Search Summary"
        placeholder="Brief summary for search results"
        maxLength={100}
        websiteUrl={websiteUrl}
        offerId={offerId}
        existingOfferData={existingOfferData}
        showCharCount
      />

      <AITextField
        fieldName="description"
        section="offer_listing"
        value={watch("description")}
        onChange={(val) => setValue("description", val)}
        label="Full Description"
        placeholder="Detailed description with features, benefits, and use cases"
        multiline
        rows={8}
        websiteUrl={websiteUrl}
        offerId={offerId}
        existingOfferData={existingOfferData}
      />

      <AITextField
        fieldName="gettingStartedInstructions"
        section="offer_listing"
        value={watch("gettingStartedInstructions")}
        onChange={(val) => setValue("gettingStartedInstructions", val)}
        label="Getting Started Instructions"
        placeholder="Step-by-step guide to get started"
        multiline
        rows={6}
        websiteUrl={websiteUrl}
        offerId={offerId}
        existingOfferData={existingOfferData}
      />

      <div className="space-y-3">
        <Label>Support Contact</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input {...register("contacts.support.name")} placeholder="Contact name" />
          <Input {...register("contacts.support.email")} placeholder="Email" type="email" />
          <Input {...register("contacts.support.phone")} placeholder="Phone" />
          <Input {...register("contacts.support.url")} placeholder="Support URL" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Engineering Contact</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input {...register("contacts.engineering.name")} placeholder="Contact name" />
          <Input {...register("contacts.engineering.email")} placeholder="Email" type="email" />
          <Input {...register("contacts.engineering.phone")} placeholder="Phone" className="col-span-2" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Marketing URLs</Label>
        <Input {...register("marketingUrls.website")} placeholder="Website URL" />
        <Input {...register("marketingUrls.privacyPolicy")} placeholder="Privacy Policy URL" />
        <Input {...register("marketingUrls.termsOfUse")} placeholder="Terms of Use URL" />
        <Input {...register("marketingUrls.supportUrl")} placeholder="Support URL" />
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
