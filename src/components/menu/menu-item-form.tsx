"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface MenuItemFormProps {
  categories: Category[];
  onSubmit: (data: {
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    isAvailable: boolean;
    categoryId: string;
  }) => void;
  onCancel: () => void;
}

export function MenuItemForm({ categories, onSubmit, onCancel }: MenuItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || null,
      price: parseFloat(price),
      image: image || null,
      isAvailable,
      categoryId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter item description"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image URL (Optional)</Label>
        <Input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter image URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="isAvailable"
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
        />
        <Label htmlFor="isAvailable">Available for ordering</Label>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Menu Item</Button>
      </div>
    </form>
  );
} 