import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { auth } from '../firebase_config';
import { onAuthStateChanged} from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // handleLogin will now be called by your Login component after a successful Firebase sign-in
  // You might not even need to pass a 'token' here, as Firebase manages the session.
  // The onAuthStateChanged listener will automatically pick up the successful login.
  const handleLogin = () => {
    // No need to set localStorage here. Firebase handles the session.
    // The onAuthStateChanged listener will set isAuthenticated to true.
    console.log("Firebase login successful. onAuthStateChanged will update state.");
  }

  const ProtectedRoute = ({ children }) => {
    if (loading) { // While Firebase is checking auth state
      return <div>Loading authentication...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  const PublicRoute = ({ children }) => {
    if (loading) { // While Firebase is checking auth state
      return <div>Loading authentication...</div>;
    }
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              {/* Login component will now call Firebase signIn functions */}
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              {/* Register component will now call Firebase createUserWithEmailAndPassword */}
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
