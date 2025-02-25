"use client";

import { useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | { toString: () => string };
  image: string | null;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

interface OrderCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
  onRemoveItem: (itemId: string) => void;
  onSubmitOrder: (
    tableNumber: number | null,
    customerName: string | null,
    notes: string | null
  ) => void;
  isSubmitting: boolean;
}

export function OrderCart({
  cartItems,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onSubmitOrder,
  isSubmitting,
}: OrderCartProps) {
  const [tableNumber, setTableNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Helper function to get numeric price
  const getNumericPrice = (price: number | { toString: () => string }): number => {
    if (typeof price === 'number') {
      return price;
    }
    return Number(price.toString());
  };

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + getNumericPrice(item.menuItem.price) * item.quantity,
    0
  );

  const handleSubmitOrder = () => {
    onSubmitOrder(
      tableNumber ? parseInt(tableNumber) : null,
      customerName || null,
      orderNotes || null
    );
  };

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-semibold">Current Order</h3>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No items in cart
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Cart items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex flex-col border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <div className="font-medium">{item.menuItem.name}</div>
                  <div className="font-medium">
                    ${(getNumericPrice(item.menuItem.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        onUpdateQuantity(
                          item.menuItem.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        onUpdateQuantity(item.menuItem.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemoveItem(item.menuItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="Add notes (optional)"
                    value={item.notes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdateNotes(item.menuItem.id, e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Order total */}
          <div className="flex justify-between py-2 font-semibold border-t">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Order details */}
          <div className="space-y-3 pt-3 border-t">
            <div>
              <Label htmlFor="table-number">Table Number (optional)</Label>
              <Input
                id="table-number"
                type="number"
                placeholder="Enter table number"
                value={tableNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTableNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customer-name">Customer Name (optional)</Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="order-notes">Order Notes (optional)</Label>
              <Textarea
                id="order-notes"
                placeholder="Add notes for the entire order"
                value={orderNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrderNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Submit button */}
          <Button
            className="w-full"
            onClick={handleSubmitOrder}
            disabled={cartItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </div>
      )}
    </div>
  );
} 