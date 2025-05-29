import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import '@/assets/styles/Products.css';
import { Box, PackageOpen, List, Tag, CircleAlert, SearchIcon, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ProductsTable from './ProductsTable';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(0);
  const [tags, setTags] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('all');
  
  // Options for filters
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const STOCK_OPTIONS = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock (≤10)' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  // Calculate out of stock count
  const calculateOutOfStock = (products) => {
    return products.filter(product => product.stock === 0).length;
  };

  // Handle stock updates from child component
  const handleStockUpdate = (updatedProduct) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      );
      // Update out of stock count
      setOutOfStock(calculateOutOfStock(updatedProducts));
      return updatedProducts;
    });
  };

  // Filter products based on current filter states
  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.productCategory === selectedCategory);
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(product => 
        product.productTags && product.productTags.includes(selectedTag)
      );
    }

    // Price range filter (based on sale price)
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const salePrice = parseFloat(product.saleprice) || 0;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return salePrice >= min && salePrice <= max;
      });
    }

    // Stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        const stock = product.stock || 0;
        switch (stockFilter) {
          case 'in-stock':
            return stock > 0;
          case 'low-stock':
            return stock > 0 && stock <= 10;
          case 'out-of-stock':
            return stock === 0;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setPriceRange({ min: '', max: '' });
    setStockFilter('all');
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedTag, priceRange, stockFilter]);

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.jewelsamarth.in/api/product/all");
        const data = await response.json();
        
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);
          
          // Calculate categories and create options
          const uniqueCategories = [...new Set(data.products.map(p => p.productCategory))];
          setCategories(uniqueCategories.length);
          setCategoryOptions([
            { value: 'all', label: 'All Categories' },
            ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
          ]);
          
          // Calculate tags and create options
          const allTags = data.products.flatMap(p => p.productTags || []).filter(Boolean);
          const uniqueTags = [...new Set(allTags)];
          setTags(uniqueTags.length);
          setTagOptions([
            { value: 'all', label: 'All Tags' },
            ...uniqueTags.map(tag => ({ value: tag, label: tag }))
          ]);
          
          // Calculate out of stock
          setOutOfStock(calculateOutOfStock(data.products));
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

  // Loading skeleton component
  const StatSkeleton = () => (
    <div className="w-full p-4 flex items-center gap-4 border rounded-[20px] bg-white shadow-sm border-gray-100 animate-pulse">
      <div className="h-7 w-7 rounded-full bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-5 w-3/4 mb-2 bg-gray-200 rounded"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedTag !== 'all' || 
                         priceRange.min || priceRange.max || stockFilter !== 'all';

  return (
    <div className="newProdSec p-4">
      <div className="navProd mb-6 mx-4 bg-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Box className="" size={24} />
          <span className="text-xl font-semibold">All Products</span>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="mb-8 mx-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white rounded-[20px] shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--accent-color)] rounded-full">
                    <PackageOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Products</div>
                    <div className="text-xl font-bold">{products.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 rounded-full">
                    <List size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Categories</div>
                    <div className="text-xl font-bold">{categories}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Tag size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Tags</div>
                    <div className="text-xl font-bold">{tags}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-50 rounded-full">
                    <CircleAlert size={20} className="text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Out Of Stock</div>
                    <div className="text-xl font-bold">{outOfStock}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="space-y-4 bg-white p-6 rounded-[20px] shadow-sm mx-4 mb-6 border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 rounded-[12px] border-gray-200 focus-visible:ring-2 focus-visible:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>

          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px] rounded-[12px] border-gray-200">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px]">
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-[8px]">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger className="w-[180px] rounded-[12px] border-gray-200">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px]">
              {tagOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-[8px]">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={stockFilter}
            onValueChange={setStockFilter}
          >
            <SelectTrigger className="w-[180px] rounded-[12px] border-gray-200">
              <SelectValue placeholder="Stock status" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px]">
              {STOCK_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-[8px]">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min sale price"
              className="w-[120px] rounded-[12px] border-gray-200"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max sale price"
              className="w-[120px] rounded-[12px] border-gray-200"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-muted-foreground rounded-[12px]"
            >
              <X className="mr-1 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Products Table or No Results */}
      <div className="mt-6">
        {!loading && filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 mx-4 shadow-md rounded-[20px] bg-white border">
            <div className="mb-6">
              <PackageOpen size={64} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <Button
                onClick={resetFilters}
                className="rounded-[12px]"
                variant="outline"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <ProductsTable 
            products={filteredProducts} 
            loading={loading} 
            onStockUpdate={handleStockUpdate} 
          />
        )}
      </div>
    </div>
  );
};

export default Products;