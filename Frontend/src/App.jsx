import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { auth } from '../firebase_config';
import { onAuthStateChanged} from 'firebase/auth';
import Calendar from './pages/Calendar'

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
  }, []);

  const handleLogin = () => {
    console.log("Firebase login successful. onAuthStateChanged will update state.");
  }

  const ProtectedRoute = ({ children }) => {
    if (loading) { 
      return <div>Loading authentication...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  const PublicRoute = ({ children }) => {
    if (loading) {
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
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Navbar />
              <Calendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
