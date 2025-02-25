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

// GET all menu items
export async function GET() {
  try {
    const menuItems = await db.menuItem.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { message: "Error fetching menu items" },
      { status: 500 }
    );
  }
}

// POST new menu item
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = menuItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const menuItem = await db.menuItem.create({
      data: result.data,
      include: {
        category: true,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { message: "Error creating menu item" },
      { status: 500 }
    );
  }
} 