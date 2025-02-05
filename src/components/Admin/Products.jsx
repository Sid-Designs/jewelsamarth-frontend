import React, { useState } from 'react';
import '@/assets/styles/Products.css';
import { Box, PackageOpen, List, Tag, CircleAlert } from 'lucide-react';
import ProductsTable from './ProductsTable'

const Products = () => {
  return (
    <div className="newProdSec p-4">
      <div className="navProd">
        <div className="flex gap-4">
          <Box />
          <span>All Products</span>
        </div>
      </div>
      <div>
        <div className="prodSec flex justify-around gap-8">
          <div className="totlProd w-full p-4 flex items-center justify-start gap-8">
            <PackageOpen size={28} />
            <div>
              <div className="prodSecHeading text-xl pb-2">Total Products</div>
              <div className="prodSecNumbers">190</div>
            </div>
          </div>
          <div className="totlCat w-full p-4 flex items-center justify-start gap-8">
            <List size={28} />
            <div>
              <div className="prodSecHeading text-xl pb-2">Total Categories</div>
              <div className="prodSecNumbers">190</div>
            </div>
          </div>
          <div className="totlTag w-full p-4 flex items-center justify-start gap-8">
            <Tag size={28} />
            <div>
              <div className="prodSecHeading text-xl pb-2">Total Tags</div>
              <div className="prodSecNumbers">190</div>
            </div>
          </div>
          <div className="outStock w-full p-4 flex items-center justify-start gap-8">
            <CircleAlert size={28} />
            <div>
              <div className="prodSecHeading text-xl pb-2">Out Of Stock</div>
              <div className="prodSecNumbers">190</div>
            </div>
          </div>
        </div>
      </div>
      <ProductsTable/>
    </div>
  );
};

export default Products;
