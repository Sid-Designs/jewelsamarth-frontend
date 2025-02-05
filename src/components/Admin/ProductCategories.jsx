import React, { useState } from 'react';
import '@/assets/styles/Products.css';
import { Box, PackageOpen, List, Tag, CircleAlert } from 'lucide-react';
import ProductCategoryTable from './ProductCategoryTable'

const ProductCategories = () => {
  return (
    <div className="newProdSec p-4">
      <div className="navProd">
        <div className="flex gap-4">
          <List />
          <span>Product Categories</span>
        </div>
      </div>
      <div className=''>
        <ProductCategoryTable/>
      </div>
    </div>
  );
};

export default ProductCategories;
