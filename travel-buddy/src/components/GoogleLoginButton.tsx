import React, { useState, useEffect } from 'react';
import firebaseControl from '../app/firebaseControl';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup, Auth, signOut } from 'firebase/auth';

const GoogleLoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Firebase listener to check if user is logged in
    const unsubscribe = firebaseControl.getAuth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      
    });

    // Cleanup function
    return () => unsubscribe();
  }, [isLoggedIn]);

  /* const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); 
    try {
      await signInWithPopup(firebaseControl.getAuth(), provider).then(e => {
        localStorage.setItem('user', JSON.stringify(e).user.email);
      });
    } catch (error) {
      console.error(error);
    }
  }; */

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); 
    try {
      const result = await signInWithPopup(firebaseControl.getAuth(), provider);
      const user = result.user;
      if (user) {
        const userID = user.uid;
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(user.email));
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleGoogleLogout = async () => {
    try {
      await signOut(firebaseControl.getAuth());
        localStorage.setItem('user', '');
        setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleGoogleLogout}>Sign out</button>
      ) : (
        <button onClick={handleGoogleLogin}>Sign in with Google</button> 
  
      )}
    </div>
  );
};

export default GoogleLoginButton;

