import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, ShoppingCart, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCustomers, Customer } from "@/hooks/useCustomers";
import { useProductBatches, AggregatedProduct } from "@/hooks/useProductBatches";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, differenceInDays } from "date-fns";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  batchId: string;
  expiryDate: string;
}

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [changeCustomerDialogOpen, setChangeCustomerDialogOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
  
  const { customers, addCustomer } = useCustomers();
  const { aggregatedProducts, getEarliestBatch, consumeStock } = useProductBatches();

  const handleSelectCustomer = (customer: Customer | null) => {
    if (customer === null && cart.length > 0) {
      setChangeCustomerDialogOpen(true);
      setPendingCustomer(null);
      return;
    }
    
    if (customer && selectedCustomer && cart.length > 0) {
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

  const addToCart = (product: AggregatedProduct) => {
    if (!selectedCustomer) return;
    
    // Get the earliest expiring batch (FIFO)
    const earliestBatch = getEarliestBatch(product.productId);
    
    if (!earliestBatch || earliestBatch.stock <= 0) {
      toast.error("No stock available for this product");
      return;
    }

    const existingItem = cart.find(
      (item) => item.id === product.productId && item.batchId === earliestBatch.id
    );

    if (existingItem) {
      // Check if we have enough stock in this batch
      if (existingItem.quantity >= earliestBatch.stock) {
        toast.error("Maximum stock reached for this batch");
        return;
      }
      
      setCart(cart.map((item) =>
        item.id === product.productId && item.batchId === earliestBatch.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          id: product.productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          batchId: earliestBatch.id,
          expiryDate: earliestBatch.expiryDate,
        },
      ]);
    }

    // Show which batch was selected
    const daysUntilExpiry = differenceInDays(new Date(earliestBatch.expiryDate), new Date());
    if (daysUntilExpiry <= 30) {
      toast.info(`Added from batch ${earliestBatch.batchNumber} (expires in ${daysUntilExpiry} days)`);
    }
  };

  const removeFromCart = (id: number, batchId: string) => {
    setCart(cart.filter((item) => !(item.id === id && item.batchId === batchId)));
  };

  const updateQuantity = (id: number, batchId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, batchId);
    } else {
      setCart(cart.map((item) =>
        item.id === id && item.batchId === batchId ? { ...item, quantity } : item
      ));
    }
  };

  const handleCompleteSale = () => {
    if (!selectedCustomer || cart.length === 0) return;

    // Process stock consumption for each cart item
    for (const item of cart) {
      const result = consumeStock(item.id, item.quantity);
      if (!result.success) {
        toast.error(`Error processing ${item.name}: ${result.error}`);
        return;
      }
    }

    const saleData = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: cart.map((item) => ({
        ...item,
        batchId: item.batchId,
      })),
      subtotal,
      tax,
      total,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Sale completed with FIFO:", saleData);
    
    toast.success(`Sale completed for ${selectedCustomer.name}`, {
      description: `Total: $${total.toFixed(2)}`,
    });

    setCart([]);
    setSelectedCustomer(null);
  };

  const handleSaveNewCustomer = (customer: Customer) => {
    addCustomer(customer);
    setSelectedCustomer(customer);
    toast.success("Customer added successfully");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const filteredProducts = aggregatedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isCartDisabled = !selectedCustomer;

  const getExpiryBadge = (expiryDate: string) => {
    const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
    
    if (daysUntilExpiry <= 30) {
      return (
        <Badge variant="destructive" className="rounded-full text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          {daysUntilExpiry}d
        </Badge>
      );
    } else if (daysUntilExpiry <= 90) {
      return (
        <Badge variant="secondary" className="rounded-full text-xs bg-amber-100 text-amber-700">
          <Calendar className="h-3 w-3 mr-1" />
          {daysUntilExpiry}d
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Sales & Billing</h1>
        <p className="text-muted-foreground">Create new sales transactions (FIFO: earliest expiry sold first)</p>
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
                {filteredProducts.map((product) => {
                  const earliestBatch = getEarliestBatch(product.productId);
                  const daysUntilExpiry = earliestBatch 
                    ? differenceInDays(new Date(earliestBatch.expiryDate), new Date())
                    : null;

                  return (
                    <div
                      key={product.productId}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${
                        isCartDisabled ? "opacity-60" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{product.name}</h4>
                          {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="rounded-full text-xs">
                                  Expiring Soon
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                Earliest batch expires on {format(new Date(product.earliestExpiry), "MMM d, yyyy")}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="rounded-full text-xs">
                            Stock: {product.totalStock}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {product.batches.length} batch{product.batches.length > 1 ? "es" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-lg text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="btn-primary"
                          disabled={isCartDisabled || product.totalStock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
                      <div key={`${item.id}-${item.batchId}`} className="p-3 bg-accent/50 rounded-2xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{item.name}</h5>
                            {getExpiryBadge(item.expiryDate)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id, item.batchId)}
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
                              onClick={() => updateQuantity(item.id, item.batchId, item.quantity - 1)}
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              -
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.batchId, item.quantity + 1)}
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
            <AlertDialogAction
              onClick={confirmCustomerChange}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              Clear Cart & Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
