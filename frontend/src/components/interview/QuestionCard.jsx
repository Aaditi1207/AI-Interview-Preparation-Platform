export default function QuestionCard({ index, total, question }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-primary-600 uppercase tracking-wide">
        Question {index + 1} of {total}
      </p>
      <h2 className="text-lg font-semibold text-gray-900 mt-1">{question}</h2>
    </div>
  );
}
