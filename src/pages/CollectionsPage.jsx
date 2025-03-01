import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/CollectionsPage.css'
import CollectionsFilter from "@/components/CollectionsFilter";
import Collections from "@/components/Collections";

const CollectionsPage = () => {
    const { collectionName } = useParams();
    const API = `https://api.jewelsamarth.in/api/product/category/${collectionName}`;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch(API);
            console.log("API Response:", response);
            const data = await response.json();
            console.log("API Data:", data);
            setSuccess(data.success);
            if (data.success) {
                setProducts(data.products);
            } else {
                setProducts([]);
            }
            setLoading(false);
        } catch (error) {
            console.log("Error:", error);
            setLoading(false);
            setSuccess(false); // Handle error case
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [collectionName]);

    if (loading) {
        return <h1>Loading...</h1>;
    }
    if (!success || products.length === 0) {
        return <h1>No products found for this category.</h1>;
    }

    return (
        <>
            <div className="catCnt border">
                <img src="https://images.unsplash.com/photo-1617228726430-ecd6faf2f1b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGpld2xlcnl8ZW58MHx8MHx8fDA%3D" alt="Banner" />
            </div>
            <div>
                <CollectionsFilter />
            </div>
            <div className="flex flex-wrap justify-center items-center">
                {products.map((product) => (
                    <Collections key={product._id} productData={product} />
                ))}
            </div>
        </>
    );
};

export default CollectionsPage;
