import React, { useState } from "react";
import { auth, signInWithGooglePopup } from "../../firebase";
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import google_logo from '../../google_logo.svg';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = e => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user.emailVerified) {
                    navigate('/Chat')
                } else {
                    alert('Please verify your email address.')
                    sendEmailVerification(user).then(() => {
                        alert('Verification email sent!')
                    })
                }
            })
            .catch(error => alert(error.message))
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithGooglePopup();
            const user = auth.currentUser;
            if (user.emailVerified) {
                navigate('/Chat');
            } else {
                alert('Please verify your email address.');
                sendEmailVerification(user).then(() => {
                    alert('Verification email sent!');
                });
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    }

    const register = e => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(user).then(() => {
                    alert('Verification email sent!')
                })
            })
            .catch(error => alert(error.message))
    }

    return (
        <div className='login'>
            <Link to='/Chat'>
                <img className='login__logo' src="https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg" alt="" />
            </Link>

            <div className="login__container">
                <h1>Welcome</h1>
                <form action="">
                    <h5>E-mail</h5>
                    <input type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />

                    <button className='login__signInButton' type='submit' onClick={signIn}>Sign In</button>
                </form>
                <button className='login__registerButton' type='submit' onClick={register}>Create your Account</button>
                <hr />
                <div>
                    <button className="login-google-button" onClick={signInWithGoogle}>
                        <img src={google_logo} className='icon-google' alt="google-logo"/>
                        <span className="google_text">
                            Sign in with google
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )

}


export default Login;