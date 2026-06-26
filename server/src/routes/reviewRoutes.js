import express from 'express';
import { triggerReview, getReview } from '../controllers/reviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// POST /api/reviews/:projectId/analyze  — trigger AI review
router.post('/:projectId/analyze', triggerReview);

// GET  /api/reviews/:projectId          — get existing review
router.get('/:projectId', getReview);

export default router;
