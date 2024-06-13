import React, { useState } from 'react';
import './nav.css';
import image02 from '../images/02.png';
import image16 from '../images/16.png';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();

    const handlelogout = () => {
        navigate('/');
    };

    const handleDropdown = () => {
        setOpenProfile(!openProfile); // Toggles the state
    };

    const handleCart = () => {
        navigate('/cart');
    };

    const DropdownProfile = () => {
        return (
            <div className='dropDownProfile'>
                <ul className='flex flex-col gap-4 ul02'>
                    <ul className='about02'>About</ul>
                    <ul className='contact02'>Contact</ul>
                    <ul onClick={handlelogout} className='logout02'>Logout</ul>
                </ul>
            </div>
        );
    };

    return (
        <div className='navcontainer02 navbar-expand-lg navbar-light bg-light fixed-top'>
            <div className='nav02'>
                <img src={image02} alt='logo' height={50} />
                <h4 className='h402'>BOOK/GALLERY</h4>
                <div className='navright02'>
                    <div onClick={handleCart}><img src={image16} alt='cart' className='img1602' height={35} /></div>
                    <img className='img202' src='https://kalytapartners.com/images/icon-menu.png' alt='menu' height={30} onClick={handleDropdown} />
                    {openProfile && <DropdownProfile />}
                </div>
            </div>
            <hr />
        </div>
    );
}

export default Nav;
