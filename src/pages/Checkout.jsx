import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = ({ setIsFormComplete, formData, setFormData }) => {
    const maxLength = 200;
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [pincodeError, setPincodeError] = useState('');
    const [profileStatus, setProfileStatus] = useState(null);

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                const response = await axios.get(
                    `https://api.jewelsamarth.in/api/user/profile-data/${userId}`
                );

                if (response.data?.data?.user) {
                    const userData = response.data.data.user;
                    setFormData(prev => ({
                        ...prev,
                        firstName: prev.firstName || userData.firstName || '',
                        lastName: prev.lastName || userData.lastName || '',
                        email: prev.email || userData.email || '',
                        phone: prev.phone || userData.phone || ''
                    }));

                    // Show success message briefly
                    setProfileStatus('Profile loaded successfully');
                    setTimeout(() => setProfileStatus(null), 1000);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);

                // Show error message briefly
                setProfileStatus('Could not load profile details');
                setTimeout(() => setProfileStatus(null), 1000);
            }
        };

        fetchProfileData();
    }, [setFormData]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === "phone" && value.length > 10) return;
        if (id === "pincode") setPincodeError('');

        setFormData(prev => ({
            ...prev,
            [id]: id === "address" ? value.slice(0, maxLength) : value,
        }));
    };

    useEffect(() => {
        const requiredFields = ['firstName', 'lastName', 'phone', 'pincode', 'address', 'city', 'state', 'email'];
        setIsFormComplete(requiredFields.every(field => formData[field]?.trim() !== ''));
    }, [formData, setIsFormComplete]);

    // Location fetch logic
    useEffect(() => {
        const fetchLocation = async () => {
            if (formData.pincode.length === 6) {
                setIsFetchingLocation(true);
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
                    const data = await response.json();

                    if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                        const firstPostOffice = data[0].PostOffice[0];
                        setFormData(prev => ({
                            ...prev,
                            city: firstPostOffice.District || firstPostOffice.Block || firstPostOffice.Region,
                            state: firstPostOffice.State
                        }));
                        setPincodeError('');
                    } else {
                        throw new Error('Invalid pincode');
                    }
                } catch (error) {
                    setPincodeError('Invalid pincode - please enter manually');
                } finally {
                    setIsFetchingLocation(false);
                }
            }
        };

        const timer = setTimeout(fetchLocation, 500);
        return () => clearTimeout(timer);
    }, [formData.pincode, setFormData]);

    return (
        <>
            <div className='flex items-center mx-8 my-4'>
                <div className='flex flex-col gap-2 w-full relative'>
                    {/* Status Message (appears briefly at top) */}
                    <AnimatePresence>
                        {profileStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-center text-sm mb-2 text-blue-600 absolute z-50 top-0 left-1/3 bg-[var(--primary-color)] rounded-[20px] px-4 py-2 text-white"
                            >
                                {profileStatus}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className='flex flex-col gap-2'>
                        <form className='flex flex-col gap-8'>
                            {/* Name Fields */}
                            <div className='checkForm flex gap-4'>
                                <div className='relative w-full'>
                                    <input
                                        type='text'
                                        id='firstName'
                                        className='w-full p-2 px-4'
                                        placeholder='First Name'
                                        onChange={handleInputChange}
                                        value={formData.firstName}
                                    />
                                </div>
                                <div className='relative w-full'>
                                    <input
                                        type='text'
                                        id='lastName'
                                        className='w-full p-2 px-4'
                                        placeholder='Last Name'
                                        onChange={handleInputChange}
                                        value={formData.lastName}
                                    />
                                </div>
                            </div>

                            {/* Contact Fields */}
                            <div className='checkForm flex gap-4'>
                                <div className='relative w-full'>
                                    <input
                                        type='email'
                                        id='email'
                                        className='w-full p-2 px-4'
                                        placeholder='Email'
                                        onChange={handleInputChange}
                                        value={formData.email}
                                    />
                                </div>
                                <div className='relative w-full'>
                                    <input
                                        type='number'
                                        id='phone'
                                        className='w-full p-2 px-4'
                                        placeholder='Mobile Number'
                                        onChange={handleInputChange}
                                        value={formData.phone}
                                    />
                                </div>
                            </div>

                            {/* Address Field */}
                            <div className='checkForm'>
                                <div className='relative w-full'>
                                    <textarea
                                        id='address'
                                        spellCheck="false"
                                        className='address w-full p-2 px-4'
                                        rows='4'
                                        cols='50'
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder='Address'
                                    ></textarea>
                                    <p className='text-right text-gray-500 px-2'>{formData.address.length}/{maxLength} characters</p>
                                </div>
                            </div>

                            {/* Pincode Field */}
                            <div className='checkForm flex gap-4'>
                                <div className='relative w-full'>
                                    <div className='relative'>
                                        <input
                                            type='number'
                                            id='pincode'
                                            className={`w-full p-2 px-4 ${pincodeError ? 'border-red-500' : ''}`}
                                            placeholder='Pincode'
                                            onChange={handleInputChange}
                                            value={formData.pincode}
                                        />
                                        {isFetchingLocation && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute right-4 top-[32%] text-xs text-gray-500"
                                            >
                                                <span className="inline-block w-3 h-3 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></span>
                                            </motion.span>
                                        )}
                                    </div>
                                    {pincodeError && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-500 text-xs mt-1"
                                        >
                                            {pincodeError}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            {/* City/State Fields */}
                            <div className='checkForm flex gap-4'>
                                <div className='relative w-full'>
                                    <input
                                        type='text'
                                        id='city'
                                        className='w-full p-2 px-4'
                                        placeholder={isFetchingLocation ? 'Locating city...' : 'City'}
                                        onChange={handleInputChange}
                                        value={formData.city}
                                        readOnly={isFetchingLocation}
                                    />
                                </div>
                                <div className='relative w-full'>
                                    <input
                                        type='text'
                                        id='state'
                                        className='w-full p-2 px-4'
                                        placeholder={isFetchingLocation ? 'Locating state...' : 'State'}
                                        onChange={handleInputChange}
                                        value={formData.state}
                                        readOnly={isFetchingLocation}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;