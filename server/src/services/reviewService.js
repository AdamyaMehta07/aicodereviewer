import Project from '../models/Project.js';
import Review from '../models/Review.js';
import { fetchRepositoryCode } from './githubService.js';
import { generateAIReview } from './groqService.js';

export const analyzeAndReview = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found.');

  try {
    // 1. Mark project as analyzing
    project.status = 'analyzing';
    await project.save();

    // 2. Fetch repository code from GitHub
    const { metadata, codeContent, filesAnalyzed, totalFiles } =
      await fetchRepositoryCode(project.githubUrl);

    // 3. Generate AI review via Groq
    const reviewData = await generateAIReview(
      { ...metadata, filesAnalyzed, totalFiles },
      codeContent
    );

    // 4. Save review to database
    const review = await Review.findOneAndUpdate(
      { projectId },
      { ...reviewData, projectId, owner: userId },
      { upsert: true, new: true }
    );

    // 5. Link review to project and mark as completed
    project.review = review._id;
    project.status = 'completed';
    await project.save();

    return review;
  } catch (error) {
    // Mark project as failed so user knows something went wrong
    project.status = 'failed';
    await project.save();
    throw error;
  }
};
