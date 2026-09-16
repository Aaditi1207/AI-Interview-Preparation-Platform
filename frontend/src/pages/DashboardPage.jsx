import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import StatsCard from '../components/dashboard/StatsCard.jsx';
import DomainChart from '../components/dashboard/DomainChart.jsx';
import TrendChart from '../components/dashboard/TrendChart.jsx';
import { getHistory } from '../api/historyApi.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getHistory()
      .then((res) => mounted && setData(res))
      .catch((err) => mounted && setError(err.response?.data?.error || 'Failed to load dashboard data.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/start-interview"
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Start New Interview
          </Link>
        </div>

        {error && <div className="mb-6"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatsCard label="Total Interviews" value={data?.total_interviews ?? 0} />
              <StatsCard label="Average Score" value={`${data?.average_score ?? 0}/10`} accent="green" />
              <StatsCard
                label="Domains Practiced"
                value={Object.keys(data?.domain_performance || {}).length}
                accent="amber"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-2">Domain-wise Performance</h2>
                <DomainChart domainPerformance={data?.domain_performance} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-2">Improvement Trend</h2>
                <TrendChart trend={data?.improvement_trend} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Recent Interviews</h2>
                <Link to="/history" className="text-sm text-primary-600 font-medium">View all</Link>
              </div>

              {(data?.recent_interviews || []).length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No interviews yet. Start your first one!</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recent_interviews.map((item) => (
                    <li key={item.interview_id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{item.domain} · {item.difficulty}</p>
                        <p className="text-gray-400 text-xs">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                      <span className="font-semibold text-primary-600">{item.score}/10</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
