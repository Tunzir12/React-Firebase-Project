import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth , getUserProfile } from '../../firebase_config'; // Assuming firebase_config.js holds your initialized auth instance
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Basic inline styles for a functional, unstyled navigation bar
const navStyles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownContent: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#444',
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1,
    padding: '10px 0',
    borderRadius: '4px',
  },
  dropdownItem: {
    color: 'white',
    padding: '8px 16px',
    textDecoration: 'none',
    display: 'block',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#555',
    },
  },
  profileButton: {
    backgroundColor: '#5cb85c', // Green color
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
  },
};

const Navbar = () => {
  const [user, setUser] = useState(null); // Firebase Auth User object
  const [userProfile, setUserProfile] = useState(null); // Firestore Profile data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

// 1. Listen for Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Clear profile when logging out
      if (!currentUser) {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);
  // 2. Fetch User Profile when user state changes (i.e., when logged in)
  useEffect(() => {
    if (user && user.uid) {
      const fetchProfile = async () => {
        const profileData = await getUserProfile(user.uid);
        setUserProfile(profileData);
      };
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Firebase Auth state listener in App.js will handle the redirect to /login
      navigate('/login'); 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
// Determine what text to display on the button
  const getButtonText = () => {
    if (userProfile && userProfile.firstName) {
      return userProfile.firstName;
    }
    if (user && user.email) {
      // Fallback to a truncated email if profile isn't loaded yet
      return user.email.split('@')[0];
    }
    return 'Profile';
  };

  return (
    <nav style={navStyles.navbar}>
      <Link to="/" style={navStyles.link}>
        Kanban App
      </Link>

      {/* Navigation Links (Visible when logged in) */}
      {user && (
        <div style={navStyles.links}>
          <Link to="/kanban" style={navStyles.link}>
            Kanban Board
          </Link>
          <Link to="/calendar" style={navStyles.link}>
            Calendar
          </Link>
        </div>
      )}

      {/* Profile Dropdown or Login/Register Links */}
      <div>
        {user ? (
          <div style={navStyles.dropdown}>
            <button 
              onClick={toggleDropdown} 
              style={navStyles.profileButton}
            >
              {getButtonText()} {/* <--- UPDATED HERE */}
            </button>
            
            {isDropdownOpen && (
              <div style={navStyles.dropdownContent}>
                <Link to="/profile" style={navStyles.dropdownItem} onClick={toggleDropdown}>
                  Profile
                </Link>
                <Link to="/friends" style={navStyles.dropdownItem} onClick={toggleDropdown}>
                  Friends
                </Link>
                <Link to="/settings" style={navStyles.dropdownItem} onClick={toggleDropdown}>
                  Settings
                </Link>
                <div style={navStyles.dropdownItem} onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={navStyles.links}>
            <Link to="/login" style={navStyles.link}>
              Login
            </Link>
            <Link to="/register" style={navStyles.link}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;