import React, { useState } from 'react';
import '@/assets/styles/Products.css';
import { Box, PackageOpen, List, Tag, CircleAlert } from 'lucide-react';
import ProductTagsTable from './ProductTagsTable'

const ProductTags = () => {
  return (
    <div className="newProdSec p-4">
      <div className="navProd">
        <div className="flex gap-4">
          <Tag />
          <span>Product Tags</span>
        </div>
      </div>
      <div className=''>
        <ProductTagsTable/>
      </div>
    </div>
  );
};

export default ProductTags;
