import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Payments = () => {
  const [payments, setPayments] = useState([]); // Start with an empty array
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newHeading, setNewHeading] = useState('');
  const [newUPIID, setNewUPIID] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  // Retrieve token, decode userId, and fetch user payment data
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          setUserId(userId);

          // Fetch user profile data including payments
          const response = await axios.get(
            `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
          );

          if (response.data && response.data.data && response.data.data.user.payments) {
            setPayments(response.data.data.user.payments); // Update payments
          }
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handleAddPayment = async () => {
    if (newHeading.trim() && newUPIID.trim()) {
      setLoading(true);
      try {
        const payload = {
          userId,
          paymentMethod: newHeading,
          paymentDetails: newUPIID,
        };

        const response = await axios.post(
          'https://api.jewelsamarth.in/api/user/payments-update',
          payload
        );
        console.log(response.data);
        // Add the new payment to the state if the API call is successful
        if (response.data.success) {
          setPayments([...payments, { paymentMethod: newHeading, paymentDetails: newUPIID }]);
        }
      } catch (error) {
        console.error('Error adding payment:', error);
      } finally {
        setLoading(false);
        setIsPopupOpen(false);
        setNewHeading('');
        setNewUPIID('');
      }
    }
  };

  return (
    <>
      {/* Display Existing Payments */}
      <div className="payments-container">
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <div
              key={index}
              className="flex justify-center items-center w-full py-12 sideCnt px-12 mb-8"
            >
              <div className="flex flex-col gap-4 w-full">
                <div>
                  <h1 className="text-xl font-bold">{payment.paymentMethod}</h1>
                  <p className="py-4">{payment.paymentDetails}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No payments found. Please add one!</p> // Show message when no payments are available
        )}
      </div>

      {/* Add Payment Button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="w-fit btnshd bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-[20px] hover:bg-[var(--primary-color)]"
      >
        Add Payment
      </button>

      {/* Popup for Adding Payment */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Payment</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPayment();
              }}
            >
              {/* Payment Method Name Input */}
              <input
                type="text"
                value={newHeading}
                maxLength={30}
                onChange={(e) => setNewHeading(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter payment method name (e.g., UPI)"
                required
              />
              {/* Payment Details Input */}
              <input
                type="text"
                value={newUPIID}
                onChange={(e) => setNewUPIID(e.target.value)}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter UPI ID (e.g., example@upi)"
                required
              />
              <div className="flex justify-end gap-4">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setNewHeading('');
                    setNewUPIID('');
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

export default Payments;
