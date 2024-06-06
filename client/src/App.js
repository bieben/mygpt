import { useEffect } from 'react';
import { auth } from './firebase/firebaseConfig';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useStateValue } from './contexts/context';

import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import AdminDashboard from './components/AdminDashboard/AdminDashborad';
import ProtectedRoute from './components/AdminDashboard/ProtectedRoute';
import './styles/App.css';

function App() {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
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
          <Route path='/' element={<Login />} />
          <Route path='/chat' element={
            <ProtectedRoute element={<Chat />} />
          } />
          <Route path='/admin' element={
            <ProtectedRoute element={<AdminDashboard />} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
