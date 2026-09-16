export default function LoadingSpinner({ fullScreen = false, label = 'Loading...' }) {
  const wrapperClass = fullScreen
    ? 'flex items-center justify-center min-h-screen'
    : 'flex items-center justify-center py-8';

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
