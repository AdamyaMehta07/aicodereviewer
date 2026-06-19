import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import LandingPage from './pages/public/LandingPage.jsx';
import FeaturesPage from './pages/public/FeaturesPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';

import DashboardPage from './pages/protected/DashboardPage.jsx';
import SubmitProjectPage from './pages/protected/SubmitProjectPage.jsx';
import MyProjectsPage from './pages/protected/MyProjectsPage.jsx';
import ProjectDetailsPage from './pages/protected/ProjectDetailsPage.jsx';
import PortfolioBuilderPage from './pages/protected/PortfolioBuilderPage.jsx';
import ProfilePage from './pages/protected/ProfilePage.jsx';
import SettingsPage from './pages/protected/SettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Route>

      {/* Auth routes (no navbar/footer shell) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submit-project" element={<SubmitProjectPage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailsPage />} />
          <Route path="/portfolio-builder" element={<PortfolioBuilderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
