import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { generateQuestions } from '../api/interviewApi.js';

const DOMAINS = ['AWS', 'DevOps', 'Linux', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Azure'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function StartInterviewPage() {
  const [domain, setDomain] = useState('AWS');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await generateQuestions(domain, difficulty, numQuestions);
      navigate('/interview-session', {
        state: { domain, difficulty, questions: result.questions },
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Start a New Interview</h1>
        <p className="text-sm text-gray-500 mb-6">Choose your domain, difficulty, and question count.</p>

        {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}

        <form onSubmit={handleStart} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions: {numQuestions}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Generating questions...' : 'Start Interview'}
          </button>
        </form>
      </main>
    </div>
  );
}
