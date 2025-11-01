import { db } from '../firebase/admin.js';


export const createBoard = async (userId, title, description) => { // Use 'export const'
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
        createdAt: db.FieldValue.serverTimestamp(),
    };
    
    const batch = db.batch();

    batch.set(boardRef, boardData);

    batch.update(userRef, {
        kanbanBoards: db.FieldValue.arrayUnion(boardRef.id) 
    });

    await batch.commit();

    return boardData;
};
