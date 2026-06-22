import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    featuredProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    portfolioScore: { type: Number, default: 0 },
    generatedDescription: { type: String, default: '' },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true, // allows null until slug is set
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
