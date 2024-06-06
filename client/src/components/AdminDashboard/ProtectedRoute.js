import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';


const ProtectedRoute = ({ element: Component }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;

  return user ? Component : <Navigate to="/" />;
};

export default ProtectedRoute;
