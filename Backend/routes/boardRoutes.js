import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import * as boardController from '../controllers/boardController.js';

const router = express.Router();

router.post('/create', verifyToken, boardController.createBoard); 

router.get('/user', verifyToken, boardController.getUserBoards);

router.get('/:boardId', verifyToken, boardController.getBoard); 

// Route 3: Get all boards for the logged-in user
router.get('/', verifyToken, boardController.getUserBoards);

export default router;