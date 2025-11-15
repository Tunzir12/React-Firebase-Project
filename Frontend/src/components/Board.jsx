import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import { auth } from '../../firebase_config';

const Board = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a stable array of column IDs for DND context
  const columnIds = useMemo(() => board ? board.columns.map(col => col.id) : [], [board]);

  // Mock data for development - replace with real API later
  const mockBoardData = {
    id: boardId,
    title: `Project ${boardId}`,
    columns: [
      { 
        id: 'col-1', 
        title: 'To Do', 
        taskIds: ['task-1', 'task-2', 'task-3'] 
      },
      { 
        id: 'col-2', 
        title: 'In Progress', 
        taskIds: ['task-4', 'task-5'] 
      },
      { 
        id: 'col-3', 
        title: 'Done', 
        taskIds: ['task-6'] 
      },
    ]
  };

  // Mock cards data
  const mockCards = {
    'task-1': { id: 'task-1', content: 'Design homepage layout' },
    'task-2': { id: 'task-2', content: 'Set up database schema' },
    'task-3': { id: 'task-3', content: 'Create user authentication' },
    'task-4': { id: 'task-4', content: 'Implement drag and drop' },
    'task-5': { id: 'task-5', content: 'Add real-time updates' },
    'task-6': { id: 'task-6', content: 'Deploy to production' },
  };

  // --- 1. Data Fetching Logic (Mock for now) ---
  useEffect(() => {
    const fetchBoardData = async () => {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser; 
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of backend call
        setBoard(mockBoardData);
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

  // Helper to get card data for a column
  const getCardsForColumn = (taskIds) => {
    return taskIds.map(taskId => mockCards[taskId] || { id: taskId, content: `Card ${taskId}` });
  };

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
                // Pass actual card data instead of placeholder
                cards={getCardsForColumn(column.taskIds)} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;