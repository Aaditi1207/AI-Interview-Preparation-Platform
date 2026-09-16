export default function StatsCard({ label, value, accent = 'primary' }) {
  const accentClasses = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accentClasses[accent] || accentClasses.primary}`}>
        {value}
      </p>
    </div>
  );
}
