import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get all categories with their menu items
    const categories = await db.category.findMany({
      include: {
        menuItems: {
          where: {
            isAvailable: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { message: "Error fetching menu" },
      { status: 500 }
    );
  }
} 