import express from 'express';
import { register, login, logout, getMe, updateProfile, becomeRunner } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/become-runner', protect, becomeRunner);

export default router;

