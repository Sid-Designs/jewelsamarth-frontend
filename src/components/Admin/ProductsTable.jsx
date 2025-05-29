import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  Edit,
  Plus,
  Minus,
  X
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function ProductsTable({ products = [], loading = false, onStockUpdate }) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortFieldDirection, setSortFieldDirection] = useState({});
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // Constants
  const itemsPerPage = 10;
  const stockStatusColors = {
    inStock: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer",
    outOfStock: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 cursor-pointer",
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) =>
    [
      product.name?.toLowerCase() || "",
      product.productCategory?.toLowerCase() || "",
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

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSort = (field) => {
    const direction = sortFieldDirection[field] === 'asc' ? 'desc' : 'asc';
    setSortFieldDirection({ ...sortFieldDirection, [field]: direction });
    setSortField(field);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openStockPopup = (product) => {
    setCurrentProduct(product);
    setNewStockValue(product.stock.toString());
    setShowStockPopup(true);
  };

  const handleStockSubmit = () => {
    if (!currentProduct) return;

    if (newStockValue === "") {
      toast.error("Please enter a stock quantity");
      return;
    }

    const numericValue = parseInt(newStockValue, 10);
    if (isNaN(numericValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    if (numericValue < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    updateStock(currentProduct._id, numericValue);
  };

  // API call to update stock
  const updateStock = async (id, stockValue) => {
    setIsUpdatingStock(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await axios.put(
        "https://api.jewelsamarth.in/api/product/stock",
        { stock: stockValue, productId: id },
        { headers: { 'x-auth-token': token } }
      );

      if (res.data.success) {
        const updatedProduct = {
          ...products.find(product => product._id === id),
          stock: stockValue
        };
        onStockUpdate(updatedProduct);
        toast.success(`Stock updated to ${stockValue}`);
      } else {
        throw new Error(res.data.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error.response?.data?.message || "Failed to update stock");
    } finally {
      setIsUpdatingStock(false);
      setShowStockPopup(false);
    }
  };

  return (
    <div className="w-full p-6 rounded-[20px] mt-4 relative">
      {/* Stock Update Popup */}
      {showStockPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Stock Quantity</h3>
              <button
                onClick={() => setShowStockPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
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
                  onClick={() => setShowStockPopup(false)}
                  className="rounded-[15px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStockSubmit}
                  className="rounded-[15px] bg-[var(--accent-color)] text-white hover:bg-[var(--primary-color)]"
                  disabled={isUpdatingStock}
                >
                  {isUpdatingStock ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Stock"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--accent-color)]">Product Management</h2>
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
      </div> */}

      {/* Loading State */}
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
          {/* Products Table */}
          <div className="rounded-[20px] border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="font-medium text-gray-600">#</TableHead>
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
                    <TableCell className="text-gray-600">{startIndex + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="hover:text-[var(--accent-color)] hover:underline">
                        {product.name.length > 40
                          ? `${product.name.substring(0, 40)}...`
                          : product.name}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{product.productCategory}</TableCell>
                    <TableCell>₹{product.regprice?.toLocaleString()}</TableCell>
                    <TableCell>₹{product.saleprice?.toLocaleString()}</TableCell>
                    <TableCell>
                      <div
                        className={`px-3 py-1 rounded-full border text-sm font-medium w-fit ${product.stock > 0
                            ? stockStatusColors.inStock
                            : stockStatusColors.outOfStock
                          }`}
                        onClick={() => openStockPopup(product)}
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
                              onClick={() => {
                                if (window.confirm(`Set ${product.name} to out of stock?`)) {
                                  updateStock(product._id, 0);
                                }
                              }}
                            >
                              <Minus className="mr-2 h-4 w-4" />
                              <span>Set Out of Stock</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="cursor-pointer rounded-[8px] focus:bg-green-50 focus:text-green-600"
                              onClick={() => openStockPopup(product)}
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant=""
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-l-[15px] rounded-r-none px-3"
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
                      variant={currentPage === index + 1 ? "default" : ""}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                      className={`rounded-[20px] px-4 hover:bg-gray-200 ${currentPage === index + 1 ? "bg-[var(--accent-color)] text-white hover:text-black" : ""}`}
                    >
                      {index + 1}
                    </Button>
                  );
                } else if (index === currentPage - 3 || index === currentPage + 3) {
                  return (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <Button
                variant=""
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-r-[15px] rounded-l-none px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}