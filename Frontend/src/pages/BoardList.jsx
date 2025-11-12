import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase_config'; // Firebase Auth instance
import useAuthState from 'react-firebase-hooks/auth'
import { useState } from 'react';

// Assuming you use an environment variable for your backend URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const BoardList = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  /**
   * Sends a request to the backend to create a new board with default values.
   */
  const handleCreateBoard = async () => {
    if (loading || !user) {
      console.warn("User not loaded or not authenticated.");
      return;
    }

    setIsCreating(true);

    try {
      // 1. Get the Firebase ID Token for authentication
      const idToken = await user.getIdToken();

      // 2. Define default board data
      const defaultBoard = {
        title: 'Untitled Board',
        description: 'New Kanban board for tracking tasks.',
        // The ownerId and default columns are handled by the backend service.
      };

      // 3. Send the request to your protected Express endpoint
      const response = await fetch(`${API_URL}/boards/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Attach the ID token as a Bearer token
          'Authorization': `Bearer ${idToken}`, 
        },
        body: JSON.stringify(defaultBoard),
      });

      if (!response.ok) {
        // Handle backend validation errors or 403/401 errors
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create board on server.');
      }

      // 4. Extract the created board data
      const data = await response.json();
      const newBoardId = data.board.id;

      // 5. Navigate to the newly created board page
      navigate(`/kanban/${newBoardId}`);

    } catch (err) {
      console.error('Error creating board:', err.message);
      alert(`Could not create board: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <div>Loading boards...</div>;
  if (error) return <div>Error loading user data: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Kanban Boards</h1>
      <button 
        onClick={handleCreateBoard}
        disabled={isCreating}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        {isCreating ? 'Creating...' : '➕ Create New Board'}
      </button>

      {/* Placeholder for listing existing boards */}
      <div style={{ marginTop: '30px' }}>
        {/* You will fetch and map through existing boards here */}
        <h2>Existing Boards Placeholder</h2>
      </div>
    </div>
  );
};

export default BoardList;