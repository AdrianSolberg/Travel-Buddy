"use client";
import React from 'react';
import Link from 'next/link';
import '../styles/Header.css';  
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/myProfile.css'; 

export const Header: React.FC = () => {
    return (
        <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#3498db', color: '#ffffff', padding: '10px' }}>

            <Link href="/" className="link"> 
                <div className="navbar-start" style={{ fontFamily: 'Arial', fontSize: '18px' }}>Travel Buddy</div>
            </Link>

            <div className="navbar-end" style={{ display: 'flex' }}>
                <Link href="/MyDestinations" className='link'>
                    <div className='navbar-start' style={{ fontFamily: 'Arial', fontSize: '18px', paddingRight: '20px', justifyContent: 'space-between'}}>My Destinations</div>
                </Link>

                <GoogleLoginButton/>
        
                
            </div>
        </header>
    );
}

export default Header;
     


