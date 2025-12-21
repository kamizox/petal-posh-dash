import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  skinType: string;
  allergies: string[];
  purchases: number;
  lastVisit: string;
}

interface CustomerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Customer) => void;
  customer?: Customer | null;
}

const commonAllergies = [
  "Fragrance",
  "Parabens",
  "Alcohol",
  "Essential Oils",
  "Sulfates",
  "Retinol",
  "Salicylic Acid",
  "Vitamin C",
  "Niacinamide",
  "AHA/BHA",
];

export default function CustomerFormModal({
  open,
  onOpenChange,
  onSave,
  customer,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    skinType: "",
    allergies: [] as string[],
  });
  const [allergyInput, setAllergyInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        skinType: customer.skinType,
        allergies: customer.allergies,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        skinType: "",
        allergies: [],
      });
    }
    setErrors({});
    setAllergyInput("");
  }, [customer, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.skinType) {
      newErrors.skinType = "Please select a skin type";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: customer?.id || Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      skinType: formData.skinType,
      allergies: formData.allergies,
      purchases: customer?.purchases || 0,
      lastVisit: customer?.lastVisit || "Just now",
    };
    
    onSave(newCustomer);
    onOpenChange(false);
  };

  const addAllergy = (allergy: string) => {
    const trimmed = allergy.trim();
    if (trimmed && !formData.allergies.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, trimmed],
      }));
    }
    setAllergyInput("");
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy),
    }));
  };

  const handleAllergyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAllergy(allergyInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-white/20 bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {customer ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter customer name"
              className={`rounded-xl h-11 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive animate-fade-in">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 234-567-8900"
              className={`rounded-xl h-11 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {errors.phone && (
              <p className="text-xs text-destructive animate-fade-in">{errors.phone}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="customer@email.com"
              className={`rounded-xl h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-destructive animate-fade-in">{errors.email}</p>
            )}
          </div>

          {/* Skin Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Skin Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.skinType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, skinType: value }))}
            >
              <SelectTrigger className={`rounded-xl h-11 ${errors.skinType ? 'border-destructive focus:ring-destructive' : ''}`}>
                <SelectValue placeholder="Select skin type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-card">
                <SelectItem value="Oily">Oily</SelectItem>
                <SelectItem value="Dry">Dry</SelectItem>
                <SelectItem value="Sensitive">Sensitive</SelectItem>
                <SelectItem value="Combination">Combination</SelectItem>
              </SelectContent>
            </Select>
            {errors.skinType && (
              <p className="text-xs text-destructive animate-fade-in">{errors.skinType}</p>
            )}
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Allergies</Label>
            <div className="space-y-3">
              <Input
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={handleAllergyKeyDown}
                placeholder="Type and press Enter to add..."
                className="rounded-xl h-11"
              />
              
              {/* Quick add suggestions */}
              <div className="flex flex-wrap gap-2">
                {commonAllergies
                  .filter(a => !formData.allergies.includes(a))
                  .slice(0, 5)
                  .map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="outline"
                      className="rounded-full cursor-pointer hover:bg-accent/50 transition-colors text-xs"
                      onClick={() => addAllergy(allergy)}
                    >
                      + {allergy}
                    </Badge>
                  ))}
              </div>

              {/* Selected allergies */}
              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-destructive/5 rounded-xl border border-destructive/20">
                  {formData.allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="destructive"
                      className="rounded-full flex items-center gap-1 pr-1"
                    >
                      {allergy}
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="ml-1 hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90"
          >
            {customer ? "Save Changes" : "Add Customer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
