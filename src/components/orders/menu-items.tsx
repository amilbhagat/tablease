"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface MenuItemsProps {
  categories: Category[];
  onAddItem: (item: MenuItem, quantity?: number) => void;
}

export function MenuItems({ categories, onAddItem }: MenuItemsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );

  const handleAddItem = (item: MenuItem) => {
    onAddItem(item, 1);
  };

  // Helper function to format price
  const formatPrice = (price: number | { toString: () => string }) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    // If it's a Decimal from Prisma, convert to number first
    return Number(price.toString()).toFixed(2);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex overflow-x-auto pb-2 mb-4 border-b">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeCategory === category.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories
            .find((category) => category.id === activeCategory)
            ?.menuItems.map((item) => (
              <div
                key={item.id}
                className="flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.image ? (
                  <div className="w-24 h-24 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-muted flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="flex-1 p-3 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-sm font-semibold">
                      ${formatPrice(item.price)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => handleAddItem(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 