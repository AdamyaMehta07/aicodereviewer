import axios from 'axios';

// Folders to completely skip
const IGNORE_PATHS = [
  'node_modules', 'dist', 'build', '.next', 'out', 'coverage',
  '.git', '.cache', 'vendor', '__pycache__', '.venv', 'venv',
  'target', 'bin', 'obj', '.gradle', 'pods',
  'public', 'static', 'assets', 'images', 'fonts', 'icons',
  'styles', 'css', 'scss', 'less', 'storybook', '.storybook',
  'migrations', 'seeds', 'fixtures', 'mocks', '__mocks__',
];

// Only these extensions will be read
const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.java', '.go', '.rs',
  '.cpp', '.c', '.cs', '.php',
  '.rb', '.swift', '.kt', '.vue',
  '.svelte', '.md',
];

// Skip these specific filenames even if extension matches
const IGNORE_FILENAMES = [
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.eslintrc', '.prettierrc', '.babelrc',
  'jest.config.js', 'webpack.config.js', 'rollup.config.js',
  'vite.config.js', 'next.config.js', 'nuxt.config.js',
  'tailwind.config.js', 'postcss.config.js',
];

const MAX_FILE_SIZE  = 10000; // 10KB per file max
const MAX_TOTAL_CHARS = 5000; // total chars sent to Groq

const githubAxios = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

// ── Parse GitHub URL ──────────────────────────────────────────────
export const parseGithubUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
};

// ── Fetch repo metadata ───────────────────────────────────────────
export const fetchRepoMetadata = async (owner, repo) => {
  try {
    const { data } = await githubAxios.get(`/repos/${owner}/${repo}`);
    return {
      name:          data.name,
      description:   data.description,
      language:      data.language,
      stars:         data.stargazers_count,
      forks:         data.forks_count,
      size:          data.size,
      defaultBranch: data.default_branch,
      topics:        data.topics || [],
      license:       data.license?.name || null,
    };
  } catch (err) {
    if (err.response?.status === 404) throw new Error('Repository not found. Make sure it is public.');
    if (err.response?.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
    throw new Error('Failed to fetch repository metadata.');
  }
};

// ── Fetch file tree ───────────────────────────────────────────────
export const fetchFileTree = async (owner, repo, branch = 'main') => {
  try {
    const { data } = await githubAxios.get(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );
    return data.tree.filter((item) => item.type === 'blob');
  } catch {
    try {
      const { data } = await githubAxios.get(
        `/repos/${owner}/${repo}/git/trees/master?recursive=1`
      );
      return data.tree.filter((item) => item.type === 'blob');
    } catch {
      throw new Error('Could not fetch file tree.');
    }
  }
};

// ── Filter files ──────────────────────────────────────────────────
export const filterFiles = (files) => {
  return files.filter((file) => {
    const path     = file.path.toLowerCase();
    const filename = path.split('/').pop();

    // Skip ignored folders
    const inIgnoredFolder = IGNORE_PATHS.some((ignore) =>
      path.includes(`/${ignore}/`) || path.startsWith(`${ignore}/`)
    );
    if (inIgnoredFolder) return false;

    // Skip ignored filenames
    if (IGNORE_FILENAMES.some((f) => filename === f)) return false;

    // Skip files that are too large
    if (file.size > MAX_FILE_SIZE) return false;

    // Only allowed extensions
    return ALLOWED_EXTENSIONS.some((ext) => path.endsWith(ext));
  });
};

// ── Fetch single file content ─────────────────────────────────────
export const fetchFileContent = async (owner, repo, filePath) => {
  try {
    const { data } = await githubAxios.get(
      `/repos/${owner}/${repo}/contents/${filePath}`
    );
    if (data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return data.content;
  } catch {
    return null;
  }
};

// ── Prioritize important files ────────────────────────────────────
const prioritizeFiles = (files) => {
  const priority = [
    'readme', 'index', 'main', 'app', 'server',
    'router', 'routes', 'controller', 'model',
    'schema', 'middleware', 'auth', 'service',
    'hook', 'context', 'util', 'helper', 'config',
  ];

  return [...files].sort((a, b) => {
    const aName  = a.path.toLowerCase();
    const bName  = b.path.toLowerCase();
    const aScore = priority.findIndex((p) => aName.includes(p));
    const bScore = priority.findIndex((p) => bName.includes(p));
    if (aScore === -1 && bScore === -1) return 0;
    if (aScore === -1) return 1;
    if (bScore === -1) return -1;
    return aScore - bScore;
  });
};

// ── Main export ───────────────────────────────────────────────────
export const fetchRepositoryCode = async (githubUrl) => {
  const { owner, repo } = parseGithubUrl(githubUrl);

  const metadata    = await fetchRepoMetadata(owner, repo);
  const allFiles    = await fetchFileTree(owner, repo, metadata.defaultBranch);
  const filtered    = filterFiles(allFiles);
  const prioritized = prioritizeFiles(filtered);

  console.log(`📁 Total files: ${allFiles.length}`);
  console.log(`✅ Filtered to: ${filtered.length} analyzable files`);

  let totalChars = 0;
  const codeChunks = [];

  for (const file of prioritized) {
    if (totalChars >= MAX_TOTAL_CHARS) break;

    const content = await fetchFileContent(owner, repo, file.path);
    if (!content || content.trim().length === 0) continue;

    // Extra check — skip if content looks like CSS/JSON config
    if (isCSSOrConfig(content)) {
      console.log(`⏭ Skipping (CSS/config detected): ${file.path}`);
      continue;
    }

    const remaining = MAX_TOTAL_CHARS - totalChars;
    const trimmed   = content.length > remaining
      ? content.substring(0, remaining) + '\n// [truncated]'
      : content;

    const chunk = `\n// FILE: ${file.path}\n${trimmed}`;
    codeChunks.push(chunk);
    totalChars += chunk.length;

    console.log(`📄 Added: ${file.path} (${trimmed.length} chars)`);
  }

  console.log(`📦 Total code sent to AI: ${totalChars} chars from ${codeChunks.length} files`);

  return {
    metadata:      { ...metadata, owner, repo },
    codeContent:   codeChunks.join('\n'),
    filesAnalyzed: codeChunks.length,
    totalFiles:    allFiles.length,
  };
};

// ── Detect CSS or pure config content ────────────────────────────
const isCSSOrConfig = (content) => {
  const trimmed = content.trim();

  // Starts with CSS selector patterns
  if (/^[.#:*][\w-]+\s*\{/.test(trimmed)) return true;

  // Mostly CSS properties like "color:", "font-size:", "background:"
  const cssPatterns = (trimmed.match(/[\w-]+\s*:\s*[^;{]+;/g) || []).length;
  const lines       = trimmed.split('\n').length;
  if (lines > 5 && cssPatterns / lines > 0.4) return true;

  // Pure JSON with no code logic
  if (trimmed.startsWith('{') && !trimmed.includes('function') &&
      !trimmed.includes('=>') && !trimmed.includes('const ') &&
      !trimmed.includes('import ')) {
    try {
      JSON.parse(trimmed);
      return true; // valid JSON with no code = config file
    } catch {
      return false;
    }
  }

  return false;
};
