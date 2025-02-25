"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bell,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define OrderStatus as a string union type
type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  price: number | { toString: () => string };
  notes: string | null;
  menuItem: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  total: number | { toString: () => string };
  tableNumber: number | null;
  customerName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
  };
  items: OrderItem[];
}

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export function OrderList({
  orders,
  onUpdateStatus,
  onDeleteOrder,
}: OrderListProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Helper function to get numeric value from price
  const getNumericPrice = (price: number | { toString: () => string }): number => {
    if (typeof price === 'number') {
      return price;
    }
    return Number(price.toString());
  };

  // Helper function to format price
  const formatPrice = (price: number | { toString: () => string }) => {
    return getNumericPrice(price).toFixed(2);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "PREPARING":
        return <ChefHat className="h-5 w-5 text-blue-500" />;
      case "READY":
        return <Bell className="h-5 w-5 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-700" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PREPARING":
        return "Preparing";
      case "READY":
        return "Ready";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PREPARING":
        return "bg-blue-100 text-blue-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-green-200 text-green-900";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No orders found
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className={`border rounded-lg p-4 ${
              expandedOrderId === order.id ? "bg-accent/5" : "bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Order #</div>
                  <div className="font-semibold">{order.orderNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-semibold">
                    ${formatPrice(order.total)}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM d, h:mm a")}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {order.status === "PENDING" && (
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(order.id, "PREPARING")
                        }
                      >
                        <ChefHat className="h-4 w-4 mr-2" />
                        Mark as Preparing
                      </DropdownMenuItem>
                    )}
                    {order.status === "PREPARING" && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "READY")}
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Mark as Ready
                      </DropdownMenuItem>
                    )}
                    {order.status === "READY" && (
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(order.id, "COMPLETED")
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </DropdownMenuItem>
                    )}
                    {(order.status === "PENDING" ||
                      order.status === "PREPARING") && (
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(order.id, "CANCELLED")
                        }
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  {expandedOrderId === order.id ? "Hide" : "Details"}
                </Button>
              </div>
            </div>

            {/* Order summary */}
            <div className="p-4 flex flex-wrap gap-4 justify-between border-b">
              <div>
                <div className="text-sm text-muted-foreground">Customer</div>
                <div>{order.customerName || "Not specified"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Table</div>
                <div>{order.tableNumber || "Not specified"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Items</div>
                <div>{order.items.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created by</div>
                <div>{order.user.name || "Unknown"}</div>
              </div>
            </div>

            {/* Order details (expandable) */}
            {expandedOrderId === order.id && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.menuItem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${formatPrice(item.price)}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-muted-foreground">
                            Notes: {item.notes}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        ${formatPrice(getNumericPrice(item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <div>
                    <div className="text-sm font-medium">Order Notes:</div>
                    <div className="text-sm text-muted-foreground">
                      {order.notes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
} 