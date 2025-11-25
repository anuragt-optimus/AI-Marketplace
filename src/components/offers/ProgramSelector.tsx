import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Program } from "@/constants/mockPartnerCenterData";
import { cn } from "@/lib/utils";

interface ProgramSelectorProps {
  programs: Program[];
  selectedProgram: string | null;
  onSelect: (programId: string) => void;
  disabled?: boolean;
}

export const ProgramSelector = ({
  programs,
  selectedProgram,
  onSelect,
  disabled = false,
}: ProgramSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Program</Label>
      <RadioGroup
        value={selectedProgram || ""}
        onValueChange={onSelect}
        disabled={disabled}
        className="grid gap-3"
      >
        {programs.map((program) => {
          const Icon = program.icon;
          return (
            <Card
              key={program.id}
              className={cn(
                "relative p-4 cursor-pointer transition-all border-2",
                selectedProgram === program.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onSelect(program.id)}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value={program.id}
                  id={program.id}
                  className="mt-0.5"
                  disabled={disabled}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <Label
                      htmlFor={program.id}
                      className="font-medium cursor-pointer"
                    >
                      {program.name}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {program.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </RadioGroup>
    </div>
  );
};
