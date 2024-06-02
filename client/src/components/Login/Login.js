import React, { useState } from "react";
import { auth, signInWithGooglePopup } from "../../firebase/firebase";
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import googleLogo from '../../svg/google_logo.svg';
import '../../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handles email and password sign-in
    const signIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user.emailVerified) {
                navigate('/Chat');
            } else {
                alert('Please verify your email address.');
                await sendEmailVerification(user);
                alert('Verification email sent!');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // Handles Google sign-in
    const signInWithGoogle = async () => {
        try {
            await signInWithGooglePopup();
            const user = auth.currentUser;
            if (user.emailVerified) {
                navigate('/Chat');
            } else {
                alert('Please verify your email address.');
                await sendEmailVerification(user);
                alert('Verification email sent!');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    // Handles user registration
    const register = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);
            alert('Verification email sent!');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className='login'>
            <Link to='/Chat'>
                <img className='login-logo' src="https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg" alt="ChatGPT Logo" />
            </Link>

            <div className="login-container">
                <h1>Welcome</h1>
                <form>
                    <h5>E-mail</h5>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h5>Password</h5>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className='login-signInButton' type='submit' onClick={signIn}>Sign In</button>
                </form>
                <button className='login-registerButton' type='submit' onClick={register}>Create your Account</button>
                <hr />
                <div>
                    <button className="login-google-button" onClick={signInWithGoogle}>
                        <img src={googleLogo} className='icon-google' alt="Google Logo" />
                        <span className="google_text">Sign in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
