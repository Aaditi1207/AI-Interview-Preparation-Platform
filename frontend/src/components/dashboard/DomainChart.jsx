import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DomainChart({ domainPerformance }) {
  const data = Object.entries(domainPerformance || {}).map(([domain, stats]) => ({
    domain,
    averageScore: stats.average_score,
    interviews: stats.interviews,
  }));

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No domain data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="averageScore" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
