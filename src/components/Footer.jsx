import {React, useState} from 'react';
import '../assets/styles/Footer.css';
import logo from '../assets/images/Jewel_Samarth_Logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify"


const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const sendToPage = (e) => {
    if (e.target.innerHTML === "Orders" || e.target.innerHTML === "My Account") {
      navigate(`/${e.target.dataset.value}`)
    }
    else {
      navigate(`/collections/${e.target.dataset.value}`)
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  };
  const redirectToPage = (e) => {
    navigate(`/${e.target.dataset.value}`)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const inputHandler = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  }
  const subscribeUser = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('https://api.jewelsamarth.in/api/subscribe/add', {email})
      toast.success(response.data.message);
      setEmail('');
    }catch(err){
      toast.error("Error subscribing to newsletter");
    }
    console.log("Subscribed to newsletter");
  }

  return (
    <>
      <footer className='pt-16'>
        <div className="firstCol p-2 md:p-[3rem]">
          <ul className='w-full lg:w-[50%] flex justify-between items-start lg:pr-[4rem]'>
            <li className='order-1 md:order-1'>
              <h1 className='text-center md:text-start'>Trendings</h1>
              <ul className='subLink flex items-center flex-col md:block'>
                <li data-value="men" onClick={(e) => sendToPage(e)}>Men</li>
                <li data-value="pearl" onClick={(e) => sendToPage(e)}>Pearl</li>
                <li data-value="silver" onClick={(e) => sendToPage(e)}>Silver</li>
                <li data-value="women" onClick={(e) => sendToPage(e)}>Women</li>
                <li data-value="gemstone" onClick={(e) => sendToPage(e)}>Gemstone</li>
              </ul>
            </li>
            <li className='order-last md:order-2'>
              <h1 className='text-center md:text-start order-[3]'>Quick Links</h1>
              <ul className='subLink flex items-center flex-col md:block'>
                <li data-value="shop" onClick={(e) => redirectToPage(e)}>Shop</li>
                <li data-value="account?view=orders" onClick={(e) => sendToPage(e)}>Orders</li>
                <li data-value="about" onClick={(e) => redirectToPage(e)}>About Us</li>
                <li data-value="contact" onClick={(e) => redirectToPage(e)}>Contact Us</li>
                <li data-value="account" onClick={(e) => sendToPage(e)}>My Account</li>
              </ul>
            </li>
            <li className='order-2 md:order-3'>
              <h1 className='text-center md:text-start'>Services</h1>
              <ul className='subLink flex items-center flex-col md:block order-[2]'>
                <li data-value="address" onClick={(e) => redirectToPage(e)}>Address</li>
                <li data-value="return" onClick={(e) => redirectToPage(e)}>Returns</li>
                <li data-value="contact" onClick={(e) => redirectToPage(e)}>Support</li>
                <li data-value="contact" onClick={(e) => redirectToPage(e)}>Help Center</li>
                <li data-value="privacy-policy" onClick={(e) => redirectToPage(e)}>Privacy Policy</li>
              </ul>
            </li>
          </ul>
          <div className='footForm w-full py-[2rem] lg:w-[40%] md:py-[2rem] lg:py-0'>
            <h1>Newsletter</h1>
            <p>Sign up for our mailing list to get latest Updates and offers.</p>
            <form onSubmit={(e) => subscribeUser(e)} className='flex w-[90%]'>
              <input onChange={(e) => inputHandler(e)} type="email" value={email} placeholder='your email address' spellCheck="false" required />
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
      <ToastContainer
        stacked
        position="bottom-right"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Footer;
