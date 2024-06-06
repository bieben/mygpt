import React, { useEffect, useState } from "react";
import { auth, signInWithGooglePopup } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import googleLogo from '../../svg/google_logo.svg';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import '../../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/chat');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Handles email and password sign-in
    const signIn = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user.emailVerified) {
                navigate('/chat');

                // Update user document in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    lastLogin: new Date(),
                }, { merge: true });

            } else {
                alert('Please verify your email address.');
                await sendEmailVerification(user);
                alert('Verification email sent!');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSigningIn(false);
        }
    };

    // Handles Google sign-in
    const signInWithGoogle = async () => {
        setIsSigningInWithGoogle(true);
        try {
            await signInWithGooglePopup();
            const user = auth.currentUser;
            if (user.emailVerified) {
                navigate('/chat');

                // Add or update user document in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    lastLogin: new Date(),
                }, { merge: true });

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

            // Add user document to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date(),
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSigningInWithGoogle(false);
        }
    };

    return (
        <div className='login'>
            <Link to='/chat'>
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

                    <button className='login-signInButton' type='submit' onClick={signIn} disabled={isSigningIn}>
                        {isSigningIn ? 'Signing...' : 'Sign In'}
                    </button>
                </form>
                <button className='login-registerButton' type='submit' onClick={register}>Create your Account</button>
                <hr />
                <div>
                    <button className="login-google-button" onClick={signInWithGoogle} disabled={isSigningInWithGoogle}>
                        <img src={googleLogo} className='icon-google' alt="Google Logo" />
                        <span className="google_text">
                            {isSigningInWithGoogle ? 'Signing...' : 'Sign in with Google'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
