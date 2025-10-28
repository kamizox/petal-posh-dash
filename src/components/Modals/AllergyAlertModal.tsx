import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AllergyAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  allergies: string[];
}

export default function AllergyAlertModal({
  open,
  onOpenChange,
  customerName,
  allergies,
}: AllergyAlertModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-destructive/20">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">
            Allergy Alert!
          </DialogTitle>
          <DialogDescription className="text-center">
            <span className="font-semibold text-foreground">{customerName}</span> has the following allergies:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {allergies.map((allergy, index) => (
            <div
              key={index}
              className="p-3 bg-destructive/5 rounded-xl border border-destructive/20 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span className="font-medium text-sm">{allergy}</span>
            </div>
          ))}
        </div>

        <div className="bg-accent/50 p-4 rounded-2xl">
          <p className="text-sm text-foreground font-medium mb-2">
            💡 Recommendation
          </p>
          <p className="text-xs text-muted-foreground">
            Please suggest products that are free from these ingredients to ensure customer safety.
          </p>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full btn-primary"
        >
          I Understand
        </Button>
      </DialogContent>
    </Dialog>
  );
}
