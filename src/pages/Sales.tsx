import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCustomers, Customer } from "@/hooks/useCustomers";
import CustomerSelector from "@/components/Sales/CustomerSelector";
import CustomerFormModal from "@/components/Modals/CustomerFormModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [changeCustomerDialogOpen, setChangeCustomerDialogOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
  
  const { customers, addCustomer } = useCustomers();

  const availableProducts: Product[] = [
    { id: 1, name: "Vitamin C Serum", brand: "The Ordinary", price: 45.00, stock: 23 },
    { id: 2, name: "Hyaluronic Acid", brand: "CeraVe", price: 38.00, stock: 45 },
    { id: 3, name: "Retinol Night Cream", brand: "Neutrogena", price: 52.00, stock: 12 },
    { id: 4, name: "Gentle Cleanser", brand: "Cetaphil", price: 32.00, stock: 67 },
    { id: 5, name: "SPF 50 Sunscreen", brand: "La Roche-Posay", price: 48.00, stock: 8 },
  ];

  const handleSelectCustomer = (customer: Customer | null) => {
    if (customer === null && cart.length > 0) {
      // Trying to deselect customer with items in cart
      setChangeCustomerDialogOpen(true);
      setPendingCustomer(null);
      return;
    }
    
    if (customer && selectedCustomer && cart.length > 0) {
      // Trying to change customer with items in cart
      setChangeCustomerDialogOpen(true);
      setPendingCustomer(customer);
      return;
    }
    
    setSelectedCustomer(customer);
  };

  const confirmCustomerChange = () => {
    setCart([]);
    setSelectedCustomer(pendingCustomer);
    setChangeCustomerDialogOpen(false);
    setPendingCustomer(null);
  };

  const addToCart = (product: Product) => {
    if (!selectedCustomer) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleCompleteSale = () => {
    if (!selectedCustomer || cart.length === 0) return;

    // Simulate saving sale
    const saleData = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: cart,
      subtotal,
      tax,
      total,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Sale completed:", saleData);
    
    toast.success(`Sale completed for ${selectedCustomer.name}`, {
      description: `Total: $${total.toFixed(2)}`,
    });

    // Clear cart and customer
    setCart([]);
    setSelectedCustomer(null);
  };

  const handleSaveNewCustomer = (customer: Customer) => {
    addCustomer(customer);
    setSelectedCustomer(customer);
    toast.success("Customer added successfully");
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const filteredProducts = availableProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isCartDisabled = !selectedCustomer;

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Sales & Billing</h1>
        <p className="text-muted-foreground">Create new sales transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-white/20 shadow-card">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 rounded-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isCartDisabled && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-sm text-amber-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Please select a customer to start the sale.</span>
                </div>
              )}
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${
                      isCartDisabled ? 'opacity-60' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <Badge variant="secondary" className="rounded-full text-xs mt-1">
                        Stock: {product.stock}
                      </Badge>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="font-bold text-lg text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="btn-primary"
                        disabled={isCartDisabled}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <Card className="rounded-3xl border-white/20 shadow-card sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Selector */}
              <CustomerSelector
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={handleSelectCustomer}
                onAddNewCustomer={() => setCustomerModalOpen(true)}
                disabled={cart.length > 0}
              />

              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-accent/50 rounded-2xl">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-sm flex-1">{item.name}</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              -
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              +
                            </Button>
                          </div>
                          <span className="font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full btn-primary mt-4"
                    onClick={handleCompleteSale}
                    disabled={!selectedCustomer || cart.length === 0}
                  >
                    Complete Sale
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        open={customerModalOpen}
        onOpenChange={setCustomerModalOpen}
        onSave={handleSaveNewCustomer}
        customer={null}
      />

      {/* Change Customer Confirmation Dialog */}
      <AlertDialog open={changeCustomerDialogOpen} onOpenChange={setChangeCustomerDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Customer?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the customer will clear all items from the cart. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCustomerChange} className="rounded-xl bg-primary hover:bg-primary/90">
              Clear Cart & Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
