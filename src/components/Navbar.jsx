import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/Jewel_Samarth_Logo.png';
import { CiSearch } from "react-icons/ci";
import { VscAccount, VscChevronDown, VscChevronUp } from "react-icons/vsc";
import { MdDashboard } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaBox } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { FaIdCard } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { PiSealQuestionFill } from "react-icons/pi";
import gsap from 'gsap'
import MenuBar from './MenuBar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Navbar = ({ loggedIn, onUserChange }) => {
    const [acntOpt, setacntOpt] = useState(false);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [submenuVisible, setSubmenuVisible] = useState('');
    const navigate = useNavigate();
    const [auth, setAuth] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                onUserChange(true);
            }
            try {
                const res = await axios.get('https://api.jewelsamarth.in/api/user/data', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setAuth(res.data.data.verified);
                onUserChange(true);
            } catch (err) {
                onUserChange(false);
            }
        };
        checkUser();
    }, [onUserChange]);

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);
        setHoverTimeout(setTimeout(() => {
            setacntOpt(true);
        }, 300));
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setHoverTimeout(setTimeout(() => {
            gsap.to('.acntOpt', {
                opacity: 0,
                duration: 0.3,
                y: -9,
                onComplete: () => {
                    setacntOpt(false);
                },
            });
        }, 500));
    };

    const toggleMobileMenu = () => {
        setMobileMenuVisible(!mobileMenuVisible);
    };

    const toggleSubmenu = (menu) => {
        if (submenuVisible === menu) {
            setSubmenuVisible('');
        } else {
            setSubmenuVisible(menu);
        }
    };

    const handleLogout = () => {
        onUserChange(false); // Update parent component state
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        toast.success('Logged Out Successfully');
        setTimeout(() => {
            navigate('/');
        }, 100);
    };

    const handleEmail = () => {
        navigate('/auth/verify-email');
    };

    useEffect(() => {
        if (acntOpt) {
            gsap.to('.acntOpt', { opacity: 1, duration: 0.5, y: 0 });
        }
    }, [acntOpt]);

    useEffect(() => {
        return () => clearTimeout(hoverTimeout);
    }, [hoverTimeout]);

    useEffect(() => {
        if (mobileMenuVisible) {
            setTimeout(() => {
                document.body.style.overflow = 'hidden';
            }, 700);
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [mobileMenuVisible]);

    return (
        <>
            <nav className='py-[0.7rem] px-[1rem] md:px-[2rem] lg:px-[4rem] xl:pr-[2rem]'>
                <div className="navSearch w-1/4 lg:1/3 flex justify-start items-center">
                    <div className='searchField w-[100%] hidden md:flex justify-start lg:justify-center items-center'>
                        <input type="text" placeholder='Products Search . . .' className='searchBox' />
                        <CiSearch className='searchIcon' />
                    </div>
                    <div className='flex ml-2 justify-center items-center md:hidden'>
                        <MenuBar mobileMenuVisible={mobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
                    </div>
                </div>
                <div className="navLogo w-2/4 lg:1/3 flex justify-center items-center">
                    <NavLink to="/">
                        <img src={logo} alt="Jewel Samarth Logo" className='w-34 md:w-48 lg:w-64' />
                    </NavLink>
                </div>
                <div className="navIcons w-1/4 lg:1/3 flex justify-end md:justify-start lg:justify-center items-center">
                    <div className='w-[50%] flex justify-around relative'>
                        {loggedIn ? (
                            <div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setacntOpt(!acntOpt)}
                                className={`acntBtn p-2 ${acntOpt && 'acntDes'} mx-2 hidden md:flex xl:mr-6`}
                            >
                                <VscAccount className='icons acntIcon' /><span className='text-nowrap hidden md:flex capitalize'>My Account</span>
                                <ul
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    className={`acntOpt ${acntOpt ? 'block' : 'hidden'}`}
                                >
                                    <li className='flex justify-start items-center gap-[10px]'>
                                        <NavLink to="/dashboard" className='flex justify-start items-center gap-[10px]'>
                                            <MdDashboard />Dashboard
                                        </NavLink>
                                    </li>
                                    {!auth && (
                                        <li onClick={handleEmail} className='flex justify-start items-center gap-[10px]'><MdMarkEmailRead />Verify Email</li>
                                    )}
                                    <li className='flex justify-start items-center gap-[10px]'><FaBox />Orders</li>
                                    <li className="flex justify-start items-center gap-[10px]" onClick={handleLogout}><RiLogoutBoxFill />LogOut</li>
                                </ul>
                            </div>
                        ) : (
                            <div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setacntOpt(!acntOpt)}
                            >
                                <NavLink to="/auth?defaultTab=signup" className={`acntBtn p-2 ${acntOpt && 'acntDes'} mx-2 hidden md:flex xl:mr-6`}>
                                    <VscAccount className='icons acntIcon' /><span className='text-nowrap hidden md:flex capitalize'>Sign In</span>
                                </NavLink>
                            </div>
                        )}
                        <div className='p-2 relative'>
                            <GiShoppingBag className='icons shopBag' />
                            <div className="bagVal">10</div>
                        </div>
                    </div>
                </div>
                <div className={`mobileMenu ${mobileMenuVisible ? 'translate-x-0%' : 'translate-x-[-100%]'}`}>
                    <div className="mobLogo">
                        <img src={logo} alt="Jewel Samarth Logo" />
                    </div>
                    <ul className="mobMenu">
                        <li>Home</li>
                        <li>Shop</li>
                        <li onClick={() => toggleSubmenu('silver')} className={`flex justify-between items-center ${submenuVisible === 'silver' && 'acntDes'}`}>Silver {submenuVisible === 'silver' ? <VscChevronUp /> : <VscChevronDown />}</li>
                        {submenuVisible === 'silver' && (
                            <ul className='subMenu'>
                                <li>Silver Anklet</li>
                                <li>Silver Band</li>
                                <li>Silver Bracelet</li>
                                <li>Silver Cufflink</li>
                                <li>Silver Rings</li>
                                <li>Silver Earings</li>
                                <li>Silver Mangalsutra</li>
                                <li>Silver Pendant</li>
                                <li>Silver Nose Pin</li>
                            </ul>
                        )}
                        <li onClick={() => toggleSubmenu('pearl')} className={`flex justify-between items-center ${submenuVisible === 'pearl' && 'acntDes'}`}>Pearl {submenuVisible === 'pearl' ? <VscChevronUp /> : <VscChevronDown />}</li>
                        {submenuVisible === 'pearl' && (
                            <ul className='subMenu'>
                                <li>Pearl Bracelet</li>
                                <li>Pearl Earrings</li>
                                <li>Pearl Pendant</li>
                            </ul>
                        )}
                        <li>Gemstone</li>
                        <li>Rudraksha</li>
                    </ul>
                </div>
            </nav>
            <div className='hidden md:flex justify-center items-center'>
                <MegaMenu />
            </div>
        </>
    );
};


const MegaMenu = () => {
    const [submenuVisible, setSubmenuVisible] = useState('');
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const handleMouseEnter = (id, menu) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        const timeout = setTimeout(() => {
            gsap.to(`#${id}`, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' });
            setSubmenuVisible(menu);
        }, 350);

        setHoverTimeout(timeout);
    };

    const handleMouseLeave = (id) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        const timeout = setTimeout(() => {
            gsap.to(`#${id}`, { height: 0, opacity: 0, duration: 0.5, ease: 'power3.in' });
            setSubmenuVisible('');
        }, 200);

        setHoverTimeout(timeout);
    };

    const toggleSubmenu = (menu) => {
        if (submenuVisible === menu) {
            setSubmenuVisible('');
        } else {
            setSubmenuVisible(menu);
        }
    };

    return (
        <div className='megaMenu'>
            <ul>
                <li><span className="menu-item-text">Home</span></li>
                <li
                    onMouseEnter={() => handleMouseEnter('shop-submenu', 'shop')}
                    onMouseLeave={() => handleMouseLeave('shop-submenu')}
                    onClick={() => toggleSubmenu('shop')}
                >
                    <div className='flex justify-between items-center w-full gap-[5px]'>
                        <span className="menu-item-text">Shop</span>
                        {submenuVisible === 'shop' ? <VscChevronUp /> : <VscChevronDown />}
                    </div>
                    <div id='shop-submenu' className='submenu shopSubMenu'>
                        <div className='flex megaShop'>
                            <ul className='menuSec'>
                                <h1>Jewellery</h1>
                                <li><span className="menu-item-text">New Arrivals</span></li>
                                <li><span className="menu-item-text">Men's Jewelry</span></li>
                                <li><span className="menu-item-text">Women's Jewelry</span></li>
                                <li><span className="menu-item-text">Kid's Jewelry</span></li>
                                <li><span className="menu-item-text">Chain & Necklace</span></li>
                                <li><span className="menu-item-text">Bangle & Bracelet</span></li>
                                <li><span className="menu-item-text">Personalized</span></li>
                            </ul>
                            <ul className='menuSec'>
                                <h1>Silver</h1>
                                <li><span className="menu-item-text">Ring</span></li>
                                <li><span className="menu-item-text">Earring</span></li>
                                <li><span className="menu-item-text">Pendant</span></li>
                                <li><span className="menu-item-text">Necklace</span></li>
                                <li><span className="menu-item-text">Bracelet</span></li>
                                <li><span className="menu-item-text">Nose Pin</span></li>
                                <li><span className="menu-item-text">Cuff Link</span></li>
                            </ul>
                            <ul className='menuSec'>
                                <h1>Pearl</h1>
                                <li><span className="menu-item-text">Earring</span></li>
                                <li><span className="menu-item-text">Pendant</span></li>
                                <li><span className="menu-item-text">Bracelets</span></li>
                            </ul>
                            <ul className='menuSec'>
                                <h1>Gemstone</h1>
                                <li><span className="menu-item-text">Ring</span></li>
                                <li><span className="menu-item-text">Earring</span></li>
                                <li><span className="menu-item-text">Pendant</span></li>
                                <li><span className="menu-item-text">Nose Pin</span></li>
                                <li><span className="menu-item-text">Rudraksh</span></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li
                    onMouseEnter={() => handleMouseEnter('silver-submenu', 'silver')}
                    onMouseLeave={() => handleMouseLeave('silver-submenu')}
                    onClick={() => toggleSubmenu('silver')}
                >
                    <div className='flex justify-between items-center w-full gap-[5px]'>
                        <span className="menu-item-text">Silver</span>
                        {submenuVisible === 'silver' ? <VscChevronUp /> : <VscChevronDown />}
                    </div>
                    <div id='silver-submenu' className='submenu'>
                        <ul>
                            <li><span className="menu-item-text">Silver Anklet</span></li>
                            <li><span className="menu-item-text">Silver Band</span></li>
                            <li><span className="menu-item-text">Silver Bracelet</span></li>
                            <li><span className="menu-item-text">Silver Cufflink</span></li>
                            <li><span className="menu-item-text">Silver Rings</span></li>
                            <li><span className="menu-item-text">Silver Earings</span></li>
                            <li><span className="menu-item-text">Silver Mangalsutra</span></li>
                            <li><span className="menu-item-text">Silver Pendant</span></li>
                            <li><span className="menu-item-text">Silver Nose Pin</span></li>
                        </ul>
                    </div>
                </li>
                <li
                    onMouseEnter={() => handleMouseEnter('pearl-submenu', 'pearl')}
                    onMouseLeave={() => handleMouseLeave('pearl-submenu')}
                    onClick={() => toggleSubmenu('pearl')}
                >
                    <div className='flex justify-between items-center w-full gap-[5px]'>
                        <span className="menu-item-text">Pearl</span>
                        {submenuVisible === 'pearl' ? <VscChevronUp /> : <VscChevronDown />}
                    </div>
                    <div id='pearl-submenu' className='submenu'>
                        <ul>
                            <li><span className="menu-item-text">Pearl Bracelet</span></li>
                            <li><span className="menu-item-text">Pearl Earrings</span></li>
                            <li><span className="menu-item-text">Pearl Pendant</span></li>
                        </ul>
                    </div>
                </li>
                <li
                    onMouseEnter={() => handleMouseEnter('gemstone-submenu', 'gemstone')}
                    onMouseLeave={() => handleMouseLeave('gemstone-submenu')}
                    onClick={() => toggleSubmenu('gemstone')}
                >
                    <div className='flex justify-between items-center w-full gap-[5px]'>
                        <span className="menu-item-text">Gemstone</span>
                        {submenuVisible === 'gemstone' ? <VscChevronUp /> : <VscChevronDown />}
                    </div>
                    <div id='gemstone-submenu' className='submenu'>
                        <ul>
                            <li><span className="menu-item-text">Gemstone Ring</span></li>
                        </ul>
                    </div>
                </li>
                <li><span className="menu-item-text">Rudraksh</span></li>
            </ul>
        </div>
    );
};

export default Navbar;
