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
    <div className='h-screen flex text-textBody bg-pageBody'>
      <h1>Home</h1>
      <p>0 Kanban boards available</p>
      <button className='p-20'>Create new Board</button>

    </div>
  )
}

export default Home
