// Frontend-only API that persists data in localStorage
const STORAGE_KEYS = {
  BOARDS: 'kanban_boards',
  CARDS: 'kanban_cards',
  USERS: 'kanban_users'
};

// Board operations
export const getBoards = async (userId) => {
  const boards = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARDS) || '{}');
  return Object.values(boards).filter(board => board.ownerId === userId);
};

export const getBoard = async (boardId) => {
  const boards = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARDS) || '{}');
  return boards[boardId] || null;
};

export const createBoard = async (title, description, userId) => {
  const boards = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARDS) || '{}');
  const newBoard = {
    id: `board-${Date.now()}`,
    title,
    description,
    ownerId: userId,
    columns: [
      { id: 'col-1', title: 'To Do', taskIds: [] },
      { id: 'col-2', title: 'In Progress', taskIds: [] },
      { id: 'col-3', title: 'Done', taskIds: [] },
    ],
    createdAt: new Date().toISOString()
  };
  
  boards[newBoard.id] = newBoard;
  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  return newBoard;
};

// Card operations
export const createCard = async (boardId, columnId, content) => {
  const cards = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '{}');
  const boards = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARDS) || '{}');
  
  const cardId = `card-${Date.now()}`;
  const newCard = {
    id: cardId,
    content,
    columnId,
    boardId,
    createdAt: new Date().toISOString()
  };
  
  // Add card to cards collection
  cards[cardId] = newCard;
  
  // Add card to board's column
  const board = boards[boardId];
  if (board) {
    const column = board.columns.find(col => col.id === columnId);
    if (column) {
      column.taskIds.push(cardId);
      boards[boardId] = board;
    }
  }
  
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  return newCard;
};

export const moveCard = async (cardId, sourceColumnId, destColumnId, newIndex) => {
  const boards = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARDS) || '{}');
  
  // Find which board contains this card
  const boardEntries = Object.entries(boards);
  for (const [boardId, board] of boardEntries) {
    const sourceColumn = board.columns.find(col => col.id === sourceColumnId);
    const destColumn = board.columns.find(col => col.id === destColumnId);
    
    if (sourceColumn && destColumn) {
      // Remove from source column
      sourceColumn.taskIds = sourceColumn.taskIds.filter(id => id !== cardId);
      
      // Add to destination column at specific position
      destColumn.taskIds.splice(newIndex, 0, cardId);
      
      boards[boardId] = board;
      localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
      return { success: true };
    }
  }
  
  return { success: false, error: 'Card or columns not found' };
};

// Initialize with sample data
export const initializeSampleData = (userId) => {
  const existing = localStorage.getItem(STORAGE_KEYS.BOARDS);
  if (!existing) {
    const sampleBoards = {
      'board-1': {
        id: 'board-1',
        title: 'Project Alpha',
        description: 'Main project board',
        ownerId: userId,
        columns: [
          { id: 'col-1', title: 'To Do', taskIds: ['card-1', 'card-2'] },
          { id: 'col-2', title: 'In Progress', taskIds: ['card-3'] },
          { id: 'col-3', title: 'Done', taskIds: ['card-4'] },
        ],
        createdAt: new Date().toISOString()
      }
    };
    
    const sampleCards = {
      'card-1': { id: 'card-1', content: 'Design homepage layout', columnId: 'col-1', boardId: 'board-1' },
      'card-2': { id: 'card-2', content: 'Set up database schema', columnId: 'col-1', boardId: 'board-1' },
      'card-3': { id: 'card-3', content: 'Implement drag and drop', columnId: 'col-2', boardId: 'board-1' },
      'card-4': { id: 'card-4', content: 'Create user authentication', columnId: 'col-3', boardId: 'board-1' },
    };
    
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(sampleBoards));
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(sampleCards));
  }
};

// Or if you prefer named exports as an object:
export const localStorageAPI = {
  getBoards,
  getBoard,
  createBoard,
  createCard,
  moveCard,
  initializeSampleData
};