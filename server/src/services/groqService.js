import axios from 'axios';
import { buildReviewPrompt } from '../prompts/reviewPrompt.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const MAX_PROMPT_CHARS = 12000;

// ── Call Groq API ─────────────────────────────────────────────────
const callGroq = async (prompt) => {
  // Extra safety — trim prompt if still too long
  const safePrompt = prompt.length > MAX_PROMPT_CHARS
    ? prompt.substring(0, MAX_PROMPT_CHARS) + '\n\n[Code truncated for analysis]'
    : prompt;

  const key = process.env.GROQ_API_KEY;

  if (!key || key === 'your_groq_api_key' || key.trim() === '') {
    throw new Error('GROQ_API_KEY is missing in .env file. Get your key from https://console.groq.com');
  }

  const payload = {
    model: MODEL,
    messages: [{ role: 'user', content: safePrompt }],
    temperature: 0.3,
    max_tokens: 1500,
  };

  try {
    const { data } = await axios.post(GROQ_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${key.trim()}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });

    return data.choices[0].message.content;

  } catch (err) {
    // Log exact Groq error so we can debug
    const status = err.response?.status;
    const groqMsg = err.response?.data?.error?.message || JSON.stringify(err.response?.data);

    console.error('❌ Groq API failed:');
    console.error('   Status:', status);
    console.error('   Message:', groqMsg);
    console.error('   Model:', MODEL);
    console.error('   Prompt length:', safePrompt.length, 'chars');

    if (status === 401) throw new Error('Invalid Groq API key. Check GROQ_API_KEY in .env');
    if (status === 429) throw new Error('Groq rate limit hit. Wait 1 minute and try again.');
    if (status === 400) throw new Error(`Groq rejected request: ${groqMsg}`);
    if (status === 413) throw new Error('Prompt too large for Groq. Code was trimmed but still too big.');

    throw new Error(`Groq API error (${status}): ${groqMsg || err.message}`);
  }
};

// ── Parse JSON from AI response ───────────────────────────────────
const parseReviewJSON = (rawResponse) => {
  try {
    const cleaned = rawResponse
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    // Find JSON object in response (sometimes AI adds text before/after)
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON found in response');
    }
    const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonStr);

    return {
      overallScore:         clampScore(parsed.overallScore),
      codeQualityScore:     clampScore(parsed.codeQualityScore),
      architectureScore:    clampScore(parsed.architectureScore),
      securityScore:        clampScore(parsed.securityScore),
      performanceScore:     clampScore(parsed.performanceScore),
      maintainabilityScore: clampScore(parsed.maintainabilityScore),
      scalabilityScore:     clampScore(parsed.scalabilityScore),
      documentationScore:   clampScore(parsed.documentationScore),
      testingScore:         clampScore(parsed.testingScore),
      portfolioScore:       clampScore(parsed.portfolioScore),
      strengths:            Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses:           Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      recommendations:      Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      recruiterFeedback:    parsed.recruiterFeedback || '',
      portfolioFeedback:    parsed.portfolioFeedback || '',
      aiSummary:            parsed.aiSummary || '',
      resumeSummary:        parsed.resumeSummary || '',
    };
  } catch (err) {
    console.error('❌ Failed to parse Groq response:', err.message);
    throw new Error('AI returned malformed JSON. Please try again.');
  }
};

const clampScore = (val) => {
  const n = Number(val);
  if (isNaN(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
};

// ── Main export ───────────────────────────────────────────────────
export const generateAIReview = async (metadata, codeContent) => {
  console.log('🤖 Sending to Groq — model:', MODEL);
  console.log('📦 Code content length:', codeContent.length, 'chars');

  const prompt = buildReviewPrompt(
    { ...metadata, totalFiles: metadata.totalFiles, filesAnalyzed: metadata.filesAnalyzed },
    codeContent
  );

  console.log('📝 Total prompt length:', prompt.length, 'chars');

  const rawResponse = await callGroq(prompt);
  console.log('✅ Groq responded, parsing JSON...');

  const review = parseReviewJSON(rawResponse);
  console.log('✅ Review parsed successfully. Overall score:', review.overallScore);

  return review;
};
