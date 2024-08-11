/* import {signInWithEmailAndPassword, Auth, signOut, createUserWithEmailAndPassword} from 'firebase/auth';
import React, {useState} from 'react';
import firebaseControl, {auth} from "../app/firebaseControl";
import firebase from 'firebase/app';
import 'firebase/firestore';
import {useNavigate} from "react-router-dom";
import FirebaseError = firebase.FirebaseError;
import HomePage from '../pages/HomePage';
import '../styles/LoginButton.css';
import '../components/Header'

export default function Login(props:any) {
  //const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [error, setError] = useState("");

  function login() {
    setError("");

    signInWithEmailAndPassword(auth, email, password).then(() => {
      //navigate("")
      console.log("Signed in successfylly")
    }).catch((e: FirebaseError) => {
      setError(e.message)
    })
    
  }

  function register ()  {
    setError('');
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('User registered successfully');
        // Automatically log in the user after registration
        login();
      })
      .catch((e: FirebaseError) => {
        setError(e.message);
      });
  };

  function logout() {
    signOut(auth)
      .then(() => {
        console.log('Sign out successful');
      })
      .catch((error) => {
        console.error('Error signing out', error);
      }); 
  }

  return (props.Trigger) ?(
      <div className='container'>
          <input type="text" placeholder="E-post" 
                 onChange={(e) => setEmail(e.target.value)}/>
                 <br></br>
                 
          <input type="password" placeholder="Passord"
                 onChange={(e) => setPassowrd(e.target.value)}/>
          <p className={"text-error"}>{error}</p>
          <button className='LoginButton' onClick={login}>Logg in</button>
          <button className='LoginButton' onClick={logout}>Logg ut</button>
          <button className='LoginButton' onClick={register}>Register</button>
          <button onClick={()=>props.setTrigger(false)}>close</button>
          {props.children}
      </div>
  ):<div className='container' >
    <button className='openLogin' onClick={() => props.setTrigger(true)}>åpne</button>
  </div>;
};
 */