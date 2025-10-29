import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Package, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LowStockProduct {
  id: number;
  name: string;
  brand: string;
  stock: number;
  category: string;
  image?: string;
}

interface LowStockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: LowStockProduct[];
  onReorder: (productId: number) => void;
}

export default function LowStockAlertModal({ isOpen, onClose, products, onReorder }: LowStockAlertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-100">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Low Stock Alert</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {products.length} {products.length === 1 ? "product needs" : "products need"} immediate attention
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-accent/30 hover:bg-accent/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-sm font-semibold text-orange-600">Only {product.stock} left</span>
                </div>
              </div>

              <Button onClick={() => onReorder(product.id)} className="rounded-full" size="sm">
                Reorder
              </Button>
            </div>
          ))}
        </div>

        {/* Email Preview Section */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-cream-50 border border-pink-200">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Email Alert Preview</h4>
          </div>
          <div className="bg-white p-4 rounded-xl text-sm space-y-2">
            <p className="font-semibold">Subject: 🚨 Low Stock Alert - Action Required</p>
            <p className="text-muted-foreground">
              Hello Team,
              <br />
              <br />
              {products.length} product{products.length !== 1 ? "s are" : " is"} running low on stock and need immediate
              restocking:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              {products.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> - Only {p.stock} units remaining
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">
              Please review the inventory and contact suppliers to restock these products.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Close
          </Button>
          <Button className="rounded-full">
            <Mail className="h-4 w-4 mr-2" />
            Send Alert Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
