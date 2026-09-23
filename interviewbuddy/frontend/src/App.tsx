import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CrtHomePage from "./pages/CrtHomePage";
import CrtCategoryPage from "./pages/CrtCategoryPage";
import CrtTopicLearnPage from "./pages/CrtTopicLearnPage";
import CrtPracticePage from "./pages/CrtPracticePage";
import CrtTestAttemptPage from "./pages/CrtTestAttemptPage";
import CrtTestResultPage from "./pages/CrtTestResultPage";
import CodingListPage from "./pages/CodingListPage";
import CodingProblemPage from "./pages/CodingProblemPage";
import MyProgressPage from "./pages/SubmissionsPage";
import InterviewStartPage from "./pages/InterviewStartPage";
import InterviewSessionPage from "./pages/InterviewSessionPage";
import InterviewHistoryPage from "./pages/InterviewHistoryPage";
import InterviewResultPage from "./pages/InterviewResultPage";
import InterviewStreakPage from "./pages/InterviewStreakPage";
import LearningHomePage from "./pages/LearningHomePage";
import LearningCategoryPage from "./pages/LearningCategoryPage";
import LearningResourcePage from "./pages/LearningResourcePage";
import SchedulePage from "./pages/SchedulePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCrtPage from "./pages/admin/AdminCrtPage";
import AdminCodingPage from "./pages/admin/AdminCodingPage";
import AdminInterviewsPage from "./pages/admin/AdminInterviewsPage";
const App: React.FC = () => {
  return (
    <Routes>
      {" "}
      {/* Public */}{" "}
      <Route element={<PublicLayout />}>
        {" "}
        <Route path="/" element={<LandingPage />} />{" "}
      </Route>{" "}
      <Route path="/login" element={<LoginPage />} />{" "}
      <Route path="/register" element={<RegisterPage />} />{" "}
      <Route path="/verify-email" element={<VerifyEmailPage />} />{" "}
      <Route path="/admin/login" element={<AdminLoginPage />} />{" "}
      {/* Authenticated user app */}{" "}
      <Route element={<ProtectedRoute />}>
        {" "}
        <Route element={<AppLayout />}>
          {" "}
          <Route path="/dashboard" element={<DashboardPage />} />{" "}
          <Route path="/profile" element={<ProfilePage />} />{" "}
          <Route path="/crt" element={<CrtHomePage />} />{" "}
          <Route
            path="/crt/categories/:categoryId"
            element={<CrtCategoryPage />}
          />{" "}
          <Route
            path="/crt/topics/:topicId/learn"
            element={<CrtTopicLearnPage />}
          />{" "}
          <Route
            path="/crt/topics/:topicId/practice"
            element={<CrtPracticePage />}
          />{" "}
          <Route
            path="/crt/attempts/:attemptId/take"
            element={<CrtTestAttemptPage />}
          />{" "}
          <Route
            path="/crt/results/:attemptId"
            element={<CrtTestResultPage />}
          />{" "}
          <Route path="/coding" element={<CodingListPage />} />{" "}
          <Route
            path="/coding/problems/:slug"
            element={<CodingProblemPage />}
          />{" "}
          <Route path="/coding/my-progress" element={<MyProgressPage />} />{" "}
          <Route path="/interviews" element={<InterviewStartPage />} />{" "}
          <Route
            path="/interviews/history"
            element={<InterviewHistoryPage />}
          />{" "}
          <Route
            path="/interviews/:sessionId"
            element={<InterviewSessionPage />}
          />{" "}
          <Route
            path="/interviews/:sessionId/result"
            element={<InterviewResultPage />}
          />{" "}
          <Route
            path="/interview-streak"
            element={<InterviewStreakPage />}
          />{" "}
          <Route path="/learning" element={<LearningHomePage />} />{" "}
          <Route
            path="/learning/categories/:categoryId"
            element={<LearningCategoryPage />}
          />{" "}
          <Route
            path="/learning/resources/:resourceId"
            element={<LearningResourcePage />}
          />{" "}
          <Route path="/schedule" element={<SchedulePage />} />{" "}
        </Route>{" "}
      </Route>{" "}
      {/* Admin app */}{" "}
      <Route element={<ProtectedRoute adminOnly />}>
        {" "}
        <Route element={<AdminLayout />}>
          {" "}
          <Route path="/admin" element={<AdminDashboardPage />} />{" "}
          <Route path="/admin/users" element={<AdminUsersPage />} />{" "}
          <Route path="/admin/crt" element={<AdminCrtPage />} />{" "}
          <Route path="/admin/coding" element={<AdminCodingPage />} />{" "}
          <Route path="/admin/interviews" element={<AdminInterviewsPage />} />{" "}
        </Route>{" "}
      </Route>{" "}
      <Route path="*" element={<NotFoundPage />} />{" "}
    </Routes>
  );
};
export default App;
