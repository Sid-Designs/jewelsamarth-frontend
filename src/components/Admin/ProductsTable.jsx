"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const sampleProducts = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  image: `/headphone${(index % 5) + 1}.png`,
  name: "Bluetooth & Wireless Over-Ear Headphones",
  category: ["Electronics", "Home Appliances", "Fashion"][index % 3],
  regularPrice: Math.floor(Math.random() * 300) + 200,
  salePrice: Math.floor(Math.random() * 150) + 100,
  stock: Math.random() > 0.3 ? Math.floor(Math.random() * 1000) : 0,
}));

export default function ProductsTable() {
  const [products, setProducts] = useState(sampleProducts);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showStockModal, setShowStockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");

  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) =>
    [product.name, product.category, product.stock.toString()].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    setSelected([])
  };

  const updateStock = (id, stockValue) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, stock: stockValue } : product))
    );
  };

  const openStockModal = (product) => {
    setCurrentProduct(product);
    setNewStockValue("");
    setShowStockModal(true);
  };

  const handleStockSubmit = () => {
    if (currentProduct && newStockValue !== "") {
      updateStock(currentProduct.id, parseInt(newStockValue, 10));
    }
    setShowStockModal(false);
  };

  return (
    <div className="w-full p-4 my-4 pb-8 prodTbl">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="font-bold text-xl text-[var(--accent-color)]">Products</div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-1/3 rounded-[15px] pl-4 srchProd"
        />
      </div>

      <Table className="border prodTblSec border-gray-200 rounded-[15px] overflow-hidden">
        <TableHeader className="bg-gray-100 prodTblHead">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selected.length === currentData.length}
                onCheckedChange={() =>
                  setSelected(selected.length === currentData.length ? [] : currentData.map((p) => p.id))
                }
              />
            </TableHead>
            <TableHead>Sr</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead onClick={() => handleSort("regularPrice")} className="cursor-pointer">Regular Price</TableHead>
            <TableHead onClick={() => handleSort("salePrice")} className="cursor-pointer">Sale Price</TableHead>
            <TableHead onClick={() => handleSort("stock")} className="cursor-pointer">Stock</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border border-gray-200">
          {currentData.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell><Checkbox checked={selected.includes(product.id)} /></TableCell>
              <TableCell>{index + 1 + startIndex}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.regularPrice}</TableCell>
              <TableCell>${product.salePrice}</TableCell>
              <TableCell>
                <div className={`p-2 w-fit font-semibold text-white text-center rounded-[20px] ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => alert("Edit functionality to be implemented")}>✏️ Edit</DropdownMenuItem>
                    {product.stock > 0 && <DropdownMenuItem onClick={() => updateStock(product.id, 0)}>🚫 Make Stock 0</DropdownMenuItem>}
                    {product.stock === 0 && <DropdownMenuItem onClick={() => openStockModal(product)}>✅ Make Available</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        {/* Previous Button */}
        <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex space-x-2">
          {[...Array(totalPages)].map((_, index) => {
            if (index === 0 || index === totalPages - 1 || (index >= currentPage - 2 && index <= currentPage + 2)) {
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "bg-[var(--accent-color)] text-white" : ""}
                >
                  {index + 1}
                </Button>
              );
            } else if (index === currentPage - 3 || index === currentPage + 3) {
              return <span key={index}>...</span>;
            }
            return null;
          })}
        </div>

        {/* Next Button */}
        <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Stock Input Modal */}
      {showStockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Enter Stock Quantity</h2>
            <input type="number" value={newStockValue} onChange={(e) => setNewStockValue(e.target.value)} className="border p-2 w-full" />
            <div className="flex justify-end mt-4">
              <Button onClick={handleStockSubmit}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
