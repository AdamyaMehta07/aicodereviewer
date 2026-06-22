import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ── Get my portfolio ──────────────────────────────────────────────
export const getMyPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id })
      .populate({ path: 'featuredProjects', populate: { path: 'review' } });

    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.user._id });
    }

    return successResponse(res, { portfolio }, 'Portfolio fetched successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Update featured projects ──────────────────────────────────────
export const updateFeaturedProjects = async (req, res) => {
  try {
    const { featuredProjects } = req.body;

    // Verify all projects belong to user
    const projects = await Project.find({
      _id: { $in: featuredProjects },
      owner: req.user._id,
    });

    if (projects.length !== featuredProjects.length) {
      return errorResponse(res, 'One or more projects not found or not authorized.', 400);
    }

    // Calculate portfolio score as average of featured project scores
    const completedProjects = projects.filter((p) => p.review);
    let portfolioScore = 0;
    if (completedProjects.length > 0) {
      const total = completedProjects.reduce((sum, p) => sum + (p.review?.overallScore || 0), 0);
      portfolioScore = Math.round(total / completedProjects.length);
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { featuredProjects, portfolioScore },
      { new: true, upsert: true }
    ).populate({ path: 'featuredProjects', populate: { path: 'review' } });

    return successResponse(res, { portfolio }, 'Portfolio updated successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Get public portfolio by slug ──────────────────────────────────
export const getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      publicSlug: req.params.slug,
      isPublic: true,
    }).populate({
      path: 'featuredProjects',
      populate: [{ path: 'review' }, { path: 'owner', select: 'name' }],
    });

    if (!portfolio) {
      return errorResponse(res, 'Portfolio not found.', 404);
    }

    return successResponse(res, { portfolio }, 'Public portfolio fetched.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
