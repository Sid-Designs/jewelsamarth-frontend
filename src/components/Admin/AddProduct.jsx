import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { Store, Plus, ChevronDown, ChevronUp, Trash } from 'lucide-react';
import GenderCheckBox from '@/components/Admin/GenderCheckBox';
import ImageUploadPopup from '@/components/Admin/ImageUploadPopup';

const AddProduct = () => {
  // Initialize Cloudinary with your cloud name
  const cld = new Cloudinary({ cloud: { cloudName: 'dplww7z06' } });

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
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [uploadPosition, setUploadPosition] = useState(null);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setIsSizeDropdownOpen(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleImageUpload = async (files, position) => {
    try {
      const uploadedUrls = await uploadImagesToCloudinary(files);

      if (position === 'main') {
        setMainImage(uploadedUrls[0]); 
      } else if (position === 'new') {
        setSubImages([...subImages, ...uploadedUrls]); 
      } else if (typeof position === 'number') {
        const updatedSubImages = [...subImages];
        updatedSubImages[position] = uploadedUrls[0]; 
        setSubImages(updatedSubImages);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDeleteImage = (position) => {
    if (position === 'main') {
      setMainImage(null); 
      setIsPopupOpen(false); 
    } else if (typeof position === 'number') {
      const updatedSubImages = subImages.filter((_, index) => index !== position); 
      setSubImages(updatedSubImages);
    }
  };

  const openImageUploadPopup = (position) => {
    setUploadPosition(position);
    setIsPopupOpen(true);
  };

  const uploadImagesToCloudinary = async (files) => {
    const cloudName = cld.cloudinaryConfig?.cloud?.cloudName || 'dplww7z06';

    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'JewelSamarthCloud'); // Ensure this is the correct preset

      return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      }).then(response => response.json());
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages.map(img => img.secure_url); 
  };

  const handleAddProduct = async () => {
    if (!productName || !selectedCategory || !mainImage) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
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
          salePrice: document.getElementById('SalePrice').value
        },
        stock: document.getElementById('Stock').value,
        sku: document.getElementById('SKU').value
      };

      console.log('Product Data:', productData);
      
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
          </form>
        </div>
        <div className="prodImg w-full md:w-[35%]">
          <div className="sectionTitle">Upload Image</div>
          <div className="imgSec">
            <div className="imgCnt relative" onClick={() => openImageUploadPopup('main')}>
              {mainImage ? (
                <AdvancedImage cldImg={cld.image(mainImage)} />
              ) : (
                <img src='/JewelSamarth_Single_Logo.png' alt="Product" />
              )}
              {mainImage && (
                <div className="delete-icon" onClick={() => handleDeleteImage('main')}>
                  <Trash className="icon" />
                </div>
              )}
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
