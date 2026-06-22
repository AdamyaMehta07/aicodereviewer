import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ── Scores (0-100) ──────────────────────────
    overallScore: { type: Number, default: 0 },
    codeQualityScore: { type: Number, default: 0 },
    architectureScore: { type: Number, default: 0 },
    securityScore: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
    maintainabilityScore: { type: Number, default: 0 },
    scalabilityScore: { type: Number, default: 0 },
    documentationScore: { type: Number, default: 0 },
    testingScore: { type: Number, default: 0 },
    portfolioScore: { type: Number, default: 0 },

    // ── AI Feedback ─────────────────────────────
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    recruiterFeedback: { type: String, default: '' },
    portfolioFeedback: { type: String, default: '' },
    aiSummary: { type: String, default: '' },
    resumeSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
