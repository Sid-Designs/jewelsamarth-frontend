import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../assets/styles/CollectionsPage.css";
import CollectionsFilter from "@/components/CollectionsFilter";
import Collections from "@/components/Collections";
import CollectionsLoading from "@/components/CollectionsLoading";
import axios from "axios";

const ShopPage = () => {
  const API = `https://api.jewelsamarth.in/api/product/all`;
  const ITEMS_PER_PAGE = 20; // Constant for items per page

  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("Featured");

  // Memoized filtered and sorted products
  const { displayedProducts, totalPages } = useMemo(() => {
    const filteredProducts = originalProducts.filter((product) =>
      Object.entries(filters).every(([key, values]) => {
        if (!values?.length) return true;

        switch (key) {
          case "Shop For":
            return values.includes(product.gender);
          case "Product Type":
            return values.includes(product.productType);
          case "Color":
            return values.includes(product.color);
          case "Style":
            return values.includes(product.productTags);
          case "Stone":
            return values.includes(product.productCategory);
          case "Price": {
            const price = Number(product.saleprice);
            return values.some((range) => {
              if (range === "Under ₹500") return price < 500;
              if (range === "₹500 - ₹1000") return price >= 500 && price <= 1000;
              if (range === "Above ₹1000") return price > 1000;
              return false;
            });
          }
          default:
            return true;
        }
      })
    );

    const sortedProducts = [...filteredProducts];
    switch (sort) {
      case "Price: Low to High":
        sortedProducts.sort((a, b) => a.saleprice - b.saleprice);
        break;
      case "Price: High to Low":
        sortedProducts.sort((a, b) => b.saleprice - a.saleprice);
        break;
      case "Newest":
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured - keep original order
        break;
    }

    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    return {
      displayedProducts: sortedProducts,
      totalPages
    };
  }, [originalProducts, filters, sort]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    return displayedProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [displayedProducts, currentPage]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API);
        
        if (response.data) {
          setOriginalProducts(response.data.products || []);
        } else {
          setOriginalProducts([]);
        }
        setSuccess(true);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSuccess(false);
        setOriginalProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API]);

  // Reset to first page when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [totalPages]);

  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const firstPage = 1;
    const lastPage = totalPages;
    const startPage = Math.max(firstPage, currentPage - 2);
    const endPage = Math.min(lastPage, currentPage + 2);

    if (startPage > firstPage) {
      pageNumbers.push(firstPage);
      if (startPage > firstPage + 1) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    if (endPage < lastPage) {
      if (endPage < lastPage - 1) pageNumbers.push("...");
      pageNumbers.push(lastPage);
    }

    return (
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === firstPage}
          className={`px-4 py-2 rounded-[20px] ${
            currentPage === firstPage
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[var(--accent-color)] text-white hover:bg-[var(--primary-color)]"
          }`}
        >
          Previous
        </button>

        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                page === currentPage
                  ? "bg-[var(--primary-color)] rounded-xl text-white hover:bg-[var(--accent-color)]"
                  : "bg-gray-100 hover:bg-gray-200 rounded-xl"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={`px-4 py-2 rounded-[20px] ${
            currentPage === lastPage
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[var(--accent-color)] text-white hover:bg-[var(--primary-color)]"
          }`}
        >
          Next
        </button>
      </div>
    );
  }, [currentPage, totalPages, handlePageChange]);

  if (loading) return <CollectionsLoading />;
  
  if (!success) {
    return (
      <h1 className="text-center mt-8 text-xl">
        Error loading products. Please try again later.
      </h1>
    );
  }

  if (originalProducts.length === 0) {
    return (
      <h1 className="text-center mt-8 text-xl">
        No products available at this time.
      </h1>
    );
  }

  return (
    <div>
      <div className="catCnt">
        <img
          src="https://images.unsplash.com/photo-1617228726430-ecd6faf2f1b8?w=500&auto=format&fit=crop&q=60"
          alt="Jewelry Banner"
        />
      </div>
      <div className="hidden lg:flex">
        <CollectionsFilter onFiltersChange={setFilters} onSortChange={setSort} />
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {displayedProducts.length === 0 && (
          <h1 className="text-center mt-8 text-xl w-full">
            No products found for this option.
          </h1>
        )}
        {paginatedProducts.map((product) => (
          <Collections key={product._id} productData={product} />
        ))}
      </div>
      <div className="pagination flex justify-center items-center mt-6 gap-2">
        {renderPagination()}
      </div>
    </div>
  );
};

export default ShopPage;