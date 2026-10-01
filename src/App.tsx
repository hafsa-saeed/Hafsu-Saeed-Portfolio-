import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { PublicPortfolio } from "./components/PublicPortfolio";
import { LoginPage } from "./admin/LoginPage";
import { AdminLayout } from "./admin/AdminLayout";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { DashboardPage } from "./admin/DashboardPage";
import { ProjectsManager } from "./admin/ProjectsManager";
import { CredentialsManager } from "./admin/CredentialsManager";
import { EducationManager } from "./admin/EducationManager";
import { ExperienceManager } from "./admin/ExperienceManager";
import { SkillsManager } from "./admin/SkillsManager";
import { DocumentsManager } from "./admin/DocumentsManager";
import { ProfileManager } from "./admin/ProfileManager";
import { MessagesManager } from "./admin/MessagesManager";

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio - Preserves 100% of existing UI & animations */}
            <Route path="/" element={<PublicPortfolio />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Private Admin CMS - Supabase Auth Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="credentials" element={<CredentialsManager />} />
                <Route path="education" element={<EducationManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="documents" element={<DocumentsManager />} />
                <Route path="profile" element={<ProfileManager />} />
                <Route path="messages" element={<MessagesManager />} />
              </Route>
            </Route>

            {/* Fallback to Public Homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}
