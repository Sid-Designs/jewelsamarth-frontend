import React from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/CollectionsPage.css'
import CollectionsFilter from "@/components/CollectionsFilter";
import Collections from "@/components/Collections";

const CollectionsPage = () => {
    const { categoryName } = useParams();

    return (
        <>
            <div className="catCnt border">
                <img src="https://images.unsplash.com/photo-1617228726430-ecd6faf2f1b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGpld2xlcnl8ZW58MHx8MHx8fDA%3D" alt="Banner" />
            </div>
            <div>
                <CollectionsFilter />
            </div>
            <div className="flex flex-wrap justify-center items-center">
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
                <Collections/>
            </div>
        </>
    );
};

export default CollectionsPage;

