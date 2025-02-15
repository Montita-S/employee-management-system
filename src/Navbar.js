import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; 
import Sidebar from './Sidebar';

const Navbar = () => {
    const navigate = useNavigate();


    return (
        <div className="navbar-container">

            <div className="logohome-container" onClick={() => navigate('/home')}>
                <img src="/images/logo912.png" alt="Logo Home" className="logohome" />
            </div>

            <div className="logo-container">
                <a href="https://interface.co.th/index.php/about-us-ifs" rget="_blank" rel="noopener noreferrer">
                    <img src="/images/interface-logo.png" alt="Main Logo" className="logo" />
                </a>
            </div>


            <div className="sidebar-wrapper">
                <Sidebar />
            </div>
        </div>
    );
};

export default Navbar;
