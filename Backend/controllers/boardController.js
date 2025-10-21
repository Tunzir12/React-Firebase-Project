import * as boardService from '../services/boardService.js'; // Use import and .js extension

/**
 * Handles POST /api/boards/create
 * Creates a new Kanban board.
 */
export const createBoard = async (req, res) => { // Use 'export const'
    const { title, description } = req.body;
    const userId = req.user.uid; 

    if (!title) {
        return res.status(400).send({ error: 'Board title is required.' });
    }

    try {
        const newBoard = await boardService.createBoard(userId, title, description);
        res.status(201).send({
            message: 'Board created successfully.',
            board: newBoard
        });
    } catch (error) {
        console.error('Controller error creating board:', error);
        res.status(500).send({ error: 'Failed to create board due to a server error.' });
    }
};

// Placeholder for getting a user's boards (Using 'export const')
export const getUserBoards = async (req, res) => { 
    // const userId = req.user.uid;
    // const boards = await boardService.getBoardsByUserId(userId);
    // res.status(200).send(boards);
    res.status(200).send([]); // Placeholder response
}