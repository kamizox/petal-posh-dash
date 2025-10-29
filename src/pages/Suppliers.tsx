import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, MapPin, Package, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import SupplierFormModal from "@/components/Modals/SupplierFormModal";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: string;
  notes?: string;
  lastRestockDate?: string;
}

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "BeautyPro Supplies",
      contactPerson: "Sarah Johnson",
      email: "sarah@beautypro.com",
      phone: "+1 (555) 123-4567",
      address: "123 Beauty Ave, LA, CA 90001",
      productsSupplied: "Serums, Creams",
      lastRestockDate: "2025-01-15",
    },
    {
      id: 2,
      name: "SkinCare Wholesale Co.",
      contactPerson: "Michael Chen",
      email: "michael@skincarewholesale.com",
      phone: "+1 (555) 987-6543",
      address: "456 Supply St, NYC, NY 10001",
      productsSupplied: "Oils, Masks, Cleansers",
      lastRestockDate: "2025-01-20",
    },
    {
      id: 3,
      name: "Premium Cosmetics Ltd",
      contactPerson: "Emma Williams",
      email: "emma@premiumcosmetics.com",
      phone: "+1 (555) 456-7890",
      address: "789 Trade Blvd, Miami, FL 33101",
      productsSupplied: "Sunscreen, Moisturizers",
      lastRestockDate: "2025-01-10",
    },
  ]);

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSaveSupplier = (supplierData: Supplier) => {
    if (selectedSupplier) {
      // Edit existing
      setSuppliers(suppliers.map((s) => (s.id === selectedSupplier.id ? { ...supplierData, id: s.id } : s)));
      toast({
        title: "Supplier Updated",
        description: "Supplier information has been updated successfully.",
      });
    } else {
      // Add new
      const newSupplier = { ...supplierData, id: Date.now() };
      setSuppliers([...suppliers, newSupplier]);
      toast({
        title: "Supplier Added",
        description: "New supplier has been added successfully.",
      });
    }
  };

  const handleDeleteSupplier = (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
      toast({
        title: "Supplier Deleted",
        description: "Supplier has been removed from the system.",
        variant: "destructive",
      });
    }
  };

  const handleReorder = (supplier: Supplier) => {
    toast({
      title: "Reorder Request Sent",
      description: `Reorder request sent to ${supplier.name}`,
    });
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Supplier Management</h1>
        <p className="text-muted-foreground">Manage suppliers and track restock information</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 rounded-full h-12 border-border bg-white/80"
          />
        </div>
        <Button onClick={handleAddSupplier} className="rounded-full h-12 px-6">
          <Plus className="h-5 w-5 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="rounded-3xl border-white/20 shadow-card hover:shadow-card-hover transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{supplier.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditSupplier(supplier)} className="rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{supplier.address}</span>
                </div>
              </div>

              {/* Products Supplied */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Products Supplied:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supplier.productsSupplied.split(",").map((product, idx) => (
                    <Badge key={idx} variant="secondary" className="rounded-full text-xs">
                      {product.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Restock */}
              {supplier.lastRestockDate && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Last Restock: {new Date(supplier.lastRestockDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button onClick={() => handleReorder(supplier)} className="flex-1 rounded-full" size="sm">
                  Reorder
                </Button>
                <Button variant="outline" className="flex-1 rounded-full" size="sm">
                  Track Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupplier}
        supplier={selectedSupplier}
      />
    </div>
  );
}
