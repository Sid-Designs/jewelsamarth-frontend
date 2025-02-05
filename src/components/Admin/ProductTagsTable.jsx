"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const initialTags = [
  { id: 1, name: "New Arrival", icon: "/icons/new.png", totalProducts: 25 },
  { id: 2, name: "Best Seller", icon: "/icons/best.png", totalProducts: 40 },
  { id: 3, name: "Limited Edition", icon: "", totalProducts: 10 }, // No icon, should use default
];

export default function ProductTagsTable() {
  const [tags, setTags] = useState(initialTags);
  const [imageErrors, setImageErrors] = useState({});
  const [newTag, setNewTag] = useState({ name: "", icon: null, iconUrl: "" });
  const [open, setOpen] = useState(false);

  const handleDelete = (id) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const handleAddTag = () => {
    if (!newTag.name.trim()) return alert("Tag name is required!");

    const newTagObj = {
      id: tags.length + 1,
      name: newTag.name,
      icon: newTag.iconUrl || "/default-icon.png", // Use uploaded icon or default
      totalProducts: Math.floor(Math.random() * 50) + 1,
    };

    setTags((prev) => [...prev, newTagObj]);
    setNewTag({ name: "", icon: null, iconUrl: "" });
    setOpen(false);
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const iconUrl = URL.createObjectURL(file);
      setNewTag((prev) => ({ ...prev, icon: file, iconUrl }));
    }
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full p-4 my-4 pb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="font-bold text-xl text-[var(--accent-color)]">Product Tags</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Tag</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tag Name</Label>
                <Input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <Label>Upload Icon</Label>
                <Input type="file" accept="image/*" onChange={handleIconUpload} />
                {newTag.iconUrl && (
                  <img src={newTag.iconUrl} alt="Preview" className="mt-2 w-12 h-12 object-cover rounded" />
                )}
              </div>
              <Button className="w-full" onClick={handleAddTag}>
                Add Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="border border-gray-200 rounded-[15px] overflow-hidden">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Sr</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Tag Name</TableHead>
            <TableHead>Total Products</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border border-gray-200">
          {tags.map((tag, index) => (
            <TableRow key={tag.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <img
                  src={imageErrors[tag.id] || !tag.icon ? "/JewelSamarth_Single_Logo.png" : tag.icon}
                  alt={tag.name}
                  className="w-10 h-10 object-cover rounded"
                  onError={() => handleImageError(tag.id)}
                />
              </TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.totalProducts}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => alert("Edit functionality to be implemented")}>✏️ Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(tag.id)}>🗑️ Delete</DropdownMenuItem>
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
