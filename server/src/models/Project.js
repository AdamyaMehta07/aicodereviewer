import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [500, 'Description must be under 500 characters'],
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub URL is required'],
      match: [
        /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/,
        'Please enter a valid GitHub repository URL',
      ],
    },
    techStack: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data/ML', 'Other'],
      required: [true, 'Category is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed'],
      default: 'pending',
    },
    // populated after AI review completes
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
