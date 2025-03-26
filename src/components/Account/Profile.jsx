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
          setProfileData((prevData) => ({
            ...prevData,
            ...response.data,
          }));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
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
      const response = await axios.post('https://api.jewelsamarth.in/api/user/profile-update', profileData);
      console.log(profileData);``
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-full py-12 sideCnt px-12">
        <form
          className="relative flex flex-col gap-4 justify-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex formSec gap-8">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="px-2">
                First Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="px-4 py-2 capitalize"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
                required
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
                className="px-4 py-2 capitalize"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="flex formSec gap-8">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email" className="px-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="px-4 py-2 lowercase"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="phone" className="px-2">
                Phone
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                className="px-4 py-2"
                maxLength={10}
                minLength={10}
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="formGroup">
              <label htmlFor="ProdGender" className="px-4">
                Gender
              </label>
              <GenderCheckBox
                selectedGender={profileData.gender}
                handleGenderChange={handleGenderChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="birthDate" className="px-2">
              Date Of Birth
            </label>
            <Space direction="vertical">
              <DatePicker
                value={profileData.birthDate ? moment(profileData.birthDate, 'YYYY-MM-DD') : null}
                onChange={onChange}
              />
            </Space>
          </div>
          <button
            type="submit"
            className="absolute right-0 bottom-0 bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-[20px] hover:bg-[var(--primary-color)]"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
