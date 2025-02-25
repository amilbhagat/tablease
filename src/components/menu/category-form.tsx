"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  onSubmit: (data: { name: string; description: string | null }) => void;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter category description"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Category</Button>
      </div>
    </form>
  );
} 