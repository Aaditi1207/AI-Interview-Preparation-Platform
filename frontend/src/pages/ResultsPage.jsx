import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import ScoreCard from '../components/interview/ScoreCard.jsx';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { domain, difficulty, average_score, evaluations } = location.state || {};

  if (!evaluations) {
    return (
      <div>
        <Navbar />
        <main className="max-w-lg mx-auto px-6 py-10 text-center">
          <p className="text-gray-500">No results to display.</p>
          <Link to="/dashboard" className="text-primary-600 font-medium text-sm mt-2 inline-block">
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const scoreColor =
    average_score >= 8 ? 'text-green-600' : average_score >= 5 ? 'text-amber-600' : 'text-red-600';

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400">{domain} · {difficulty}</p>
          <h1 className="text-lg font-medium text-gray-700 mt-2">Interview Complete</h1>
          <p className={`text-5xl font-bold mt-2 ${scoreColor}`}>{average_score}/10</p>
        </div>

        <div className="space-y-4">
          {evaluations.map((evaluation, idx) => (
            <ScoreCard key={idx} evaluation={evaluation} />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/start-interview')}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            Start Another Interview
          </button>
          <Link
            to="/dashboard"
            className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
