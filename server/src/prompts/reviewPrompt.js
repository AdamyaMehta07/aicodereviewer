export const buildReviewPrompt = (metadata, codeContent) => {
  return `Analyze this GitHub repository and return a JSON code review.

Repository: ${metadata.name}
Language: ${metadata.language || 'Unknown'}
Description: ${metadata.description || 'No description'}

Code:
${codeContent}

Return this exact JSON structure with no other text:
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
  "recommendations": ["fix 1", "fix 2", "fix 3"],
  "recruiterFeedback": "How a recruiter sees this project.",
  "portfolioFeedback": "How to present this in a portfolio.",
  "aiSummary": "2-3 sentence technical summary.",
  "resumeSummary": "One resume bullet point."
}`;
};
