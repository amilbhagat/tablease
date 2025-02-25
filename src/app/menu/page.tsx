"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryForm } from "@/components/menu/category-form";
import { MenuItemForm } from "@/components/menu/menu-item-form";
import { MenuItemList } from "@/components/menu/menu-item-list";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
}

export default function MenuPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("items");
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);

  // Fetch categories and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, menuItemsRes] = await Promise.all([
          fetch("/api/menu/categories"),
          fetch("/api/menu/items"),
        ]);

        if (!categoriesRes.ok || !menuItemsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [categoriesData, menuItemsData] = await Promise.all([
          categoriesRes.json(),
          menuItemsRes.json(),
        ]);

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load menu data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle category creation
  const handleCreateCategory = async (data: { name: string; description: string | null }) => {
    try {
      const response = await fetch("/api/menu/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      setShowNewCategoryForm(false);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle menu item creation
  const handleCreateMenuItem = async (data: {
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    isAvailable: boolean;
    categoryId: string;
  }) => {
    try {
      const response = await fetch("/api/menu/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server response:", response.status, errorData);
        throw new Error(`Failed to create menu item: ${errorData.message || response.statusText}`);
      }

      const newMenuItem = await response.json();
      setMenuItems((prev) => [...prev, newMenuItem]);
      setShowNewItemForm(false);
      toast({
        title: "Success",
        description: "Menu item created successfully",
      });
    } catch (error) {
      console.error("Error creating menu item:", error);
      toast({
        title: "Error",
        description: "Failed to create menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Menu Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-6">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => setShowNewItemForm(true)}
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading menu items...</span>
            </div>
          ) : (
            <>
              {showNewItemForm && (
                <MenuItemForm
                  categories={categories}
                  onSubmit={handleCreateMenuItem}
                  onCancel={() => setShowNewItemForm(false)}
                />
              )}
              <MenuItemList items={menuItems} categories={categories} />
            </>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setShowNewCategoryForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : (
            <>
              {showNewCategoryForm && (
                <CategoryForm
                  onSubmit={handleCreateCategory}
                  onCancel={() => setShowNewCategoryForm(false)}
                />
              )}
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 