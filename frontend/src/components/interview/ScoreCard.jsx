export default function ScoreCard({ evaluation }) {
  const scoreColor =
    evaluation.score >= 8 ? 'text-green-600' : evaluation.score >= 5 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-gray-900">{evaluation.question}</h3>
        <span className={`text-2xl font-bold shrink-0 ${scoreColor}`}>{evaluation.score}/10</span>
      </div>

      {evaluation.answer && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-400 uppercase">Your Answer</p>
          <p className="text-sm text-gray-700 mt-1">{evaluation.answer}</p>
        </div>
      )}

      <div className="mt-3">
        <p className="text-xs font-medium text-gray-400 uppercase">Feedback</p>
        <p className="text-sm text-gray-700 mt-1">{evaluation.feedback}</p>
      </div>

      {evaluation.ideal_answer && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-400 uppercase">Ideal Answer</p>
          <p className="text-sm text-gray-700 mt-1">{evaluation.ideal_answer}</p>
        </div>
      )}

      {evaluation.improvements && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-400 uppercase">Improvements</p>
          <p className="text-sm text-gray-700 mt-1">{evaluation.improvements}</p>
        </div>
      )}
    </div>
  );
}
