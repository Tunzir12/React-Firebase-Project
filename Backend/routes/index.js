import express from 'express';
import * as authController from '../controllers/authController.js'; // Import all exports
import boardRoutes from './boardRoutes.js'; // Import the board router

const router = express.Router();

// --- Authentication Routes ---
// Access exported functions via the namespace import
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- Protected Data Routes ---
router.use('/boards', boardRoutes);

export default router;