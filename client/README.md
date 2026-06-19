# AiCodeReviewer — Client (Frontend)

AI Powered Developer Portfolio & Project Reviewer — React + Vite frontend.

## Stack
React 18, Vite, Tailwind CSS, React Router DOM, Axios, TanStack Query, Framer Motion, Recharts, React Hook Form, Zod.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

## Notes on this phase

This phase ships the complete frontend shell: routing, layouts, all public and protected
pages, and reusable UI components (score cards, radar chart, breakdown bars). Pages that
will eventually call the backend (login, register, submit project, profile) currently use
local mock logic so the UI is fully clickable end-to-end. These are clearly marked with
`// Phase X will replace this with...` comments and will be wired to the real API in
Phase 2 (Authentication) and Phase 5/6 (GitHub + AI review pipeline).

## Folder Structure

```
client/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/       Card, ScoreCard
│   │   ├── layout/        Navbar, Footer, Sidebar, Topbar
│   │   └── charts/         RadarChart, ScoreBreakdownList
│   ├── pages/
│   │   ├── public/         Landing, Features, Login, Register, 404
│   │   └── protected/      Dashboard, SubmitProject, MyProjects, ProjectDetails,
│   │                        PortfolioBuilder, Profile, Settings
│   ├── layouts/             PublicLayout, DashboardLayout
│   ├── routes/               ProtectedRoute
│   ├── context/               AuthContext
│   ├── services/               apiClient (Axios instance)
│   ├── utils/                   validationSchemas, mockData
│   └── styles/                   index.css
```
