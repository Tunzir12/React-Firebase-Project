import { auth } from '../../firebase_config';
import {signOut as firebaseSignOut } from 'firebase/auth'

const handleLogout = async () => {
  try {
    await firebaseSignOut(auth); // Use Firebase's signOut method
    // onAuthStateChanged listener will set isAuthenticated to false automatically
    console.log("Firebase signOut successful.");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

const Home = () => {
  return (
    <div className='h-screen bg-pink-200'>
      <h1>Home</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default Home
