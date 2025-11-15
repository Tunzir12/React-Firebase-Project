import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase_config';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from 'react';

const BoardList = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Mock boards data - replace with real API calls later
  const [mockBoards, setMockBoards] = useState([
    { id: 'board-1', title: 'Project Alpha', description: 'Main project board' },
    { id: 'board-2', title: 'Personal Tasks', description: 'Daily tasks' }
  ]);

  /**
   * Mock function to create a new board - replace with real API later
   */
  const handleCreateBoard = async () => {
    if (loading || !user) {
      console.warn("User not loaded or not authenticated.");
      return;
    }

    setIsCreating(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock board data
      const newBoard = {
        id: `board-${Date.now()}`,
        title: 'Untitled Board',
        description: 'New Kanban board for tracking tasks.',
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      };

      // Add to mock boards (replace with real API call later)
      setMockBoards(prev => [...prev, newBoard]);

      // Navigate to the new board
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