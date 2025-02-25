import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional().nullable(),
});

// GET category by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        menuItems: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}

// PATCH update category
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
    const result = categorySchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: result.data,
      include: {
        menuItems: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Error updating category" },
      { status: 500 }
    );
  }
}

// DELETE category
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

    // Check if category has menu items
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (category._count.menuItems > 0) {
      return NextResponse.json(
        { message: "Cannot delete category with menu items" },
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
} 