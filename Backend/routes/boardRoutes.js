import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import * as boardController from '../controllers/boardController.js';

const router = express.Router();

router.post('/create', verifyToken, boardController.createBoard); 

router.get('/user', verifyToken, boardController.getUserBoards);

export default router;