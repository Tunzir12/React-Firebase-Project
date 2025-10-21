import express from 'express';
import verifyToken from '../middleware/authMiddleware.js'; // Default import
import * as boardController from '../controllers/boardController.js'; // Import all exports

const router = express.Router();

// POST /api/boards/create
router.post('/create', verifyToken, boardController.createBoard); 

// GET /api/boards/user
router.get('/user', verifyToken, boardController.getUserBoards);

export default router;