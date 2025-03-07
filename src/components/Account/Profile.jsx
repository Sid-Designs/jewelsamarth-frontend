import React, { useState } from 'react'
import { DatePicker, Space } from 'antd';
import GenderCheckBox from '../Admin/GenderCheckBox';

const Profile = () => {
  const [gender, setGender] = useState('Women');
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
  return (
    <>
      <div className='flex justify-center items-center w-full py-12 sideCnt px-12'>
        <form className='relative flex flex-col gap-4 justify-center w-full'>
          <div className='flex formSec gap-8'>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="name" className='px-2'>First Name</label>
              <input type="text" id="name" name="name" className='px-4 py-2 capitalize' />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="lastName" className='px-2'>Last Name</label>
              <input type="text" id="lastName" name="lastName" className='px-4 py-2 capitalize' />
            </div>
          </div>
          <div className='flex formSec gap-8'>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="email" className='px-2'>Email</label>
              <input type="email" id="email" name="email" className='px-4 py-2 lowercase' />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="phone" className='px-2'>Phone</label>
              <input type="text" id="phone" name="phone" className='px-4 py-2' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className="formGroup">
              <label htmlFor="ProdGender" className='px-4'>Gender</label>
              <GenderCheckBox selectedGender={gender} handleGenderChange={handleGenderChange} />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="address" className='px-2'>Date Of Birth</label>
            <Space direction="vertical">
              <DatePicker onChange={onChange} />
            </Space>
          </div>
          <button className='absolute right-0 bottom-0 bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-[20px] hover:bg-[var(--primary-color)]'>Update Details</button>
        </form>
      </div>
    </>
  )
}

export default Profile