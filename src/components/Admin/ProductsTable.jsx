"use client";

import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  SearchIcon,
  Edit,
  Trash2,
  Check,
  Plus,
  Minus
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortFieldDirection, setSortFieldDirection] = useState({});
  const [showStockModal, setShowStockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.jewelsamarth.in/api/product/all");
        const data = await response.json();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Expected array, got:", data.products);
          toast.error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    [
      product.name?.toLowerCase() || "",
      product.category?.toLowerCase() || "",
      product.stock?.toString() || "",
    ].some((field) => field.includes(searchTerm.toLowerCase()))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    const direction = sortFieldDirection[sortField] || 'asc';
    if (a[sortField] < b[sortField]) return direction === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    const direction = sortFieldDirection[field] === 'asc' ? 'desc' : 'asc';
    setSortFieldDirection({ ...sortFieldDirection, [field]: direction });
    setSortField(field);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    setSelected([]);
  };

  const updateStock = async (id, stockValue) => {
    try {
      // Here you would typically make an API call to update the stock
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, stock: stockValue } : product
        )
      );
      toast.success("Stock updated successfully");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const openStockModal = (product) => {
    setCurrentProduct(product);
    setNewStockValue(product.stock.toString());
    setShowStockModal(true);
  };

  const handleStockSubmit = () => {
    if (currentProduct && newStockValue !== "") {
      updateStock(currentProduct._id, parseInt(newStockValue, 10));
    }
    setShowStockModal(false);
  };

  const stockStatusColors = {
    inStock: "bg-green-100 text-green-800 border-green-200",
    outOfStock: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="w-full p-6 rounded-[20px] mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--accent-color)]">Product Management</h2>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>
        <div className="relative w-full sm:w-[30%]">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-[15px] border-gray-200 focus-visible:ring-[var(--accent-color)]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh] w-full">
          <div className="w-full flex justify-center items-center gap-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-5 h-5 bg-[var(--primary-color)] rounded-full animate-bounce animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-[20px] border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="font-medium text-gray-600">Sr</TableHead>
                  <TableHead className="font-medium text-gray-600">Product Name</TableHead>
                  <TableHead className="font-medium text-gray-600">Category</TableHead>
                  <TableHead 
                    className="font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("regprice")}
                  >
                    <div className="flex items-center gap-1">
                      Regular Price
                      {sortField === "regprice" && (
                        <span>{sortFieldDirection["regprice"] === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("saleprice")}
                  >
                    <div className="flex items-center gap-1">
                      Sale Price
                      {sortField === "saleprice" && (
                        <span>{sortFieldDirection["saleprice"] === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center gap-1">
                      Stock
                      {sortField === "stock" && (
                        <span>{sortFieldDirection["stock"] === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((product, index) => (
                  <TableRow key={product._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <TableCell className="text-gray-600">{index + 1 + startIndex}</TableCell>
                    <TableCell className="font-medium">
                      <a 
                        href={`/products/${product._id}`} 
                        target="_blank"
                        className="hover:text-[var(--accent-color)] hover:underline"
                      >
                        {product.name.length > 40
                          ? `${product.name.substring(0, 40)}...`
                          : product.name}
                      </a>
                    </TableCell>
                    <TableCell className="capitalize">{product.productCategory}</TableCell>
                    <TableCell>₹{product.regprice?.toLocaleString()}</TableCell>
                    <TableCell>₹{product.saleprice?.toLocaleString()}</TableCell>
                    <TableCell>
                      <div
                        className={`px-3 py-1 rounded-full border text-sm font-medium w-fit ${
                          product.stock > 0 
                            ? stockStatusColors.inStock 
                            : stockStatusColors.outOfStock
                        }`}
                        onClick={() => openStockModal(product)}
                      >
                        {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-[12px] hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 rounded-[12px] border border-gray-200 shadow-sm">
                          <DropdownMenuItem 
                            className="cursor-pointer rounded-[8px] focus:bg-gray-100"
                            onClick={() => console.log("Edit product", product._id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {product.stock > 0 ? (
                            <DropdownMenuItem 
                              className="cursor-pointer rounded-[8px] focus:bg-red-50 focus:text-red-600"
                              onClick={() => updateStock(product._id, 0)}
                            >
                              <Minus className="mr-2 h-4 w-4" />
                              <span>Set Out of Stock</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="cursor-pointer rounded-[8px] focus:bg-green-50 focus:text-green-600"
                              onClick={() => openStockModal(product)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              <span>Restock</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-l-[15px] rounded-r-none border-r-0 px-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[...Array(totalPages)].map((_, index) => {
                if (
                  index === 0 ||
                  index === totalPages - 1 ||
                  (index >= currentPage - 2 && index <= currentPage + 2)
                ) {
                  return (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                      className={`rounded-none border-l-0 ${currentPage === index + 1 ? "bg-[var(--accent-color)] border-[var(--accent-color)] text-white" : ""}`}
                    >
                      {index + 1}
                    </Button>
                  );
                } else if (index === currentPage - 3 || index === currentPage + 3) {
                  return (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 text-sm border-y border-gray-200 bg-gray-50"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-r-[15px] rounded-l-none border-l-0 px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Stock Modal */}
      <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
        <DialogContent className="rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Update Stock Quantity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              value={newStockValue}
              onChange={(e) => setNewStockValue(e.target.value)}
              placeholder="Enter new stock quantity"
              className="rounded-[15px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowStockModal(false)}
                className="rounded-[15px]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStockSubmit}
                className="rounded-[15px] bg-[var(--accent-color)] hover:bg-[var(--accent-color-dark)]"
              >
                Update Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}