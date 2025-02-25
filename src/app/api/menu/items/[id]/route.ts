import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Schema for menu item validation
const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  image: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
});

// GET menu item by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await db.menuItem.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { message: "Error fetching menu item" },
      { status: 500 }
    );
  }
}

// PATCH update menu item
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = menuItemSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const menuItem = await db.menuItem.update({
      where: { id: params.id },
      data: result.data,
      include: {
        category: true,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { message: "Error updating menu item" },
      { status: 500 }
    );
  }
}

// DELETE menu item
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await db.menuItem.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { message: "Error deleting menu item" },
      { status: 500 }
    );
  }
} 