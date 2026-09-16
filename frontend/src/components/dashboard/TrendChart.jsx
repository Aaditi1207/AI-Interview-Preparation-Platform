import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TrendChart({ trend }) {
  const data = (trend || []).map((point, idx) => ({
    name: `#${idx + 1}`,
    score: point.score,
    date: point.date,
  }));

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No interview trend data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ''} />
        <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
