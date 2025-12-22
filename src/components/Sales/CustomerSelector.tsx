import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, User, Plus, X, AlertTriangle, ChevronDown } from "lucide-react";
import { Customer } from "@/hooks/useCustomers";

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onAddNewCustomer: () => void;
  disabled?: boolean;
}

export default function CustomerSelector({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer,
  disabled,
}: CustomerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const getSkinTypeBadgeClass = (skinType: string) => {
    const colors: Record<string, string> = {
      Oily: "bg-blue-100 text-blue-700",
      Dry: "bg-orange-100 text-orange-700",
      Sensitive: "bg-pink-100 text-pink-700",
      Combination: "bg-purple-100 text-purple-700",
    };
    return colors[skinType] || "bg-gray-100 text-gray-700";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (selectedCustomer) {
    return (
      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/30 rounded-2xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{selectedCustomer.name}</span>
                <Badge className={`${getSkinTypeBadgeClass(selectedCustomer.skinType)} rounded-full text-xs`}>
                  {selectedCustomer.skinType}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectCustomer(null)}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Change
          </Button>
        </div>
        {selectedCustomer.allergies.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-amber-600 font-medium">Allergies:</span>
            <div className="flex flex-wrap gap-1">
              {selectedCustomer.allergies.map((allergy, i) => (
                <Badge key={i} variant="outline" className="rounded-full text-xs py-0 px-2 border-amber-300 text-amber-600">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-2 p-3 border border-dashed border-primary/40 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">Select a customer</p>
          <p className="text-xs text-muted-foreground/70">Required before adding products</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border-white/20 shadow-lg bg-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl h-10 text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No customers found
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => {
                    onSelectCustomer(customer);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                  </div>
                  <Badge className={`${getSkinTypeBadgeClass(customer.skinType)} rounded-full text-xs`}>
                    {customer.skinType}
                  </Badge>
                  {customer.allergies.length > 0 && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-border bg-accent/30">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
              onClick={() => {
                onAddNewCustomer();
                setIsOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Customer
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
