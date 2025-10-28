import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Phone, Mail } from "lucide-react";
import AllergyAlertModal from "@/components/Modals/AllergyAlertModal";

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

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);

  const customers: Customer[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+1 234-567-8901",
      email: "sarah.j@email.com",
      skinType: "Oily",
      allergies: ["Fragrance", "Parabens"],
      purchases: 24,
      lastVisit: "2 days ago",
    },
    {
      id: 2,
      name: "Emma Davis",
      phone: "+1 234-567-8902",
      email: "emma.d@email.com",
      skinType: "Dry",
      allergies: ["Alcohol"],
      purchases: 18,
      lastVisit: "5 days ago",
    },
    {
      id: 3,
      name: "Olivia Smith",
      phone: "+1 234-567-8903",
      email: "olivia.s@email.com",
      skinType: "Sensitive",
      allergies: ["Fragrance", "Essential Oils", "Sulfates"],
      purchases: 31,
      lastVisit: "1 day ago",
    },
    {
      id: 4,
      name: "Sophia Brown",
      phone: "+1 234-567-8904",
      email: "sophia.b@email.com",
      skinType: "Combination",
      allergies: [],
      purchases: 12,
      lastVisit: "1 week ago",
    },
  ];

  const getSkinTypeBadge = (skinType: string) => {
    const colors: Record<string, string> = {
      Oily: "bg-blue-100 text-blue-700",
      Dry: "bg-orange-100 text-orange-700",
      Sensitive: "bg-pink-100 text-pink-700",
      Combination: "bg-purple-100 text-purple-700",
    };
    return colors[skinType] || "bg-gray-100 text-gray-700";
  };

  const handleViewAllergies = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAllergyModalOpen(true);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Customer Profiles</h1>
        <p className="text-muted-foreground">Manage customer information and purchase history</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search customers by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 rounded-full h-12 border-border bg-white/80"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="rounded-3xl border-white/20 shadow-card hover:shadow-hover transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{customer.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                </div>
                <Badge className={`${getSkinTypeBadge(customer.skinType)} rounded-full px-3 py-1`}>
                  {customer.skinType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-accent/50 rounded-2xl">
                  <p className="text-xs text-muted-foreground mb-1">Total Purchases</p>
                  <p className="text-xl font-bold text-primary">{customer.purchases}</p>
                </div>
                <div className="p-3 bg-mint/50 rounded-2xl">
                  <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
                  <p className="text-sm font-semibold">{customer.lastVisit}</p>
                </div>
              </div>

              {customer.allergies.length > 0 && (
                <div className="p-3 bg-destructive/5 rounded-2xl border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold text-destructive">
                      Allergies Detected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {customer.allergies.slice(0, 2).map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="rounded-full text-xs">
                        {allergy}
                      </Badge>
                    ))}
                    {customer.allergies.length > 2 && (
                      <Badge variant="destructive" className="rounded-full text-xs">
                        +{customer.allergies.length - 2} more
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => handleViewAllergies(customer)}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    View All Allergies
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Allergy Alert Modal */}
      {selectedCustomer && (
        <AllergyAlertModal
          open={allergyModalOpen}
          onOpenChange={setAllergyModalOpen}
          customerName={selectedCustomer.name}
          allergies={selectedCustomer.allergies}
        />
      )}
    </div>
  );
}
