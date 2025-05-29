import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, Plus, Tag, Calendar, DollarSign, Users, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
  });

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://api.jewelsamarth.in/api/order/coupon/all', {
        headers: { "x-auth-token": localStorage.getItem('token') },
      });
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
      console.error('Fetch coupons error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = () => {
    setEditMode(false);
    setCurrentCoupon(null);
    setFormData({
      code: '',
      discount: '',
      expiryDate: '',
    });
    setModalVisible(true);
  };

  const handleEdit = (coupon) => {
    setEditMode(true);
    setCurrentCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiryDate: coupon.expiryDate.split('T')[0],
    });
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const payload = {
        code: formData.code,
        discount: parseInt(formData.discount),
        expiryDate: formData.expiryDate,
      };

      if (editMode) {
        const { data } = await axios.put(
          `https://api.jewelsamarth.in/api/order/coupon/update/${currentCoupon._id}`,
          payload,
          {
            headers: { "x-auth-token": localStorage.getItem('token') },
          }
        );
        setCoupons(prev => prev.map(c => c._id === currentCoupon._id ? data : c));
        toast.success('Coupon updated successfully');
      } else {
        const { data } = await axios.post(
          'https://api.jewelsamarth.in/api/order/coupon/create',
          payload,
          {
            headers: { "x-auth-token": localStorage.getItem('token') },
          }
        );
        setCoupons(prev => [data, ...prev]);
        toast.success('Coupon created successfully');
      }
      setModalVisible(false);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Operation failed';
      toast.error(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await axios.delete(`https://api.jewelsamarth.in/api/order/coupon/delete/${couponId}`, {
        headers: { "x-auth-token": localStorage.getItem('token') },
      });
      setCoupons(prev => prev.filter(c => c._id !== couponId));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      toast.error('Failed to delete coupon');
      console.error('Delete coupon error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const getStatusColor = (coupon) => {
    if (isExpired(coupon.expiryDate)) return 'text-orange-500 bg-orange-50';
    return 'text-green-500 bg-green-50';
  };

  const getStatusText = (coupon) => {
    if (isExpired(coupon.expiryDate)) return 'Expired';
    return 'Active';
  };

  return (
    <div className="min-h-screen from-purple-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                Coupon Management
              </h1>
              <p className="text-gray-600 mt-2">Create and manage discount coupons for your store</p>
            </div>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Coupons</p>
                <p className="text-2xl font-bold text-green-600">
                  {coupons.filter(c => !isExpired(c.expiryDate)).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Discount</p>
                <p className="text-2xl font-bold text-orange-600">
                  {coupons.length > 0 
                    ? Math.round(coupons.reduce((sum, c) => sum + c.discount, 0) / coupons.length) 
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons found</h3>
              <p className="text-gray-500 mb-6">Create your first coupon to get started</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create Coupon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="bg-gray-900 text-white px-3 py-1 rounded-lg font-mono text-sm font-bold">
                          {coupon.code}
                        </code>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(coupon)}`}>
                          {getStatusText(coupon)}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {coupon.discount}% OFF
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Expires: {formatDate(coupon.expiryDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Discount: {coupon.discount}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                    placeholder="e.g., SUMMER20"
                    disabled={editMode}
                    required
                    pattern="[A-Z0-9]+"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="20"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalVisible(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {submitLoading ? 'Saving...' : editMode ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;