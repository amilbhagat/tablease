import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for validating order creation
const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  notes: z.string().optional().nullable(),
});

const createOrderSchema = z.object({
  tableNumber: z.number().int().positive().optional().nullable(),
  customerName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});

// GET all orders
export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all orders with their items and menu items
    const orders = await db.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// POST create a new order
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    console.log("Received order data:", JSON.stringify(body, null, 2));
    
    // Validate request body
    const result = createOrderSchema.safeParse(body);
    
    if (!result.success) {
      console.error("Validation error:", result.error.flatten());
      return NextResponse.json(
        { 
          message: "Invalid input data", 
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { tableNumber, customerName, notes, items } = result.data;
    
    // Calculate total price
    let total = 0;
    
    // Fetch menu items to get prices
    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await db.menuItem.findMany({
      where: {
        id: {
          in: menuItemIds,
        },
      },
    });
    
    // Check if all menu items exist
    if (menuItems.length !== menuItemIds.length) {
      const foundIds = new Set(menuItems.map(item => item.id));
      const missingIds = menuItemIds.filter(id => !foundIds.has(id));
      
      return NextResponse.json(
        { 
          message: "Some menu items were not found", 
          missingIds 
        },
        { status: 400 }
      );
    }
    
    // Create a map of menu item IDs to prices
    const menuItemPrices = new Map();
    menuItems.forEach(item => {
      menuItemPrices.set(item.id, item.price);
    });
    
    // Create order items with prices
    const orderItems = items.map(item => {
      const price = menuItemPrices.get(item.menuItemId);
      total += Number(price) * item.quantity;
      
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: price,
        notes: item.notes,
      };
    });
    
    // Create the order
    const order = await db.order.create({
      data: {
        tableNumber,
        customerName,
        notes,
        total,
        userId: session.user.id,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    
    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error creating order" },
      { status: 500 }
    );
  }
} 