import Project from '../models/Project.js';
import Review from '../models/Review.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ── Create project ────────────────────────────────────────────────
export const createProject = async (req, res) => {
  try {
    const { title, description, githubUrl, techStack, category } = req.body;

    // techStack comes as comma-separated string from form, convert to array
    const techArray = typeof techStack === 'string'
      ? techStack.split(',').map((t) => t.trim()).filter(Boolean)
      : techStack;

    const project = await Project.create({
      title,
      description,
      githubUrl,
      techStack: techArray,
      category,
      owner: req.user._id,
      status: 'pending',
    });

    return successResponse(res, { project }, 'Project created. Analysis will begin shortly.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Get all projects for logged-in user ───────────────────────────
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('review')
      .sort({ createdAt: -1 });

    return successResponse(res, { projects }, 'Projects fetched successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Get single project ────────────────────────────────────────────
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('review');

    if (!project) {
      return errorResponse(res, 'Project not found.', 404);
    }

    // Make sure the project belongs to the requesting user
    if (project.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to view this project.', 403);
    }

    return successResponse(res, { project }, 'Project fetched successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Delete project ────────────────────────────────────────────────
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found.', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this project.', 403);
    }

    // Delete associated review if exists
    if (project.review) {
      await Review.findByIdAndDelete(project.review);
    }

    await project.deleteOne();

    return successResponse(res, null, 'Project deleted successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
