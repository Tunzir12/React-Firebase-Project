// backend/services/boardService.js (UPDATED)

// Import the Firestore database instance
import { db } from '../firebase/admin.js'; 
import admin from 'firebase-admin'; // Import admin for FieldValue

/**
 * Creates a new board document and adds its ID to the user's profile array 
 * using a Firestore Batch for atomicity.
 * * @param {string} userId - The Firebase UID of the board creator.
 * @param {string} title - The title of the new board.
 * @param {string} [description=''] - The description of the new board.
 * @returns {object} The created board data object.
 */
export const createBoard = async (userId, title, description = '') => { 
    // 1. Create references
    const boardRef = db.collection('boards').doc(); 
    const userRef = db.collection('users').doc(userId);

    const boardData = {
        id: boardRef.id,
        title: title,
        description: description,
        ownerId: userId,
        members: [userId], 
        columns: [
            { id: 'col-1', title: 'To Do', taskIds: [] },
            { id: 'col-2', title: 'In Progress', taskIds: [] },
            { id: 'col-3', title: 'Done', taskIds: [] },
        ],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    // 2. Use a Firestore Batch 
    const batch = db.batch();

    batch.set(boardRef, boardData);

    // Assuming the user document exists and has a 'kanbanBoards' array
    batch.update(userRef, {
        kanbanBoards: admin.firestore.FieldValue.arrayUnion(boardRef.id) 
    });

    await batch.commit();

    return boardData;
};

/**
 * Fetches a single board document by ID.
 * * @param {string} boardId - The ID of the board to fetch.
 * @param {string} userId - The Firebase UID of the requesting user for authorization checks.
 * @returns {object|null} The board data or null if not found or unauthorized.
 */
export const getBoardById = async (boardId, userId) => {
    const boardRef = db.collection('boards').doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
        return null;
    }

    const boardData = boardDoc.data();

    // Authorization check: Only members of the board can view it.
    if (!boardData.members.includes(userId)) {
        // You might want to throw a specific error or return a status code here
        console.warn(`User ${userId} attempted to access unauthorized board ${boardId}`);
        return null; // Return null if the user is not a member
    }

    // You would typically also fetch cards/tasks here from a subcollection if you 
    // needed them all at once. For now, we return the board structure.
    return boardData;
};


// You will add more service functions here, such as:
// export const updateBoardColumns = async (boardId, newColumns) => { ... };
// export const updateCardPosition = async (cardId, sourceCol, destCol, newIndex) => { ... };