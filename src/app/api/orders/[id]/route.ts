import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";

// Schema for validating order update
const updateOrderSchema = z.object({
  status: z.enum([
    OrderStatus.PENDING,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
  ]),
  notes: z.string().optional(),
});

// GET a specific order
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get the order with its items and menu items
    const order = await db.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}

// PATCH update an order's status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Parse request body
    const body = await req.json();
    
    // Validate request body
    const result = updateOrderSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          message: "Invalid input data", 
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { status, notes } = result.data;
    
    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id },
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }
    
    // Update the order
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : existingOrder.notes,
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}

// DELETE an order
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id },
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }
    
    // Check if user has permission (admin, manager, or the creator)
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "MANAGER" &&
      existingOrder.userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }
    
    // Delete the order
    await db.order.delete({
      where: { id },
    });
    
    return NextResponse.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Error deleting order" },
      { status: 500 }
    );
  }
} 