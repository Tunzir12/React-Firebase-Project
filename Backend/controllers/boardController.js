// backend/controllers/boardController.js (UPDATED)

import * as boardService from '../services/boardService.js';

/**
 * Handles POST /api/boards/create
 * Creates a new Kanban board.
 */
export const createBoard = async (req, res) => {
    // ... (Your existing createBoard logic remains here)
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

/**
 * Handles GET /api/boards/:boardId
 * Fetches a single Kanban board by ID, ensuring the user is a member.
 */
export const getBoard = async (req, res) => {
    const { boardId } = req.params; // Get boardId from the URL parameters
    const userId = req.user.uid;     // Get userId from the authentication middleware (req.user)

    try {
        const board = await boardService.getBoardById(boardId, userId);

        if (!board) {
            // Check if the board was not found OR if the user was unauthorized (service returns null in both cases)
            return res.status(404).send({ error: 'Board not found or access denied.' });
        }

        res.status(200).send(board);
    } catch (error) {
        console.error('Controller error fetching board:', error);
        res.status(500).send({ error: 'Failed to fetch board due to a server error.' });
    }
};

// Placeholder for getting a user's boards 
export const getUserBoards = async (req, res) => { 
    // ... (This function remains as a placeholder for later implementation)
    res.status(200).send([]);
}