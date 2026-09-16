export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start justify-between gap-3">
      <span className="text-sm">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 font-bold leading-none"
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
    </div>
  );
}
