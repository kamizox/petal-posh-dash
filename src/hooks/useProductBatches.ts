import { useMemo } from "react";

export interface ProductBatch {
  id: string;
  productId: number;
  productName: string;
  brand: string;
  price: number;
  stock: number;
  expiryDate: string;
  batchNumber: string;
}

// Sample data with multiple batches per product
const sampleBatches: ProductBatch[] = [
  // Vitamin C Serum - 3 batches
  { id: "1a", productId: 1, productName: "Vitamin C Serum", brand: "The Ordinary", price: 45.00, stock: 8, expiryDate: "2025-03-15", batchNumber: "VC-2024-001" },
  { id: "1b", productId: 1, productName: "Vitamin C Serum", brand: "The Ordinary", price: 45.00, stock: 10, expiryDate: "2025-08-20", batchNumber: "VC-2024-002" },
  { id: "1c", productId: 1, productName: "Vitamin C Serum", brand: "The Ordinary", price: 45.00, stock: 5, expiryDate: "2025-12-10", batchNumber: "VC-2024-003" },
  
  // Hyaluronic Acid - 2 batches
  { id: "2a", productId: 2, productName: "Hyaluronic Acid", brand: "CeraVe", price: 38.00, stock: 20, expiryDate: "2025-04-10", batchNumber: "HA-2024-001" },
  { id: "2b", productId: 2, productName: "Hyaluronic Acid", brand: "CeraVe", price: 38.00, stock: 25, expiryDate: "2025-09-30", batchNumber: "HA-2024-002" },
  
  // Retinol Night Cream - 2 batches
  { id: "3a", productId: 3, productName: "Retinol Night Cream", brand: "Neutrogena", price: 52.00, stock: 5, expiryDate: "2025-02-28", batchNumber: "RN-2024-001" },
  { id: "3b", productId: 3, productName: "Retinol Night Cream", brand: "Neutrogena", price: 52.00, stock: 7, expiryDate: "2025-07-15", batchNumber: "RN-2024-002" },
  
  // Gentle Cleanser - 3 batches
  { id: "4a", productId: 4, productName: "Gentle Cleanser", brand: "Cetaphil", price: 32.00, stock: 30, expiryDate: "2025-05-20", batchNumber: "GC-2024-001" },
  { id: "4b", productId: 4, productName: "Gentle Cleanser", brand: "Cetaphil", price: 32.00, stock: 22, expiryDate: "2025-10-15", batchNumber: "GC-2024-002" },
  { id: "4c", productId: 4, productName: "Gentle Cleanser", brand: "Cetaphil", price: 32.00, stock: 15, expiryDate: "2026-01-30", batchNumber: "GC-2024-003" },
  
  // SPF 50 Sunscreen - 1 batch
  { id: "5a", productId: 5, productName: "SPF 50 Sunscreen", brand: "La Roche-Posay", price: 48.00, stock: 8, expiryDate: "2025-06-01", batchNumber: "SS-2024-001" },
];

export interface AggregatedProduct {
  productId: number;
  name: string;
  brand: string;
  price: number;
  totalStock: number;
  earliestExpiry: string;
  batches: ProductBatch[];
}

export function useProductBatches() {
  // Get all batches sorted by expiry (FIFO)
  const sortedBatches = useMemo(() => {
    return [...sampleBatches].sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );
  }, []);

  // Aggregate products with total stock and earliest expiry
  const aggregatedProducts = useMemo(() => {
    const productMap = new Map<number, AggregatedProduct>();

    sampleBatches.forEach((batch) => {
      const existing = productMap.get(batch.productId);
      
      if (existing) {
        existing.totalStock += batch.stock;
        existing.batches.push(batch);
        
        // Update earliest expiry
        if (new Date(batch.expiryDate) < new Date(existing.earliestExpiry)) {
          existing.earliestExpiry = batch.expiryDate;
        }
      } else {
        productMap.set(batch.productId, {
          productId: batch.productId,
          name: batch.productName,
          brand: batch.brand,
          price: batch.price,
          totalStock: batch.stock,
          earliestExpiry: batch.expiryDate,
          batches: [batch],
        });
      }
    });

    // Sort batches within each product by expiry date
    productMap.forEach((product) => {
      product.batches.sort((a, b) => 
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
    });

    return Array.from(productMap.values());
  }, []);

  // Get the batch with earliest expiry for a product (FIFO)
  const getEarliestBatch = (productId: number): ProductBatch | null => {
    const product = aggregatedProducts.find((p) => p.productId === productId);
    if (!product || product.batches.length === 0) return null;
    
    // Return first batch with stock > 0 (batches are already sorted by expiry)
    return product.batches.find((b) => b.stock > 0) ?? null;
  };

  // Consume stock from batches using FIFO
  const consumeStock = (productId: number, quantity: number): { 
    success: boolean; 
    consumedBatches: { batchId: string; quantity: number }[];
    error?: string;
  } => {
    const product = aggregatedProducts.find((p) => p.productId === productId);
    
    if (!product) {
      return { success: false, consumedBatches: [], error: "Product not found" };
    }

    if (product.totalStock < quantity) {
      return { success: false, consumedBatches: [], error: "Insufficient stock" };
    }

    const consumedBatches: { batchId: string; quantity: number }[] = [];
    let remaining = quantity;

    // Consume from earliest expiring batches first (FIFO)
    for (const batch of product.batches) {
      if (remaining <= 0) break;
      if (batch.stock <= 0) continue;

      const toConsume = Math.min(batch.stock, remaining);
      consumedBatches.push({ batchId: batch.id, quantity: toConsume });
      remaining -= toConsume;
    }

    return { success: true, consumedBatches };
  };

  return {
    batches: sampleBatches,
    sortedBatches,
    aggregatedProducts,
    getEarliestBatch,
    consumeStock,
  };
}
