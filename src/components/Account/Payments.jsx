import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Plus, X, Edit2, Trash2, CreditCard } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    paymentMethod: '',
    paymentDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // Fetch user payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          setUserId(userId);

          const response = await axios.get(
            `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
          );

          if (response.data?.data?.user?.payments) {
            setPayments(response.data.data.user.payments);
          }
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentMethod.trim() || !formData.paymentDetails.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        // UPDATE PAYMENT
        const updatePayload = {
          userId,
          paymentId: formData._id,
          paymentDetails: formData.paymentDetails
        };

        const response = await axios.put(
          'https://api.jewelsamarth.in/api/user/payment-update',
          updatePayload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setPayments(payments.map(payment => 
            payment._id === formData._id ? {
              ...payment,
              paymentDetails: formData.paymentDetails
            } : payment
          ));
          resetForm();
        }
      } else {
        // ADD NEW PAYMENT
        const addPayload = {
          userId,
          paymentMethod: formData.paymentMethod,
          paymentDetails: formData.paymentDetails
        };

        const response = await axios.post(
          'https://api.jewelsamarth.in/api/user/payments-add',
          addPayload
        );

        if (response.data.success) {
          const updatedResponse = await axios.get(
            `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
          );
          setPayments(updatedResponse.data.data.user.payments || []);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving payment:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: '',
      paymentMethod: '',
      paymentDetails: ''
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (payment) => {
    setFormData({
      _id: payment._id,
      paymentMethod: payment.paymentMethod,
      paymentDetails: payment.paymentDetails
    });
    setEditingId(payment._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return;
    
    try {
      await axios.delete('https://api.jewelsamarth.in/api/user/payment-delete', {
        data: {
          userId,
          paymentId: paymentToDelete._id
        }
      });

      const response = await axios.get(
        `https://api.jewelsamarth.in/api/user/profile-data/${userId}`,
      );
      setPayments(response.data.data.user.payments || []);
    } catch (error) {
      console.error('Error deleting payment:', error);
    } finally {
      setDeleteModalOpen(false);
      setPaymentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPaymentToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-4 py-2 rounded-[20px] transition-colors"
        >
          <Plus size={18} />
          Add New Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[20px]">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Saved Payment Methods</h3>
          <p className="text-gray-500 mb-4">You haven't added any payment methods yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-6 py-2 rounded-[20px]"
          >
            Add Your First Payment Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="border border-gray-200 rounded-[20px] p-5 relative"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard size={18} className="text-[var(--primary-color)]" />
                  {payment.paymentMethod}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="text-gray-500 hover:text-[var(--primary-color)] p-1"
                    aria-label="Edit payment"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(payment)}
                    className="text-gray-500 hover:text-red-500 p-1"
                    aria-label="Delete payment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{payment.paymentDetails}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
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
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method (e.g., Credit Card, UPI)
                </label>
                <input
                  type="text"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={`w-full p-3 border border-gray-300 rounded-[20px] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${
                    editingId ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter payment method name"
                  required
                  disabled={!!editingId}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paymentDetails" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Details
                </label>
                <textarea
                  id="paymentDetails"
                  name="paymentDetails"
                  value={formData.paymentDetails}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[20px] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  rows="4"
                  placeholder="Enter payment details"
                  required
                ></textarea>
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
                    <span>{editingId ? 'Update Payment' : 'Add Payment'}</span>
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
              <h2 className="text-xl font-bold">Delete Payment Method</h2>
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
                Are you sure you want to delete the {paymentToDelete?.paymentMethod} payment method?
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

export default Payments;