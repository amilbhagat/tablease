"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | { toString: () => string };
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
}

interface MenuItemListProps {
  items: MenuItem[];
  categories: Category[];
}

export function MenuItemList({ items, categories }: MenuItemListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Helper function to format price
  const formatPrice = (price: number | { toString: () => string }) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    // If it's a Decimal from Prisma, convert to number first
    return Number(price.toString()).toFixed(2);
  };

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.categoryId === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 border rounded-lg hover:bg-accent/5"
          >
            {item.image && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.category.name}
                  </p>
                </div>
                <div className="font-semibold">${formatPrice(item.price)}</div>
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="mt-4">
                <Button
                  variant={item.isAvailable ? "outline" : "destructive"}
                  size="sm"
                  className="w-full"
                  disabled
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 