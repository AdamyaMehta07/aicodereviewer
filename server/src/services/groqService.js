import axios from 'axios';
import { buildReviewPrompt } from '../prompts/reviewPrompt.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const MAX_PROMPT_CHARS = 12000;

const callGroq = async (prompt) => {
  const safePrompt = prompt.length > MAX_PROMPT_CHARS
    ? prompt.substring(0, MAX_PROMPT_CHARS) + '\n\n[Code truncated]'
    : prompt;

  const key = process.env.GROQ_API_KEY;
  if (!key || key.trim() === '') {
    throw new Error('GROQ_API_KEY is missing in environment variables.');
  }

  try {
    const { data } = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a code review assistant. You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no text before or after the JSON. Just the raw JSON object starting with { and ending with }.',
          },
          {
            role: 'user',
            content: safePrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${key.trim()}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return data.choices[0].message.content;
  } catch (err) {
    const status = err.response?.status;
    const groqMsg = err.response?.data?.error?.message || JSON.stringify(err.response?.data);

    console.error('❌ Groq API failed:', status, groqMsg);

    if (status === 401) throw new Error('Invalid Groq API key.');
    if (status === 429) throw new Error('Groq rate limit hit. Wait 1 minute and try again.');
    if (status === 400) throw new Error(`Groq rejected request: ${groqMsg}`);

    throw new Error(`Groq API error (${status}): ${err.message}`);
  }
};

// ── Try to extract JSON from any kind of response ─────────────────
const extractJSON = (raw) => {
  // Remove markdown code blocks
  let cleaned = raw
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  // Find first { and last }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1) {
    console.error('❌ No JSON braces found in response:', cleaned.substring(0, 200));
    throw new Error('AI did not return JSON. Please try again.');
  }

  return cleaned.substring(start, end + 1);
};

const parseReviewJSON = (rawResponse) => {
  console.log('📄 Raw Groq response (first 300 chars):', rawResponse.substring(0, 300));

  try {
    const jsonStr = extractJSON(rawResponse);
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
      strengths:            toArray(parsed.strengths),
      weaknesses:           toArray(parsed.weaknesses),
      recommendations:      toArray(parsed.recommendations),
      recruiterFeedback:    parsed.recruiterFeedback || 'No recruiter feedback generated.',
      portfolioFeedback:    parsed.portfolioFeedback || 'No portfolio feedback generated.',
      aiSummary:            parsed.aiSummary || 'No summary generated.',
      resumeSummary:        parsed.resumeSummary || parsed.aiSummary || 'No resume summary generated.',
    };
  } catch (err) {
    console.error('❌ JSON parse failed:', err.message);
    console.error('❌ Full raw response:', rawResponse);
    throw new Error('AI returned malformed JSON. Please try again.');
  }
};

const clampScore = (val) => {
  const n = Number(val);
  if (isNaN(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
};

const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return [val];
  return [];
};

export const generateAIReview = async (metadata, codeContent) => {
  console.log('🤖 Groq model:', MODEL);
  console.log('📦 Code length:', codeContent.length, 'chars');

  const prompt = buildReviewPrompt(
    { ...metadata, totalFiles: metadata.totalFiles, filesAnalyzed: metadata.filesAnalyzed },
    codeContent
  );

  console.log('📝 Prompt length:', prompt.length, 'chars');

  const rawResponse = await callGroq(prompt);
  console.log('✅ Groq responded');

  const review = parseReviewJSON(rawResponse);
  console.log('✅ Parsed. Overall score:', review.overallScore);

  return review;
};
