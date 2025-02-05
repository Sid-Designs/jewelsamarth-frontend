"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const initialCategories = ["Silver", "Pearl", "Gemstone", "Rudraksh"].map((category, index) => ({
  id: index + 1,
  name: category,
  image: `/images/${category.toLowerCase()}.png`,
  totalProducts: Math.floor(Math.random() * 50) + 10,
}));

export default function ProductCategoriesTable() {
  const [categories, setCategories] = useState(initialCategories);
  const [imageErrors, setImageErrors] = useState({});
  const [newCategory, setNewCategory] = useState({ name: "", image: null, imageUrl: "" });
  const [open, setOpen] = useState(false);

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return alert("Category name is required!");

    const newCategoryObj = {
      id: categories.length + 1,
      name: newCategory.name,
      image: newCategory.imageUrl || "/JewelSamarth_Single_Logo.png",
      totalProducts: Math.floor(Math.random() * 50) + 10,
    };

    setCategories((prev) => [...prev, newCategoryObj]);
    setNewCategory({ name: "", image: null, imageUrl: "" });
    setOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewCategory((prev) => ({ ...prev, image: file, imageUrl }));
    }
  };

  return (
    <div className="w-full p-4 my-4 pb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="font-bold text-xl text-[var(--accent-color)]">Product Categories</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label>Upload Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {newCategory.imageUrl && (
                  <img src={newCategory.imageUrl} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded" />
                )}
              </div>
              <Button className="w-full" onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="border border-gray-200 rounded-[15px] overflow-hidden">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Sr</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Total Products</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border border-gray-200">
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <img
                  src={imageErrors[category.id] ? "/JewelSamarth_Single_Logo.png" : category.image}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={() => handleImageError(category.id)}
                />
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.totalProducts}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => alert("Edit functionality to be implemented")}>✏️ Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(category.id)}>🗑️ Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
