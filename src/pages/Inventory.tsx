import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Plus, Edit, Trash2, Bell } from "lucide-react";
import { useState } from "react";
import ProductFormModal from "@/components/Modals/ProductFormModal";
import LowStockAlertModal from "@/components/Modals/LowStockAlertModal";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  stock: number;
  expiryDate: string;
  price: number;
}

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Vitamin C Serum", brand: "The Ordinary", category: "Serums", stock: 23, expiryDate: "2025-08-15", price: 45.00 },
    { id: 2, name: "Hyaluronic Acid", brand: "CeraVe", category: "Serums", stock: 45, expiryDate: "2025-11-20", price: 38.00 },
    { id: 3, name: "Retinol Night Cream", brand: "Neutrogena", category: "Moisturizers", stock: 12, expiryDate: "2025-03-10", price: 52.00 },
    { id: 4, name: "Gentle Cleanser", brand: "Cetaphil", category: "Cleansers", stock: 67, expiryDate: "2026-01-05", price: 32.00 },
    { id: 5, name: "SPF 50 Sunscreen", brand: "La Roche-Posay", category: "Sunscreen", stock: 8, expiryDate: "2025-02-28", price: 48.00 },
    { id: 6, name: "Niacinamide Serum", brand: "The Inkey List", category: "Serums", stock: 34, expiryDate: "2025-09-18", price: 28.00 },
  ]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Product) => {
    if (selectedProduct) {
      // Edit existing
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...productData, id: p.id } : p)));
      toast({
        title: "Product Updated",
        description: "Product information has been updated successfully.",
      });
    } else {
      // Add new
      const newProduct = { ...productData, id: Date.now() };
      setProducts([...products, newProduct]);
      toast({
        title: "Product Added",
        description: "New product has been added to inventory.",
      });
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Product Deleted",
        description: "Product has been removed from inventory.",
        variant: "destructive",
      });
    }
  };

  const lowStockProducts = products.filter((p) => p.stock < 15);

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilExpiry < 30) {
      return { status: "urgent", label: "Expiring Soon", color: "bg-destructive text-destructive-foreground" };
    } else if (daysUntilExpiry < 90) {
      return { status: "warning", label: "Monitor", color: "bg-orange-100 text-orange-700" };
    }
    return { status: "good", label: "Good", color: "bg-green-100 text-green-700" };
  };

  const getStockStatus = (stock: number) => {
    if (stock < 15) {
      return { status: "low", color: "text-destructive" };
    } else if (stock < 30) {
      return { status: "medium", color: "text-orange-600" };
    }
    return { status: "good", color: "text-green-600" };
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Product Inventory</h1>
        <p className="text-muted-foreground">Track stock levels and expiry dates</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 rounded-full h-12 border-border bg-white/80"
          />
        </div>
        <Button
          onClick={() => setIsLowStockModalOpen(true)}
          variant="outline"
          className="rounded-full h-12 px-6"
          disabled={lowStockProducts.length === 0}
        >
          <Bell className="h-5 w-5 mr-2" />
          Low Stock ({lowStockProducts.length})
        </Button>
        <Button onClick={handleAddProduct} className="rounded-full h-12 px-6">
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table Card */}
      <Card className="rounded-3xl border-white/20 shadow-card">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Brand</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Category</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Expiry Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Price</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const expiryStatus = getExpiryStatus(product.expiryDate);
                  const stockStatus = getStockStatus(product.stock);

                  return (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{product.brand}</td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="rounded-full">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-semibold ${stockStatus.color}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {expiryStatus.status !== "good" && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm">{product.expiryDate}</span>
                        </div>
                        <Badge className={`${expiryStatus.color} rounded-full text-xs mt-1`}>
                          {expiryStatus.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                            className="rounded-full h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      <LowStockAlertModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        products={lowStockProducts}
        onReorder={(productId) => {
          toast({
            title: "Reorder Request",
            description: "Reorder request has been sent to the supplier.",
          });
        }}
      />
    </div>
  );
}
