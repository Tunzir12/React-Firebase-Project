import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column'; // Component to represent a Kanban column
import { auth } from '../../firebase_config'; // Firebase Auth instance
import { getUserBoardsData } from '../../../Backend/services/boardService'; // Placeholder for fetching board data
// NOTE: You will need to create the boardService.js file in your frontend (src/services)

// Assuming you use an environment variable for your backend URL (not strictly needed here, 
// as we are using a service function, but good practice)
// const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const Board = () => {
  const { boardId } = useParams(); // Get the ID from the URL: /kanban/:boardId
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a stable array of column IDs for DND context
  const columnIds = useMemo(() => board ? board.columns.map(col => col.id) : [], [board]);

  // --- 1. Data Fetching Logic (Placeholder) ---
  useEffect(() => {
    const fetchBoardData = async () => {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd fetch the user's ID token and send it with the request
      const user = auth.currentUser; 
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      
      try {
        // NOTE: This function is currently a placeholder. It needs implementation!
        const boardData = await getUserBoardsData(user, boardId); 
        setBoard(boardData);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
        setError("Failed to load board data. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]); 

  // --- 2. DND Event Handler ---
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // TODO: Add complex logic here:
    // 1. If dragging a Card (between columns, or within a column): Update card's column/position
    // 2. If dragging a Column (reordering columns): Update board.columns array
    
    console.log(`Item with ID ${active.id} moved over item with ID ${over.id}`);
  }

  if (loading) return <div style={{padding: '20px'}}>Loading board "{boardId}"...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>Error: {error}</div>;
  if (!board) return <div style={{padding: '20px'}}>Board not found.</div>;


  // --- 3. Render DND Context ---
  return (
    <div style={{ padding: '20px' }}>
      <h1>{board.title}</h1>
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
        
        {/* DndContext is the top-level wrapper for all drag-and-drop functionality */}
        <DndContext 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          {/* SortableContext is used for drag-and-drop reordering */}
          <SortableContext 
            items={columnIds} 
            strategy={horizontalListSortingStrategy}
          >
            {board.columns.map((column) => (
              // The Column component needs to be a SortableItem itself (using useSortable)
              <Column 
                key={column.id} 
                columnId={column.id} 
                title={column.title}
                // Pass card data for this column down
                cards={column.taskIds.map(taskId => ({ id: taskId, content: `Card ${taskId}`}))} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;