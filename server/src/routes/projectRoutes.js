import express from 'express';
import {
  createProject,
  getMyProjects,
  getProject,
  deleteProject,
} from '../controllers/projectController.js';
import protect from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { projectValidator } from '../validators/projectValidators.js';

const router = express.Router();

// All project routes are protected
router.use(protect);

router.post('/',         projectValidator, validate, createProject);
router.get('/',          getMyProjects);
router.get('/:id',       getProject);
router.delete('/:id',    deleteProject);

export default router;
