import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface PreviewAudienceEditProps {
  data: {
    previewAudience?: string[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const PreviewAudienceEdit = ({ data, onSave, onCancel }: PreviewAudienceEditProps) => {
  const [emails, setEmails] = useState<string[]>(data?.previewAudience || []);
  const [newEmail, setNewEmail] = useState("");

  const addEmail = () => {
    if (!newEmail.trim()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emails.includes(newEmail)) {
      toast.error("Email already added");
      return;
    }

    if (emails.length >= 10) {
      toast.error("Maximum 10 email addresses allowed");
      return;
    }

    setEmails([...emails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSave = () => {
    onSave({ previewAudience: emails });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newEmail">Add Email Address</Label>
        <div className="flex gap-2">
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
            placeholder="email@example.com"
          />
          <Button type="button" size="sm" onClick={addEmail} disabled={emails.length >= 10}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {emails.length} / 10 email addresses
        </p>
      </div>

      {emails.length > 0 && (
        <div className="space-y-2">
          <Label>Preview Audience</Label>
          <div className="space-y-2">
            {emails.map((email, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-foreground">{email}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmail(email)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
