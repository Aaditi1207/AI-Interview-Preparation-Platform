import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { getHistory } from '../api/historyApi.js';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let mounted = true;
    getHistory(100)
      .then((res) => mounted && setHistory(res.recent_interviews || []))
      .catch((err) => mounted && setError(err.response?.data?.error || 'Failed to load history.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview History</h1>

        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}

        {loading ? (
          <LoadingSpinner />
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No interviews recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.interview_id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  onClick={() => setExpandedId(expandedId === item.interview_id ? null : item.interview_id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.domain} · {item.difficulty}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-semibold text-primary-600">{item.score}/10</span>
                </button>

                {expandedId === item.interview_id && (
                  <div className="px-5 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    {(item.questions || []).map((q, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium text-gray-700">Q{i + 1}: {q}</p>
                        <p className="text-gray-500 mt-0.5">{item.answers?.[i] || '(no answer)'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
