import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import { auth } from '../../firebase_config';
import { localStorageAPI } from '../api/localStorageAPI';

const Board = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');

  const columnIds = useMemo(() => board ? board.columns.map(col => col.id) : [], [board]);

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
        const boardData = await localStorageAPI.getBoard(boardId);
        if (!boardData) {
          setError("Board not found.");
          return;
        }
        setBoard(boardData);
        setBoardTitle(boardData.title);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
        setError("Failed to load board data. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

  // Board Title Management
  const handleTitleEdit = () => {
    setEditingTitle(true);
  };

  const handleTitleSave = async () => {
    if (boardTitle.trim() && board) {
      const updatedBoard = { ...board, title: boardTitle.trim() };
      setBoard(updatedBoard);
      // TODO: Add updateBoard function to localStorageAPI
    }
    setEditingTitle(false);
  };

  const handleTitleChange = (e) => {
    setBoardTitle(e.target.value);
  };

  // Column Management
  const handleAddColumn = async () => {
    if (!board) return;
    
    const newColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      taskIds: []
    };
    
    const updatedBoard = {
      ...board,
      columns: [...board.columns, newColumn]
    };
    
    setBoard(updatedBoard);
    // TODO: Add updateBoard function to localStorageAPI
  };

  const handleDeleteColumn = async (columnId) => {
    if (!board) return;
    
    const updatedBoard = {
      ...board,
      columns: board.columns.filter(col => col.id !== columnId)
    };
    
    setBoard(updatedBoard);
    // TODO: Add updateBoard function to localStorageAPI
  };

  // Card Management
  const handleAddCard = async (columnId) => {
    if (!board) return;
    
    const newCardId = `card-${Date.now()}`;
    const updatedColumns = board.columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          taskIds: [...column.taskIds, newCardId]
        };
      }
      return column;
    });
    
    const updatedBoard = {
      ...board,
      columns: updatedColumns
    };
    
    setBoard(updatedBoard);
    // TODO: Add createCard function call to localStorageAPI
  };

  const handleDeleteCard = async (cardId, columnId) => {
    if (!board) return;
    
    const updatedColumns = board.columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          taskIds: column.taskIds.filter(id => id !== cardId)
        };
      }
      return column;
    });
    
    const updatedBoard = {
      ...board,
      columns: updatedColumns
    };
    
    setBoard(updatedBoard);
    // TODO: Add deleteCard function to localStorageAPI
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log(`Item with ID ${active.id} moved over item with ID ${over.id}`);
  }

  const getCardsForColumn = (taskIds) => {
    return taskIds.map(taskId => ({ 
      id: taskId, 
      content: `Card ${taskId}`,
      onDelete: () => handleDeleteCard(taskId, column.id)
    }));
  };

  if (loading) return <div style={{padding: '20px'}}>Loading board "{boardId}"...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>Error: {error}</div>;
  if (!board) return <div style={{padding: '20px'}}>Board not found.</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Board Header with Title Edit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        {editingTitle ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              value={boardTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
              style={{ fontSize: '24px', fontWeight: 'bold', padding: '5px' }}
              autoFocus
            />
            <button onClick={handleTitleSave}>💾</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0 }}>{board.title}</h1>
            <button 
              onClick={handleTitleEdit}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      {/* Add Column Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleAddColumn}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Add Column
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {board.columns.map((column) => (
              <Column 
                key={column.id} 
                columnId={column.id} 
                title={column.title}
                cards={getCardsForColumn(column.taskIds)}
                onAddCard={() => handleAddCard(column.id)}
                onDeleteColumn={() => handleDeleteColumn(column.id)}
                onEditColumn={(newTitle) => {
                  // TODO: Implement column title edit
                  console.log('Edit column:', column.id, 'to:', newTitle);
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;