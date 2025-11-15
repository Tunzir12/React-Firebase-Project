import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase_config';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState, useEffect } from 'react'; // ✅ Add useEffect here

//mock api
import { localStorageAPI } from '../api/localStorageAPI';

const BoardList = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Mock boards data - replace with real API calls later
  const [mockBoards, setMockBoards] = useState([]); // ✅ Start with empty array

  useEffect(() => {
    if (user) {
      localStorageAPI.initializeSampleData(user.uid);
      const loadBoards = async () => {
        const userBoards = await localStorageAPI.getBoards(user.uid);
        setMockBoards(userBoards);
      };
      loadBoards();
    }
  }, [user]);

  const handleCreateBoard = async () => {
    if (loading || !user) {
      console.warn("User not loaded or not authenticated.");
      return;
    }

    setIsCreating(true);
    
    try {
      const newBoard = await localStorageAPI.createBoard('New Board', '', user.uid);
      setMockBoards(prev => [...prev, newBoard]);
      navigate(`/kanban/${newBoard.id}`);
    } catch (err) {
      console.error('Error creating board:', err.message);
      alert(`Could not create board: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNavigateToBoard = (boardId) => {
    navigate(`/kanban/${boardId}`);
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

      {/* Display existing boards */}
      <div style={{ marginTop: '30px' }}>
        <h2>Your Boards</h2>
        {mockBoards.length === 0 ? (
          <p>No boards yet. Create your first one!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {mockBoards.map(board => (
              <div 
                key={board.id}
                onClick={() => handleNavigateToBoard(board.id)}
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0' }}>{board.title}</h3>
                <p style={{ margin: 0, color: '#666' }}>{board.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardList;