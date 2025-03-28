import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import '@/assets/styles/AddProduct.css';
import { Store, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import GenderCheckBox from '@/components/Admin/GenderCheckBox';
import ImageUploadPopup from '@/components/Admin/ImageUploadPopup';
import { Trash } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import SizeSelector from '../components/SizeSelector';
import ProductTags from '../components/ProductTags';

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const [availableTags] = useState(['Fashion', 'Jewelry', 'Accessories', 'New Arrival', 'Sale']);
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [mainImage, setMainImage] = useState('/JewelSamarth_Single_Logo.png');
    const [subImages, setSubImages] = useState([]);
    const [uploadPosition, setUploadPosition] = useState(null);
    const [gender, setGender] = useState('Women');
    const [load, setLoad] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            console.log("Product ID:", id);
            try {
                const response = await axios.get(`https://api.jewelsamarth.in/api/product/${id}`);
                const productData = response.data.product;
                setProductName(productData.name);
                setProductDescription(productData.description);
                setGender(productData.gender);
                setSelectedSize(productData.size);
                setMainImage(productData.images[0] || "");
                setSubImages(productData.subImages || []);
                document.getElementById('RegularPrice').value = productData.regprice;
                document.getElementById('SalePrice').value = productData.saleprice;
                document.getElementById('Stock').value = productData.stock;
                document.getElementById('SKU').value = productData.sku;
                setSelectedCategory(product.productCategory);
                setSelectedTags(productData.productTags);
                setProduct(productData);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to fetch product. Please check the ID.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const resetForm = () => {
        setProductName('');
        setProductDescription('');
        setSelectedSize('');
        setSelectedCategory('');
        setMainImage('/JewelSamarth_Single_Logo.png');
        setSubImages([]);
        setGender('Women');
        setSelectedTags([]);
        document.getElementById('RegularPrice').value = '';
        document.getElementById('SalePrice').value = '';
        document.getElementById('Stock').value = '';
        document.getElementById('SKU').value = '';
    };

    const handleSizeChange = (sizeRange) => {
        setSelectedSize(sizeRange);
        console.log("Selected Size Range:", sizeRange);
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
        setLoad(true);
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
            } finally {
                setLoad(false);
            }
        });

        const uploadedImageUrls = await Promise.all(uploadPromises);

        if (position === 'main') {
            setMainImage(uploadedImageUrls[0]);
        } else if (position === 'new') {
            setSubImages([...subImages, ...uploadedImageUrls]);
        } else if (typeof position === 'number') {
            const updatedSubImages = [...subImages];
            updatedSubImages[position] = uploadedImageUrls[0];
            setSubImages(updatedSubImages);
        }
    };

    const handleDeleteImage = (position) => {
        if (position === 'main') {
            setMainImage('/JewelSamarth_Single_Logo.png');
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

    const handleAddProduct = async () => {
        if (!productName || !productDescription || !selectedCategory || !selectedTags.length || !mainImage) {
            toast.warn('Missing Details');
            return;
        }
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

        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const res = await fetch('https://api.jewelsamarth.in/api/product/add', {
                method: 'POST',
                body: JSON.stringify(productData),
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Product Added Successfully:', data.message);
                resetForm();
            } else {
                toast.error('Error Adding Product:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="mx-28 my-8">
            <div className="navProd">
                <div className="flex gap-4">
                    <Store />
                    <span>Edit Product</span>
                </div>
                <div className="addProd py-2 px-4" onClick={handleAddProduct}>Update Product</div>
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
                            <SizeSelector onSizeChange={handleSizeChange} />
                            <div className="formGroup">
                                <label htmlFor="ProdGender">Gender</label>
                                <GenderCheckBox selectedGender={gender} handleGenderChange={handleGenderChange} />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="prodImg w-full md:w-[35%]">
                    <div className="sectionTitle">Upload Image</div>
                    <div className="imgSec">
                        <div className="imgCnt relative" onClick={() => openImageUploadPopup('main')}>
                            {load ?
                                <div className='flex justify-center items-center border h-full w-full'>
                                    <div className="w-full flex justify-center items-center gap-x-2">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-5 h-5 bg-[var(--primary-color)] rounded-full animate-bounce animate-pulse"
                                                style={{ animationDelay: `${i * 0.2}s` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div> :
                                <>
                                    <img src={mainImage || 'default_image_url'} alt="Product" />
                                    {mainImage !== '/JewelSamarth_Single_Logo.png' && (
                                        <div className="delete-icon" onClick={() => handleDeleteImage('main')}>
                                            <Trash className="icon" />
                                        </div>
                                    )}
                                </>
                            }
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
                <div className="prodCat w-full md:w-[35%]">
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
                    <ProductTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                </div>
            </div>
            <ToastContainer
                stacked
                position="bottom-right"
                autoClose={3000}
                limit={3}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default EditProduct;