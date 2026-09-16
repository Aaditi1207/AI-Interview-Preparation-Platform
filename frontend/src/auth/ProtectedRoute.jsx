import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
