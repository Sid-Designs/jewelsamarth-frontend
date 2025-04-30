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
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { AuthTabs } from './AuthTabs';
import jwtDecode from 'jwt-decode';

const Navbar = ({ loggedIn, onUserChange }) => {
    const [acntOpt, setacntOpt] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showResults, setShowResults] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [submenuVisible, setSubmenuVisible] = useState('');
    const navigate = useNavigate();
    const [auth, setAuth] = useState(true);
    const [formData, setFormData] = useState({ username: localStorage.getItem('username') || '', email: localStorage.getItem('email') || '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeTab, setActiveTab] = useState("signup");
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [userStatus, setUserStatus] = useState('user');

    const fetchSuggestions = async (input) => {
        try {
            const response = await fetch(`https://api.jewelsamarth.in/api/product/search?q=${encodeURIComponent(input)}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setSuggestions(data.products);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    let debounceTimeout;

    const handleInputChange = (e) => {
        const input = e.target.value;
        setQuery(input);
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            if (input.length > 1) {
                fetchSuggestions(input);
            } else {
                setSuggestions([]);
            }
        }, 300);
    };

    useEffect(() => {
        if (popUp) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [popUp]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('defaultTab');
        if (tab && (tab === 'login' || tab === 'signup')) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleForgetBtn = () => {
        setPopUp(false);
        navigate('/auth/reset-password')
    }

    const handleNewUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await axios.post('https://api.jewelsamarth.in/api/auth/register', formData, { withCredentials: true });
            if (res.data.success) {
                localStorage.setItem('username', res.data.user.username);
                localStorage.setItem('email', res.data.user.email);
                localStorage.setItem('auth', res.data.user.isAccountVerified);
                localStorage.setItem('token', res.data.token);
                setShowSuccess(true);
                onUserChange(true);
                toast.success(res.data.message);
                setPopUp(false);
                setSearchParams('')
                document.title = "Jewel Samarth | Silver Collections"
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleExistUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await axios.post('https://api.jewelsamarth.in/api/auth/login', formData, { withCredentials: true });
            if (res.data.success) {
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('auth', res.data.auth);
                setShowSuccess(true);
                onUserChange(true);
                toast.success(res.data.message);
                setPopUp(false);
                document.title = "Jewel Samarth | Silver Collections"
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                setUserStatus(res.data.data.role);
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

    const handlePopupShell = (e) => {
        e.stopPropagation()
        const targetValue = e.target.getAttribute("value");
        if (targetValue === "Close") {
            setPopUp(false);
            setSearchParams('')
            document.title = "Jewel Samarth | Silver Collections"
        }
    }


    return (
        <>
            <nav className='py-[0.7rem] px-[1rem] md:px-[2rem] lg:px-[4rem] xl:pr-[2rem]'>
                <div className="navSearch w-1/4 lg:1/3 flex justify-start items-center relative">
                    <div className='searchField w-[100%] hidden md:flex justify-start lg:justify-center items-center'>
                        <input
                            type="text"
                            placeholder='Products Search . . .'
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => setShowResults(true)} // Show results on focus
                            onBlur={() => setTimeout(() => setShowResults(false), 200)} // Hide after slight delay
                            className='searchBox'
                        />
                        <CiSearch className='searchIcon' />
                    </div>

                    {/* Only show when input is focused AND there are suggestions */}
                    {showResults && suggestions.length > 0 && (
                        <ul className='custmShadow absolute top-full left-0 z-50 bg-white rounded-[20px] mt-1 w-full max-h-96 overflow-y-auto transition-all duration-300 ease-in-out'>
                            {suggestions.map((item) => (
                                <li key={item._id} className='border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors transform transition-transform duration-200
                        hover:scale-[1.01]'>
                                    <a href={`/products/${item._id}`} className='flex items-center p-3 gap-3'>
                                        <div className='flex-shrink-0 w-12 h-12 rounded-[5px] overflow-hidden bg-gray-100'>
                                            <img
                                                src={item.images}
                                                alt={item.name}
                                                className='w-full h-full object-cover rounded-[5px]'
                                                loading='lazy'
                                            />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-gray-900 truncate'>{item.name}</p>
                                            <p className='text-sm text-gray-500'>{item.productCategory}</p>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}

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
                                        <NavLink to={userStatus == 'admin' ? '/dashboard' : '/account'} className='flex justify-start items-center gap-[10px]'>
                                            <MdDashboard />Dashboard
                                        </NavLink>
                                    </li>
                                    {!auth && (
                                        <li onClick={handleEmail} className='flex justify-start items-center gap-[10px]'><MdMarkEmailRead />Verify Email</li>
                                    )}
                                    <li className='flex justify-start items-center gap-[10px]'onClick={() => navigate('/account?view=orders')}><FaBox />Orders</li>
                                    <li className="flex justify-start items-center gap-[10px]" onClick={handleLogout}><RiLogoutBoxFill />LogOut</li>
                                </ul>
                            </div>
                        ) : (
                            <div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => { setacntOpt(!acntOpt); setPopUp(!popUp) }}
                            >
                                <div to="/auth?defaultTab=signup" className={`acntBtn p-2 mx-2 hidden md:flex xl:mr-6`}>
                                    <VscAccount className='icons acntIcon' /><span className='text-nowrap hidden md:flex capitalize'>Sign In</span>
                                </div>
                            </div>
                        )}
                        <NavLink to="/cart" className='p-2 relative'>
                            <GiShoppingBag className='icons shopBag' />
                            <div className="bagVal">10</div>
                        </NavLink>
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
            {(popUp || isVisible) && (
                <div
                    className={`authPopup fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300
      ${popUp ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setPopUp(false)}
                >
                    <div
                        value="Close"
                        className="flex justify-center items-center relative dark:bg-black w-full h-full shadow-lg transition-all duration-300 scale-100 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => handlePopupShell(e)}
                    >
                        <AuthTabs
                            formData={formData}
                            setFormData={setFormData}
                            signUp={handleNewUser}
                            logIn={handleExistUser}
                            defaultActiveTab={activeTab}
                            isLoading={isLoading}
                            errorMessage={errorMessage}
                            handleForgetBtn={handleForgetBtn}
                        />
                    </div>
                </div>
            )}
        </>
    );
};


const MegaMenu = () => {
    const [submenuVisible, setSubmenuVisible] = useState('');
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const navigate = useNavigate();

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

    const sendToPage = (e) => {
        if (e.target.innerHTML === "Home") {
            navigate('/')
        }
        navigate(`/collections/${e.target.dataset.value}`)
    };

    return (
        <div className='megaMenu'>
            <ul>
                <li onClick={(e) => sendToPage(e)}><span className="menu-item-text">Home</span></li>
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
                                <li><span className="menu-item-text" onClick={() => navigate("/shop")}>New Arrivals</span></li>
                                <li><span className="menu-item-text" data-value="men" onClick={(e) => sendToPage(e)}>Men's Jewelry</span></li>
                                <li><span className="menu-item-text" data-value="women" onClick={(e) => sendToPage(e)}>Women's Jewelry</span></li>
                                <li><span className="menu-item-text" data-value="unisex" onClick={(e) => sendToPage(e)}>Kid's Jewelry</span></li>
                                <li><span className="menu-item-text" data-value="pendant" onClick={(e) => sendToPage(e)}>Chain & Necklace</span></li>
                                <li><span className="menu-item-text" data-value="bracelet" onClick={(e) => sendToPage(e)}>Bangle & Bracelet</span></li>
                                <li><span className="menu-item-text" data-value="all" onClick={(e) => sendToPage(e)}>Personalized</span></li>
                            </ul>
                            <ul className='menuSec'>
                                <h1>Silver</h1>
                                <li><span className="menu-item-text" data-value="silver+ring" onClick={(e) => sendToPage(e)}>Ring</span></li>
                                <li><span className="menu-item-text" data-value="silver+earring" onClick={(e) => sendToPage(e)}>Earring</span></li>
                                <li><span className="menu-item-text" data-value="silver+pendant" onClick={(e) => sendToPage(e)}>Pendant</span></li>
                                {/* <li><span className="menu-item-text" data-value="men" onClick={(e) => sendToPage(e)}>Necklace</span></li> */}
                                <li><span className="menu-item-text" data-value="silver+bracelet" onClick={(e) => sendToPage(e)}>Bracelet</span></li>
                                <li><span className="menu-item-text" data-value="silver+nose+pin" onClick={(e) => sendToPage(e)}>Nose Pin</span></li>
                                <li><span className="menu-item-text" data-value="silver+cufflink" onClick={(e) => sendToPage(e)}>Cuff Link</span></li>
                            </ul>
                            <ul className='menuSec'>
                                <h1>Pearl</h1>
                                <li><span className="menu-item-text" data-value="pearl+earring" onClick={(e) => sendToPage(e)}>Earring</span></li>
                                <li><span className="menu-item-text" data-value="pendant" onClick={(e) => sendToPage(e)}>Pendant</span></li>
                                <li><span className="menu-item-text" data-value="bracelet" onClick={(e) => sendToPage(e)}>Bracelets</span></li>
                            </ul>
                            <ul className='menuSec'>
                                <h1>Gemstone</h1>
                                <li><span className="menu-item-text" data-value="gemstone" onClick={(e) => sendToPage(e)}>Ring</span></li>
                                {/* <li><span className="menu-item-text" >Earring</span></li> */}
                                {/* <li><span className="menu-item-text" >Pendant</span></li> */}
                                {/* <li><span className="menu-item-text" >Nose Pin</span></li> */}
                                {/* <li><span className="menu-item-text" >Rudraksh</span></li> */}
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
                            {/* <li><span className="menu-item-text">Silver Anklet</span></li> */}
                            <li><span className="menu-item-text" data-value="silver+band" onClick={(e) => sendToPage(e)}>Silver Band</span></li>
                            <li><span className="menu-item-text" data-value="silver+bracelet" onClick={(e) => sendToPage(e)}>Silver Bracelet</span></li>
                            <li><span className="menu-item-text" data-value="silver+cufflink" onClick={(e) => sendToPage(e)}>Silver Cufflink</span></li>
                            <li><span className="menu-item-text" data-value="silver+ring" onClick={(e) => sendToPage(e)}>Silver Rings</span></li>
                            <li><span className="menu-item-text" data-value="silver+earring" onClick={(e) => sendToPage(e)}>Silver Earings</span></li>
                            <li><span className="menu-item-text" data-value="silver+mangalsutra" onClick={(e) => sendToPage(e)}>Silver Mangalsutra</span></li>
                            <li><span className="menu-item-text" data-value="silver+pendant" onClick={(e) => sendToPage(e)}>Silver Pendant</span></li>
                            <li><span className="menu-item-text" data-value="silver+nose+pin" onClick={(e) => sendToPage(e)}>Silver Nose Pin</span></li>
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
                            <li><span className="menu-item-text" data-value="pearl+bracelet" onClick={(e) => sendToPage(e)}>Pearl Bracelet</span></li>
                            <li><span className="menu-item-text" data-value="pearl+earring" onClick={(e) => sendToPage(e)}>Pearl Earrings</span></li>
                            <li><span className="menu-item-text" data-value="pearl+pendant" onClick={(e) => sendToPage(e)}>Pearl Pendant</span></li>
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
                            <li><span className="menu-item-text" data-value="gemstone" onClick={(e) => sendToPage(e)}>Gemstone Ring</span></li>
                        </ul>
                    </div>
                </li>
                <li><span className="menu-item-text" data-value="rudraksh" onClick={(e) => sendToPage(e)}>Rudraksh</span></li>
            </ul>
        </div>
    );
};

export default Navbar;
