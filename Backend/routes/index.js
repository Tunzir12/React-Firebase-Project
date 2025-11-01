import express from 'express';
import * as authController from '../controllers/authController.js';
import boardRoutes from './boardRoutes.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use('/boards', boardRoutes);

export default router;