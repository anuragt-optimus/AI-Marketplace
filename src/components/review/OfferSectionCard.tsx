import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineAIButton } from "./InlineAIButton";
import { cn } from "@/lib/utils";

interface OfferSectionCardProps {
  sectionId: string;
  title: string;
  children: ReactNode;
  editComponent?: ReactNode;
  isActive: boolean;
  isEditing?: boolean;
  onEdit: (sectionId: string, sectionName: string) => void;
  className?: string;
}

export const OfferSectionCard = ({
  sectionId,
  title,
  children,
  editComponent,
  isActive,
  isEditing = false,
  onEdit,
  className
}: OfferSectionCardProps) => {
  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-md",
        isActive && "ring-2 ring-primary shadow-lg",
        isEditing && "ring-2 ring-primary shadow-lg",
        className
      )}
    >
      <CardHeader className="relative">
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        {!isEditing && (
          <InlineAIButton
            sectionId={sectionId}
            sectionName={title}
            onClick={() => onEdit(sectionId, title)}
          />
        )}
      </CardHeader>
      <CardContent>
        {isEditing && editComponent ? editComponent : children}
      </CardContent>
    </Card>
  );
};
