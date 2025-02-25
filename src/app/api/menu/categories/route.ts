import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional().nullable(),
});

// GET all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

// POST new category
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
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: result.data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 }
    );
  }
} 