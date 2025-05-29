"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProductTagsTable() {
  const [tags, setTags] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.jewelsamarth.in/api/product/all");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          // Count tag usage across all products
          const tagUsage = {};
          
          data.products.forEach(product => {
            if (product.productTags && Array.isArray(product.productTags)) {
              product.productTags.forEach(tag => {
                if (!tagUsage[tag]) {
                  tagUsage[tag] = {
                    count: 0,
                  };
                }
                tagUsage[tag].count += 1;
              });
            }
          });
          
          // Transform to array format and sort alphabetically
          const tagsWithCounts = Object.keys(tagUsage)
            .map((tag, index) => ({
              id: index + 1,
              name: tag,
              icon: "/JewelSamarth_Single_Logo.png",
              totalProducts: tagUsage[tag].count
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setTags(tagsWithCounts);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError(err.message);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return <div className="p-4">Loading tags...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full p-4 my-4 pb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="font-bold text-xl text-[var(--accent-color)]">Product Tags</div>
      </div>

      <div className="border border-gray-200 rounded-[20px] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="rounded-tl-[20px]">Sr</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Tag Name</TableHead>
              <TableHead className="rounded-tr-[20px]">Products Using Tag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <TableRow key={tag.id} className="border-b border-gray-200 last:border-b-0">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={imageErrors[tag.id] ? "/JewelSamarth_Single_Logo.png" : tag.icon}
                      alt={tag.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={() => handleImageError(tag.id)}
                    />
                  </TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.totalProducts}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No tags found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}