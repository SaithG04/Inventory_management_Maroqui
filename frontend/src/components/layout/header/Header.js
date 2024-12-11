// src/components/Header/Header.js
import React from 'react';
import './Header.css';
import Logo from '../../../assets/logo.png';

const Header = () => {
    return (
        <header className="header-wrapper">
            <div className="header-container">
                <img src={Logo} alt="Comercial Hiroqui Logo" className="header-logo" />
            </div>
        </header>
    );
};

export default Header;
