export const mockProjects = [
  {
    id: 'p1',
    title: 'Realtime Chat Engine',
    description: 'WebSocket-based chat app with rooms, typing indicators, and presence.',
    githubUrl: 'https://github.com/adamyamehta/realtime-chat',
    techStack: ['Node.js', 'Socket.io', 'React', 'Redis'],
    category: 'Full Stack',
    overallScore: 86,
    createdAt: '2026-05-02',
  },
  {
    id: 'p2',
    title: 'E-commerce Inventory API',
    description: 'REST API for inventory and order management with role-based access.',
    githubUrl: 'https://github.com/adamyamehta/inventory-api',
    techStack: ['Express', 'MongoDB', 'JWT'],
    category: 'Backend',
    overallScore: 72,
    createdAt: '2026-04-18',
  },
  {
    id: 'p3',
    title: 'Weather Dashboard',
    description: 'React dashboard visualizing weather trends with charting and geolocation.',
    githubUrl: 'https://github.com/adamyamehta/weather-dashboard',
    techStack: ['React', 'Recharts', 'OpenWeather API'],
    category: 'Frontend',
    overallScore: 64,
    createdAt: '2026-03-29',
  },
];

export const mockReview = {
  projectId: 'p1',
  overallScore: 86,
  scores: [
    { category: 'Code Quality', score: 88 },
    { category: 'Architecture', score: 82 },
    { category: 'Security', score: 74 },
    { category: 'Performance', score: 91 },
    { category: 'Maintainability', score: 85 },
    { category: 'Scalability', score: 79 },
    { category: 'Documentation', score: 68 },
    { category: 'Testing Coverage', score: 60 },
  ],
  strengths: [
    'Clean separation between socket event handlers and business logic.',
    'Efficient use of Redis for presence tracking reduces database load.',
    'Consistent naming conventions across the codebase.',
  ],
  weaknesses: [
    'No automated tests covering socket reconnection edge cases.',
    'README lacks setup instructions for Redis configuration.',
    'A few large files mix UI rendering with data-fetching logic.',
  ],
  recommendations: [
    'Add integration tests for reconnect and message-ordering scenarios.',
    'Extract data-fetching hooks out of large component files.',
    'Document environment variables and local Redis setup in the README.',
  ],
  recruiterFeedback:
    'This project demonstrates solid real-time systems thinking and reasonable production awareness. A recruiter reviewing this would likely view it as strong evidence of backend and systems skills, though the lack of visible tests may raise questions about production readiness.',
  portfolioFeedback:
    'Frame this project around the real-time architecture decisions: why WebSockets over polling, how presence state is kept consistent, and what tradeoffs were made for scale. That story differentiates it more than the feature list alone.',
  aiSummary:
    'Built a real-time chat engine supporting multi-room messaging, typing indicators, and presence tracking using Node.js, Socket.io, and Redis, with a React front end.',
};
