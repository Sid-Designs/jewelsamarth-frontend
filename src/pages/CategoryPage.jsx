import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
    const { categoryName } = useParams(); // Get category from URL

    return (
        <div>
            <h1>Category: {categoryName}</h1>
            <p>Displaying products for {categoryName}</p>
        </div>
    );
};

export default CategoryPage;

