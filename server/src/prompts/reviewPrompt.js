export const buildReviewPrompt = (metadata, codeContent) => {
  return `You are a Senior Software Engineer doing a code review.

Repository: ${metadata.name}
Language: ${metadata.language || 'Unknown'}
Description: ${metadata.description || 'No description'}

Source Code:
${codeContent}

Return ONLY a raw JSON object (no markdown, no explanation) with this exact structure:
{
  "overallScore": 75,
  "codeQualityScore": 75,
  "architectureScore": 75,
  "securityScore": 75,
  "performanceScore": 75,
  "maintainabilityScore": 75,
  "scalabilityScore": 75,
  "documentationScore": 75,
  "testingScore": 75,
  "portfolioScore": 75,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "recruiterFeedback": "How a recruiter would view this project.",
  "portfolioFeedback": "How to present this project in a portfolio.",
  "aiSummary": "2-3 sentence technical summary.",
  "resumeSummary": "One resume bullet point for this project."
}

Score from 0-100. Be specific and honest. Return ONLY the JSON.`;
};
