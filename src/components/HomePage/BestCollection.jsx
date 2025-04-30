import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import Collections from '../Collections'; // Make sure to import your Collections component

const BestCollection = () => {
    const collectionName = "Silver";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const categoryResponse = await fetch(`https://api.jewelsamarth.in/api/product/category/${collectionName}`);
                const categoryData = await categoryResponse.json();

                if (categoryData.success) {
                    setProducts(categoryData.products);
                    return;
                }

                const searchResponse = await fetch(`https://api.jewelsamarth.in/api/product/search?q=${collectionName}`);
                const searchData = await searchResponse.json();

                if (searchData.success) {
                    setProducts(searchData.products);
                } else {
                    setProducts([]);
                    setError('No products found');
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('Failed to load products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [collectionName]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 360,
                behavior: 'smooth',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="pt-8">
            <div className='flex justify-center gap-2 items-center flex-col pt-8 pb-4'>
                <h2 className='text-3xl font-bold'>Best Seller</h2>
                <p className='text-gray-500 text-md'>Our Best Selling Items</p>
            </div>

            <div className="relative w-full px-8">
                {products.length > 0 ? (
                    <>
                        {/* Left Arrow */}
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full p-2 z-10 hidden md:block"
                        >
                            <VscChevronLeft size={36} />
                        </button>

                        {/* Scrollable products */}
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide scroll-smooth"
                        >
                            {products.map((item) => (
                                <div key={item._id} className="flex-shrink-0">
                                    <Collections productData={item} />
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full p-2 z-10 hidden md:block"
                        >
                            <VscChevronRight size={36} />
                        </button>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <p>No products available in this collection</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BestCollection;
