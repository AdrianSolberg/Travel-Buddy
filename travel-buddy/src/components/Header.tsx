"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/Header.css';  
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/myProfile.css'; 
import '../styles/Darkmode.css';

export const Header: React.FC = () => {

    const [theme, setDarkTheme] = useState<boolean | undefined>(undefined);
    const darkmode = () => {
        var element = document.body;
        if (!theme) {
            element.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        else {
            element.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        setDarkTheme(prevTheme => !prevTheme); 
    }

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme');
        var element = document.body;
        if (currentTheme === 'dark') {
            element.classList.add('dark-mode');
            setDarkTheme(true);
        }
        else {
            element.classList.remove('dark-mode');
            setDarkTheme(false);
        }
    }, [])

    if (theme === undefined) {
        return null;
    }

    return (
        <header id='navbar' >
            <Link href="/" className="link"> 
                <div className="navbar-start" style={{ fontFamily: 'Arial', fontSize: '18px' }}>Travel Buddy</div>
            </Link>
            <div className="navbar-end" style={{ display: 'flex' }}>
                <Link href="/MyProfile" className='link'>
                    <div className='navbar-start' style={{ fontFamily: 'Arial', fontSize: '18px', paddingRight: '20px', justifyContent: 'space-between'}}>My Profile</div>
                </Link>
                <label className="switch">
                    <input id='darkmode-button' defaultChecked={theme} onClick={darkmode} type='checkbox'/>
                    <span className="slider round"></span>
                </label>
                <GoogleLoginButton/>
            </div>
        </header>
    );
}

export default Header;
     


