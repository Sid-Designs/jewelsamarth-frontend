import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/CollectionsPage.css'
import CollectionsFilter from "@/components/CollectionsFilter";
import Collections from "@/components/Collections";

const CollectionsPage = () => {
    const { categoryName } = useParams();
    const API = "https://api.jewelsamarth.in/api/product/all";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchProducts = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            const products = data.products
            setProducts(products);
            setLoading(false);
        } catch (error) {
            console.log("Error", error);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);
    if (loading) {
        return <h1>Loading...</h1>;
    }
    if (products.length === 0) {
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
                {products.map((product) => {
                    return (
                        <>
                            <Collections productData={product} />
                        </>
                    );
                })}
            </div>


        </>
    );
};

export default CollectionsPage;

