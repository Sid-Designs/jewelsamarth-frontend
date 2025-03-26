import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]); // Start with an empty array
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newHeading, setNewHeading] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  // Retrieve token and decode userId, and fetch user addresses
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

          if (response.data && response.data.data && response.data.data.user.address) {
            setAddresses(response.data.data.user.address); // Update addresses
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    if (newHeading.trim() && newAddress.trim()) {
      setLoading(true);
      try {
        const payload = {
          userId,
          addressName: newHeading,
          userAddress: newAddress,
        };

        const response = await axios.post(
          'https://api.jewelsamarth.in/api/user/address-update',
          payload
        );

        // Add the new address to the state if API call is successful
        if (response.data.success) {
          setAddresses([...addresses, { addressName: newHeading, userAddress: newAddress }]);
        }
      } catch (error) {
        console.error('Error adding address:', error);
      } finally {
        setLoading(false);
        setIsPopupOpen(false);
        setNewHeading('');
        setNewAddress('');
      }
    }
  };

  return (
    <>
      {/* Display Existing Addresses */}
      <div className="addresses-container">
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div
              key={index}
              className="flex justify-center items-center w-full py-12 sideCnt px-12 mb-8"
            >
              <div className="flex flex-col gap-4 w-full">
                <div>
                  <h1 className="text-xl font-bold">{address.addressName}</h1>
                  <p className="py-4">{address.userAddress}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No addresses found. Please add one!</p> // Show message when no addresses are available
        )}
      </div>

      {/* Add Address Button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="w-fit btnshd bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-[20px] hover:bg-[var(--primary-color)]"
      >
        Add Address
      </button>

      {/* Popup for Adding Address */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddAddress();
              }}
            >
              {/* Address Name Input */}
              <input
                type="text"
                value={newHeading}
                maxLength={20}
                onChange={(e) => setNewHeading(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter address name"
                required
              />
              {/* Address Details Textarea */}
              <textarea
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter address details"
                rows="3"
                required
              ></textarea>
              <div className="flex justify-end gap-4">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setNewHeading('');
                    setNewAddress('');
                  }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[var(--accent-color)] text-white px-4 py-2 rounded hover:bg-[var(--primary-color)]"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Addresses;
