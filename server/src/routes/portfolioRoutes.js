import express from 'express';
import {
  getMyPortfolio,
  updateFeaturedProjects,
  getPublicPortfolio,
} from '../controllers/portfolioController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/public/:slug', getPublicPortfolio);

// Protected
router.get('/',          protect, getMyPortfolio);
router.put('/featured',  protect, updateFeaturedProjects);

export default router;
