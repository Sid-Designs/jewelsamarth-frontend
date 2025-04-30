import React, { useState, useEffect } from 'react';
import { DatePicker, Space } from 'antd';
import GenderCheckBox from '../Admin/GenderCheckBox';
import axios from 'axios';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Women',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;

          setProfileData((prevData) => ({ ...prevData, userId }));

          const response = await axios.get(
            `https://api.jewelsamarth.in/api/user/profile-data/${userId}`
          );
          setProfileData({
            userId,
            firstName: response.data.data.user.firstName,
            lastName: response.data.data.user.lastName,
            email: response.data.data.user.email,
            phone: response.data.data.user.phone,
            gender: response.data.data.user.gender,
            birthDate: response.data.data.user.birthDate,
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const onChange = (date, dateString) => {
    setProfileData({ ...profileData, birthDate: dateString });
  };

  const handleGenderChange = (e) => {
    setProfileData({ ...profileData, gender: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://api.jewelsamarth.in/api/user/profile-update', profileData);
      console.log(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-0 px-0 sm:px-6 md:px-0 lg:p-4 sideCnt">
      <form
        className="relative flex flex-col gap-6 w-full max-w-4xl mx-auto p-8 rounded-[20px]"
        onSubmit={handleSubmit}
        style={{ backgroundColor: 'var(--background-color)' }}
      >
        {/* First Row - First Name & Last Name */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="name" className="px-2">
              First Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`px-4 py-2 rounded-[20px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${loading ? 'animate-pulse bg-[#efefef]' : ''
                }`}
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="lastName" className="px-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`px-4 py-2 rounded-[20px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${loading ? 'animate-pulse bg-[#efefef]' : ''
                }`}
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Second Row - Email & Phone */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="px-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`px-4 py-2 rounded-[20px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${loading ? 'animate-pulse bg-[#efefef]' : ''
                }`}
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="phone" className="px-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`px-4 py-2 rounded-[20px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${loading ? 'animate-pulse bg-[#efefef]' : ''
                }`}
              pattern="[0-9]{10}"
              maxLength={10}
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Third Row - Gender */}
        <div className="flex flex-col gap-2">
          <div className="formGroup">
            <label htmlFor="ProdGender" className="px-4">
              Gender
            </label>
            <GenderCheckBox
              selectedGender={profileData.gender}
              handleGenderChange={handleGenderChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Fourth Row - Date of Birth */}
        <div className="flex flex-col gap-2">
          <div className='w-full md:w-[35%] lg:w-[20%] flex flex-col gap-2'>
            <label htmlFor="birthDate" className="px-2">
              Date Of Birth
            </label>
            <Space direction="vertical">
              <DatePicker
                value={profileData.birthDate ? moment(profileData.birthDate, 'YYYY-MM-DD') : null}
                onChange={onChange}
                disabled={loading}
                className={`rounded-[20px] ${loading ? 'animate-pulse bg-[#efefef]' : ''}`}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '20px',
                  borderColor: '#d1d5db',
                  padding: '0 12px'
                }}
              />
            </Space>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="self-end bg-[var(--accent-color)] text-[var(--background-color)] px-6 py-2 rounded-[20px] hover:bg-[var(--primary-color)] transition-colors mt-4"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Details'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
