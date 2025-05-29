import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Plus, X, Edit2, Trash2, MapPin } from 'lucide-react';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    addressName: '',
    userAddress: '',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          setUserId(userId);

          const response = await axios.get(
            `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
          );

          if (response.data?.data?.user?.address) {
            setAddresses(response.data.data.user.address);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.addressName.trim() || !formData.userAddress.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        // UPDATE ADDRESS
        const updatePayload = {
          userId: userId,
          addressId: formData._id,
          addressName: formData.addressName,
          userAddress: formData.userAddress
        };

        const response = await axios.put(
          'https://api.jewelsamarth.in/api/user/address-update',
          updatePayload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setAddresses(addresses.map(addr => 
            addr._id === formData._id ? {
              ...addr,
              userAddress: formData.userAddress
            } : addr
          ));
          resetForm();
        }
      } else {
        // ADD NEW ADDRESS
        const addPayload = {
          userId,
          addressName: formData.addressName,
          userAddress: formData.userAddress,
          isDefault: formData.isDefault
        };

        const response = await axios.post(
          'https://api.jewelsamarth.in/api/user/address-add',
          addPayload
        );

        if (response.data.success) {
          setIsLoading(true);
          const updatedResponse = await axios.get(
            `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
          );
          setAddresses(updatedResponse.data.data.user.address || []);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving address:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: '',
      addressName: '',
      userAddress: '',
      isDefault: false
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (address) => {
    setFormData({
      _id: address._id,
      addressName: address.addressName,
      userAddress: address.userAddress,
      isDefault: address.isDefault
    });
    setEditingId(address._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    
    try {
      setIsLoading(true);
      await axios.delete('https://api.jewelsamarth.in/api/user/address-delete', {
        data: {
          userId,
          addressId: addressToDelete._id,
          addressName: addressToDelete.addressName
        }
      });

      const response = await axios.get(
        `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
      );
      setAddresses(response.data.data.user.address || []);
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setDeleteModalOpen(false);
      setAddressToDelete(null);
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const setDefaultAddress = async (addressId) => {
    try {
      setIsLoading(true);
      await axios.put('https://api.jewelsamarth.in/api/user/set-default-address', {
        userId,
        addressId
      });

      const response = await axios.get(
        `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
      );
      setAddresses(response.data.data.user.address || []);
    } catch (error) {
      console.error('Error setting default address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Skeleton Loading Component
  const AddressSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-[20px] p-5">
          <div className="animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="flex gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-4 py-2 rounded-[20px] transition-colors"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {isLoading ? (
        <AddressSkeleton />
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[20px]">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Saved Addresses</h3>
          <p className="text-gray-500 mb-4">You haven't added any addresses yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-6 py-2 rounded-[20px]"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-[20px] p-5 relative ${address.isDefault ? 'border-[var(--primary-color)] border-2' : 'border-gray-200'}`}
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-[var(--primary-color)] text-white text-xs px-2 py-1 rounded-[20px]">
                  Default
                </span>
              )}
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <MapPin size={18} className="text-[var(--primary-color)]" />
                  {address.addressName}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-gray-500 hover:text-[var(--primary-color)] p-1"
                    aria-label="Edit address"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address)}
                    className="text-gray-500 hover:text-red-500 p-1"
                    aria-label="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{address.userAddress}</p>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address._id)}
                  className="text-sm text-[var(--primary-color)] hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="addressName" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name (e.g., Home, Work)
                </label>
                <input
                  type="text"
                  id="addressName"
                  name="addressName"
                  value={formData.addressName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border border-gray-300 rounded-[20px] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${
                    editingId ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter address name"
                  maxLength={30}
                  required
                  disabled={!!editingId}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <textarea
                  id="userAddress"
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[20px] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  rows="4"
                  placeholder="Enter full address with landmarks"
                  required
                ></textarea>
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded-[20px]"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-[20px] hover:bg-[var(--accent-color)] transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    <span>{editingId ? 'Update Address' : 'Add Address'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">Delete Address</h2>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the address "{addressToDelete?.addressName}"?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-gray-300 rounded-[20px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-[20px] hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;