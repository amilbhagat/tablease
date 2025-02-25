"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItems } from "@/components/orders/menu-items";
import { OrderCart } from "@/components/orders/order-cart";
import { OrderList } from "@/components/orders/order-list";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | { toString: () => string };
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  menuItems: MenuItem[];
}

type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
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

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new-order");
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoadingMenu(true);
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchMenu();
  }, [toast]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // Ensure the status is of type OrderStatus
        const ordersWithCorrectStatus = data.map((order: any) => ({
          ...order,
          status: order.status as OrderStatus,
        }));
        setOrders(ordersWithCorrectStatus);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Add item to cart
  const handleAddToCart = (menuItem: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { menuItem, quantity: 1, notes: "" }];
      }
    });

    toast({
      title: "Item added",
      description: `${menuItem.name} added to order`,
    });
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Update item notes in cart
  const handleUpdateNotes = (itemId: string, notes: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItem.id === itemId ? { ...item, notes } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.menuItem.id !== itemId)
    );
  };

  // Submit order
  const handleSubmitOrder = async (
    tableNumber: number | null,
    customerName: string | null,
    notes: string | null
  ) => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot submit an empty order",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure all data types match the expected schema
      const orderData = {
        items: cartItems.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          notes: item.notes || null, // Use null for empty notes
        })),
        tableNumber: tableNumber, // Keep as null if not provided
        customerName: customerName,
        notes: notes,
      };

      console.log("Submitting order data:", JSON.stringify(orderData, null, 2));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Order submission error:", errorData);
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();

      // Reset cart
      setCartItems([]);

      // Refresh orders list
      const ordersResponse = await fetch("/api/orders");
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }

      toast({
        title: "Order created",
        description: `Order #${data.order.orderNumber} has been created successfully`,
      });

      // Switch to orders tab
      setActiveTab("orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update orders list with new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: "Status updated",
        description: `Order #${orders.find((o) => o.id === orderId)?.orderNumber} status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete order");
      }

      // Update local state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));

      toast({
        title: "Order deleted",
        description: "Order has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  // Filter orders based on status
  const ongoingOrders = orders.filter(
    (order) => !["COMPLETED", "CANCELLED"].includes(order.status)
  );
  
  const completedOrders = orders.filter(
    (order) => ["COMPLETED", "CANCELLED"].includes(order.status)
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-order">New Order</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="new-order" className="mt-6">
          {isLoadingMenu ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading menu...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <MenuItems
                  categories={categories}
                  onAddItem={handleAddToCart}
                />
              </div>
              <div>
                <OrderCart
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateNotes={handleUpdateNotes}
                  onRemoveItem={handleRemoveItem}
                  onSubmitOrder={handleSubmitOrder}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          {isLoadingOrders ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <OrderList
              orders={ongoingOrders}
              onUpdateStatus={handleUpdateStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoadingOrders ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <OrderList
              orders={completedOrders}
              onUpdateStatus={handleUpdateStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 