import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProductCategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api.jewelsamarth.in/api/product/all");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          // Calculate products count and total value per category
          const categoryStats = {};
          data.products.forEach(product => {
            if (product.productCategory) {
              if (!categoryStats[product.productCategory]) {
                categoryStats[product.productCategory] = {
                  count: 0,
                  totalValue: 0,
                  image: product.image
                };
              }
              categoryStats[product.productCategory].count += 1;
              // Convert price to number and add to total value
              const price = parseFloat(product.saleprice) || 0;
              categoryStats[product.productCategory].totalValue += price;
            }
          });
          
          // Create categories array with stats
          const uniqueCategories = Object.keys(categoryStats).map((category, index) => ({
            id: index + 1,
            name: category,
            image: categoryStats[category].image || "/JewelSamarth_Single_Logo.png",
            totalProducts: categoryStats[category].count,
            totalValue: categoryStats[category].totalValue// Format to 2 decimal places
          }));
          
          setCategories(uniqueCategories);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return <div className="p-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full p-4 my-4 pb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="font-bold text-xl text-[var(--accent-color)]">Product Categories</div>
      </div>

      <div className="rounded-[20px] overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="rounded-tl-[20px]">Sr</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="rounded-tr-[20px]">Total Value (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
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
                  <TableCell>₹ {category.totalValue.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}