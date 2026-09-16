import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-lg text-primary-600">
        AI Interview Prep
      </Link>

      {user && (
        <div className="flex items-center gap-6 text-sm">
          <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/start-interview" className="text-gray-600 hover:text-primary-600">
            Start Interview
          </Link>
          <Link to="/history" className="text-gray-600 hover:text-primary-600">
            History
          </Link>
          <span className="text-gray-400">{user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
