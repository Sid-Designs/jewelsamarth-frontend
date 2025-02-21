import React, { useState, useEffect } from 'react';
import '@/assets/styles/AddProduct.css';
import { Store, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import GenderCheckBox from '@/components/Admin/GenderCheckBox';
import ImageUploadPopup from '@/components/Admin/ImageUploadPopup';
import { Trash } from 'lucide-react';
import jwtDecode from 'jwt-decode';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [availableTags] = useState(['Fashion', 'Jewelry', 'Accessories', 'New Arrival', 'Sale']);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [subImages, setSubImages] = useState([]);
  const [uploadPosition, setUploadPosition] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  const handleImageUpload = async (imageFile, position) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (position === 'main') {
        setMainImage(data.secure_url);
      } else {
        setSubImages([...subImages, data.secure_url]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!isAdmin) {
      alert('Only admins can add products.');
      return;
    }

    const productData = {
      name: productName,
      description: productDescription,
      size: selectedSize,
      category: selectedCategory,
      tags: selectedTags,
      mainImage,
      subImages,
      price: {
        regularPrice: document.getElementById('RegularPrice').value,
        salePrice: document.getElementById('SalePrice').value,
      },
      stock: document.getElementById('Stock').value,
      sku: document.getElementById('SKU').value,
    };

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="newProdSec">
      <div className="navProd">
        <div className="flex gap-4">
          <Store />
          <span>Add New Product</span>
        </div>
        {isAdmin && <div className="addProd py-2 px-4" onClick={handleAddProduct}>Add Product</div>}
      </div>
      <div className="prodDtl flex flex-col md:flex-row">
        <div className="prodInfo w-full md:w-[65%]">
          <div className="sectionTitle">General Information</div>
          <form>
            <div className="formGroup">
              <label htmlFor="ProdTitle">Name Product</label>
              <input 
                type="text" 
                id="ProdTitle" 
                placeholder="Enter product name" 
                className="pl-4"
                value={productName} 
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="ProdDesc">Description Product</label>
              <textarea 
                id="ProdDesc" 
                rows={7} 
                spellCheck="false" 
                placeholder="Enter product description" 
                className="pl-4"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="prodImg w-full md:w-[35%]">
          <div className="sectionTitle">Upload Image</div>
          <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], 'main')} />
          {subImages.map((_, i) => (
            <input key={i} type="file" onChange={(e) => handleImageUpload(e.target.files[0], 'sub')} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
