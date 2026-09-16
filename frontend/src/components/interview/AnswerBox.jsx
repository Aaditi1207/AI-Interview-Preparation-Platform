export default function AnswerBox({ value, onChange, disabled }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={8}
      placeholder="Type your answer here..."
      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
    />
  );
}
