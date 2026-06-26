import axios from 'axios';

// Files and folders to completely ignore
const IGNORE_PATHS = [
  'node_modules', 'dist', 'build', '.next', 'out', 'coverage',
  '.git', '.cache', 'vendor', '__pycache__', '.venv', 'venv',
  'target', 'bin', 'obj', '.gradle', 'pods',
];

// Only analyze these file extensions
const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go',
  '.rs', '.cpp', '.c', '.cs', '.php', '.rb', '.swift',
  '.kt', '.vue', '.svelte', '.html', '.css', '.scss',
  '.json', '.yaml', '.yml', '.toml', '.env.example',
  '.md', '.sh', '.dockerfile', 'dockerfile',
];

// Max file size to read (50KB per file)
const MAX_FILE_SIZE = 50000;
// Max total characters to send to AI
const MAX_TOTAL_CHARS = 8000;

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

// ── Fetch repository metadata ─────────────────────────────────────
export const fetchRepoMetadata = async (owner, repo) => {
  try {
    const { data } = await githubAxios.get(`/repos/${owner}/${repo}`);
    return {
      name: data.name,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      size: data.size,
      defaultBranch: data.default_branch,
      topics: data.topics || [],
      license: data.license?.name || null,
      hasReadme: false,
    };
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('Repository not found. Make sure it is public.');
    }
    if (err.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Try again in an hour.');
    }
    throw new Error('Failed to fetch repository metadata.');
  }
};

// ── Fetch full file tree ──────────────────────────────────────────
export const fetchFileTree = async (owner, repo, branch = 'main') => {
  try {
    const { data } = await githubAxios.get(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );
    return data.tree.filter((item) => item.type === 'blob');
  } catch (err) {
    // Try master branch if main fails
    if (err.response?.status === 404) {
      try {
        const { data } = await githubAxios.get(
          `/repos/${owner}/${repo}/git/trees/master?recursive=1`
        );
        return data.tree.filter((item) => item.type === 'blob');
      } catch {
        throw new Error('Could not fetch file tree. Check the repository branch.');
      }
    }
    throw new Error('Failed to fetch file tree.');
  }
};

// ── Filter files worth analyzing ──────────────────────────────────
export const filterFiles = (files) => {
  return files.filter((file) => {
    const path = file.path.toLowerCase();

    // Skip ignored folders
    const isIgnored = IGNORE_PATHS.some((ignore) =>
      path.includes(`/${ignore}/`) || path.startsWith(`${ignore}/`)
    );
    if (isIgnored) return false;

    // Skip files that are too large
    if (file.size > MAX_FILE_SIZE) return false;

    // Only include allowed extensions
    const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) =>
      path.endsWith(ext)
    );
    return hasAllowedExt;
  });
};

// ── Fetch file content ────────────────────────────────────────────
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
    return null; // skip files that fail to fetch
  }
};

// ── Main: fetch and chunk all important files ─────────────────────
export const fetchRepositoryCode = async (githubUrl) => {
  const { owner, repo } = parseGithubUrl(githubUrl);

  // 1. Get repo info
  const metadata = await fetchRepoMetadata(owner, repo);

  // 2. Get file tree
  const allFiles = await fetchFileTree(owner, repo, metadata.defaultBranch);

  // 3. Filter to only analyzable files
  const filteredFiles = filterFiles(allFiles);

  // 4. Prioritize important files first
  const prioritized = prioritizeFiles(filteredFiles);

  // 5. Fetch file contents until we hit the char limit
  let totalChars = 0;
  const codeChunks = [];

  for (const file of prioritized) {
    if (totalChars >= MAX_TOTAL_CHARS) break;

    const content = await fetchFileContent(owner, repo, file.path);
    if (!content) continue;

    const chunk = `\n\n// ── FILE: ${file.path} ──\n${content}`;
    totalChars += chunk.length;
    codeChunks.push(chunk);
  }

  return {
    metadata: { ...metadata, owner, repo },
    codeContent: codeChunks.join(''),
    filesAnalyzed: codeChunks.length,
    totalFiles: allFiles.length,
  };
};

// ── Prioritize which files to read first ─────────────────────────
const prioritizeFiles = (files) => {
  const priority = [
    'readme', 'package.json', 'index', 'main', 'app',
    'server', 'client', 'config', 'router', 'routes',
    'controller', 'model', 'schema', 'middleware', 'auth',
    'util', 'helper', 'service', 'hook', 'context',
  ];

  return [...files].sort((a, b) => {
    const aName = a.path.toLowerCase();
    const bName = b.path.toLowerCase();

    const aScore = priority.findIndex((p) => aName.includes(p));
    const bScore = priority.findIndex((p) => bName.includes(p));

    if (aScore === -1 && bScore === -1) return 0;
    if (aScore === -1) return 1;
    if (bScore === -1) return -1;
    return aScore - bScore;
  });
};
