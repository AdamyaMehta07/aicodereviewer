import Project from '../models/Project.js';
import Review from '../models/Review.js';
import { analyzeAndReview } from '../services/reviewService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ── Trigger AI review for a project ──────────────────────────────
export const triggerReview = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return errorResponse(res, 'Project not found.', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    if (project.status === 'analyzing') {
      return errorResponse(res, 'Analysis already in progress.', 400);
    }

    // Run analysis (this takes 10-30 seconds)
    const review = await analyzeAndReview(project._id, req.user._id);

    return successResponse(res, { review }, 'AI review generated successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Get review for a project ──────────────────────────────────────
export const getReview = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return errorResponse(res, 'Project not found.', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    const review = await Review.findOne({ projectId: req.params.projectId });

    if (!review) {
      return errorResponse(res, 'Review not found. Please trigger analysis first.', 404);
    }

    return successResponse(res, { review }, 'Review fetched successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
