import React, { useState } from 'react';
import '@/assets/styles/AddProduct.css';
import { Store, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import GenderCheckBox from '@/components/Admin/GenderCheckBox';
import ImageUploadPopup from '@/components/Admin/ImageUploadPopup';
import { Trash } from 'lucide-react';

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
  const [mainImage, setMainImage] = useState('/JewelSamarth_Single_Logo.png');
  const [subImages, setSubImages] = useState([]);
  const [uploadPosition, setUploadPosition] = useState(null);
  const [gender, setGender] = useState('Women');

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setIsSizeDropdownOpen(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleImageUpload = async (imageUrls, position, files) => {
    console.log('Image URLs:', imageUrls);
    console.log('Files:', files);
  
    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'JewelSamarthCloud'); 
      data.append('cloud_name', 'dplww7z06');
  
      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dplww7z06/image/upload', {
          method: 'POST',
          body: data
        });
  
        if (!res.ok) {
          throw new Error('Failed to upload image');
        }
  
        const dataJson = await res.json();
        console.log(dataJson);
        return dataJson.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    });
  
    const uploadedImageUrls = await Promise.all(uploadPromises);
  
    if (position === 'main') {
      setMainImage(uploadedImageUrls[0]); // For main image, only the first image is selected
    } else if (position === 'new') {
      setSubImages([...subImages, ...uploadedImageUrls]); // For sub-images, add all selected images
    } else if (typeof position === 'number') {
      const updatedSubImages = [...subImages];
      updatedSubImages[position] = uploadedImageUrls[0]; // Update the specific sub-image
      setSubImages(updatedSubImages);
    }
  };
  

  const handleDeleteImage = (position) => {
    if (position === 'main') {
      setMainImage('/JewelSamarth_Single_Logo.png'); // Set default image when main image is deleted
      setIsPopupOpen(false); // Close the popup when main image is deleted
    } else if (typeof position === 'number') {
      const updatedSubImages = subImages.filter((_, index) => index !== position); // Remove sub-image at specific index
      setSubImages(updatedSubImages);
    }
  };

  const openImageUploadPopup = (position) => {
    setUploadPosition(position);
    setIsPopupOpen(true);
  };

  const handleAddProduct = async () => {
    const productData = {
      name: productName,
      description: productDescription,
      size: selectedSize,
      gender,
      productCategory: selectedCategory,
      productTags: selectedTags,
      images: mainImage,
      subImages: subImages,
      regprice: document.getElementById('RegularPrice').value,
      saleprice: document.getElementById('SalePrice').value,
      stock: document.getElementById('Stock').value,
      sku: document.getElementById('SKU').value
    };
  
    console.log('Product Data:', productData);
  
    // Get token from local storage
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      // Send product data to the backend
      const res = await fetch('https://api.jewelsamarth.in/api/product/add', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Attach the token here
        },
      });
  
      const data = await res.json();
  
      if (data.success) {
        console.log('Product Added Successfully:', data.message);
        // Optionally: Reset the form or update the UI to reflect the successful addition
      } else {
        console.log('Error Adding Product:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="newProdSec">
      <div className="navProd">
        <div className="flex gap-4">
          <Store />
          <span>Add New Product</span>
        </div>
        <div className="addProd py-2 px-4" onClick={handleAddProduct}>Add Product</div>
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
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="ProdSize">Size</label>
                <div className="customSelect">
                  <div
                    className="selectTrigger w-[200px] flex justify-between items-center"
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                  >
                    {selectedSize || 'Select Size'}
                    {isSizeDropdownOpen ? <ChevronUp className="pr-2" /> : <ChevronDown className="pr-2" />}
                  </div>
                  {isSizeDropdownOpen && (
                    <div className="selectDropdown">
                      {[...Array(23)].map((_, i) => (
                        <div
                          key={i + 7}
                          className="selectOption"
                          onClick={() => handleSizeChange((i + 7).toString())}
                        >
                          {i + 7}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="formGroup">
                <label htmlFor="ProdGender">Gender</label>
                <GenderCheckBox />
              </div>
            </div>
          </form>
        </div>
        <div className="prodImg w-full md:w-[35%]">
          <div className="sectionTitle">Upload Image</div>
          <div className="imgSec">
            <div className="imgCnt relative" onClick={() => openImageUploadPopup('main')}>
              <img src={mainImage || 'default_image_url'} alt="Product" />
              {mainImage !== '/JewelSamarth_Single_Logo.png' && (
                <div className="delete-icon" onClick={() => handleDeleteImage('main')}>
                  <Trash className="icon" />
                </div>
              )}
            </div>
            <div className="subImgCnt flex flex-wrap">
              {subImages.map((image, i) => (
                <div key={i} className="subImg" onClick={() => openImageUploadPopup(i)}>
                  <img src={image} alt="Sub Product" />
                  <div className="delete-icon" onClick={() => handleDeleteImage(i)}>
                    <Trash className="icon" />
                  </div>
                </div>
              ))}
              <div className="subImg" onClick={() => openImageUploadPopup('new')}>
                <Plus />
              </div>
            </div>
          </div>
          {isPopupOpen && (
            <ImageUploadPopup
              onClose={() => setIsPopupOpen(false)}
              onUpload={handleImageUpload}
              position={uploadPosition}
            />
          )}
        </div>
      </div>
      <div className="prodDtl mt-4 flex flex-col md:flex-row">
        <div className="prodInfo w-full md:w-[65%]">
          <div className="sectionTitle">Pricing and Stock</div>
          <form>
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="RegularPrice">Regular Price</label>
                <div className="priceInput">
                  <span>₹</span>
                  <input type="number" id="RegularPrice" min={0} placeholder="Enter regular price" className="pl-4" />
                </div>
              </div>
              <div className="formGroup">
                <label htmlFor="SalePrice">Sale Price</label>
                <div className="priceInput">
                  <span>₹</span>
                  <input type="number" id="SalePrice" min={0} placeholder="Enter sale price" className="pl-4" />
                </div>
              </div>
            </div>
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="SKU">SKU</label>
                <input type="text" id="SKU" placeholder="Enter SKU" className="pl-4" />
              </div>
              <div className="formGroup">
                <label htmlFor="Stock">Stock</label>
                <input type="number" id="Stock" min={1} placeholder="Enter stock" className="pl-4" />
              </div>
            </div>
          </form>
        </div>
        <div className="prodImg w-full md:w-[35%]">
          <div className="sectionTitle">Category</div>
          <div className="formGroup">
            <label htmlFor="ProdCat">Product Category</label>
            <div className="customSelect">
              <div
                className="selectTrigger flex justify-between items-center"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                {selectedCategory || 'Select Category'}
                {isCategoryDropdownOpen ? <ChevronUp className="pr-2" /> : <ChevronDown className="pr-2" />}
              </div>
              {isCategoryDropdownOpen && (
                <div className="selectDropdown selectCat">
                  {['Silver', 'Pearl', 'Gemstone', 'Rudraksh'].map((category) => (
                    <div
                      key={category}
                      className="selectOption"
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="formGroup">
            <label htmlFor="ProdTags">Product Tags</label>
            <div className="tagsInputContainer">
              <div className="tagsList">
                {selectedTags.map((tag) => (
                  <div key={tag} className="tagChip">
                    {tag}
                    <button onClick={() => removeTag(tag)}>×</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags..."
                onFocus={() => setIsTagDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsTagDropdownOpen(false), 100)}
              />
              {isTagDropdownOpen && (
                <div className="tagsDropdown">
                  {availableTags
                    .filter((tag) => !selectedTags.includes(tag))
                    .map((tag) => (
                      <div key={tag} className="tagOption" onMouseDown={() => handleTagClick(tag)}>
                        {tag}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;