import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import StartInterviewPage from '../pages/StartInterviewPage.jsx';
import InterviewSessionPage from '../pages/InterviewSessionPage.jsx';
import ResultsPage from '../pages/ResultsPage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/start-interview"
        element={<ProtectedRoute><StartInterviewPage /></ProtectedRoute>}
      />
      <Route
        path="/interview-session"
        element={<ProtectedRoute><InterviewSessionPage /></ProtectedRoute>}
      />
      <Route
        path="/results"
        element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}
      />
      <Route
        path="/history"
        element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
