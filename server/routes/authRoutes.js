import express from 'express';
import { register, login, logout, getMe, updateProfile, becomeRunner, uploadAvatar, checkApprovalStatus } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-status', checkApprovalStatus);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/become-runner', protect, becomeRunner);

export default router;

