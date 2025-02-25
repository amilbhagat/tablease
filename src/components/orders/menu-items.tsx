"use client";

import { useState } from "react";
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
                className="flex justify-between items-start p-4 border rounded-lg hover:bg-accent/5"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-2 font-semibold">
                    ${formatPrice(item.price)}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 ml-4"
                  onClick={() => handleAddItem(item)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 