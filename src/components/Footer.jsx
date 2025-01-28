import React from 'react';
import '../assets/styles/Footer.css';
import logo from '../assets/images/Jewel_Samarth_Logo.png';

const Footer = () => {
  return (
    <>
      <footer className='pt-16'>
        <div className="firstCol p-2 md:p-[3rem]">
          <ul className='w-full lg:w-[50%] flex justify-between items-start lg:pr-[4rem]'>
            <li className='order-1 md:order-1'>
              <h1 className='text-center md:text-start'>Trendings</h1>
              <ul className='subLink flex items-center flex-col md:block'>
                <li>Men</li>
                <li>Pearl</li>
                <li>Silver</li>
                <li>Women</li>
                <li>Gemstone</li>
              </ul>
            </li>
            <li className='order-last md:order-2'>
              <h1 className='text-center md:text-start order-[3]'>Quick Links</h1>
              <ul className='subLink flex items-center flex-col md:block'>
                <li>Shop</li>
                <li>Orders</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>My Account</li>
              </ul>
            </li>
            <li className='order-2 md:order-3'>
              <h1 className='text-center md:text-start'>Services</h1>
              <ul className='subLink flex items-center flex-col md:block order-[2]'>
                <li>Address</li>
                <li>Returns</li>
                <li>Support</li>
                <li>Help Center</li>
                <li>Privacy Policy</li>
              </ul>
            </li>
          </ul>
          <div className='footForm w-full py-[2rem] lg:w-[40%] md:py-[2rem] lg:py-0'>
            <h1>Newsletter</h1>
            <p>Sign up for our mailing list to get latest Updates and offers.</p>
            <form className='flex w-[90%]'>
              <input type="email" placeholder='your email address' spellCheck="false" required />
              <button>SUBSCRIBE</button>
            </form>
          </div>
        </div>
        <div className="secCol p-2 py-4 md:py-[1rem] md:p-[3rem]">
          <div className="footLogo">
            All contents © 2025 JEWEL SAMARTH.
          </div>
          <ul className='privacy'>
            <li>Terms & Conditions</li>
            <li>|</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
