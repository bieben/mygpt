import './App.css';
import { useEffect } from 'react';
import { auth } from './firebase';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useStateValue } from './StateProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'


function App() {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      console.log('THE USER IS >>> ', authUser);
      dispatch({
        type: 'SET_USER',
        user: authUser ? authUser : null,
      });
    });
  }, []);
  
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path='/' element={
            <GoogleOAuthProvider clientId="304980670815-7p09d3tvae5kjodi3kigaue0fvjh4keb.apps.googleusercontent.com">
              <Login />
            </GoogleOAuthProvider>
          } />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
