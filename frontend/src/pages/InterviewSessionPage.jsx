import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import QuestionCard from '../components/interview/QuestionCard.jsx';
import AnswerBox from '../components/interview/AnswerBox.jsx';
import { evaluateAnswers, saveResults } from '../api/interviewApi.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function InterviewSessionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { domain, difficulty, questions } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions?.length || 0).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!questions || questions.length === 0) {
    return (
      <div>
        <Navbar />
        <main className="max-w-lg mx-auto px-6 py-10 text-center">
          <ErrorAlert message="No active interview session found." />
          <button
            onClick={() => navigate('/start-interview')}
            className="mt-4 text-primary-600 font-medium text-sm"
          >
            Start a new interview
          </button>
        </main>
      </div>
    );
  }

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const qaPairs = questions.map((q, i) => ({ question: q, answer: answers[i] || '' }));
      const evalResult = await evaluateAnswers(domain, difficulty, qaPairs);

      const saveResult = await saveResults({
        domain,
        difficulty,
        questions,
        answers,
        score: evalResult.average_score,
        feedback: { evaluations: evalResult.evaluations },
        email: user?.email,
      });

      navigate('/results', {
        state: {
          domain,
          difficulty,
          average_score: evalResult.average_score,
          evaluations: evalResult.evaluations,
          interview_id: saveResult.interview_id,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-4">
          <p className="text-xs text-gray-400">{domain} · {difficulty}</p>
        </div>

        {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}

        {submitting ? (
          <LoadingSpinner label="Evaluating your answers..." />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <QuestionCard index={currentIndex} total={questions.length} question={questions[currentIndex]} />
            <AnswerBox value={answers[currentIndex]} onChange={handleAnswerChange} disabled={submitting} />

            <div className="flex items-center justify-between mt-5">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="text-sm text-gray-500 disabled:opacity-30"
              >
                ← Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2 rounded-lg"
                >
                  Submit Interview
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2 rounded-lg"
                >
                  Next →
                </button>
              )}
            </div>

            <div className="flex gap-1 mt-5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= currentIndex ? 'bg-primary-600' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
