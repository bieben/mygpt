import { useEffect } from 'react';
import { auth } from './firebase/firebase';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useStateValue } from './contexts/StateProvider';

import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import './styles/App.css';


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
  });

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path='/' element={
            <Login />
          } />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
