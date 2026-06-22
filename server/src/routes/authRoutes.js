import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login',    loginValidator,    validate, login);

// Protected routes
router.get('/me',              protect, getMe);
router.put('/update-profile',  protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
