import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';

export default function RegisterPage() {
  const [step, setStep] = useState('register'); // 'register' | 'confirm'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, confirmRegistration } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      setStep('confirm');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmRegistration(email, code);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Confirmation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        {step === 'register' ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500 mb-6">Start practicing technical interviews with AI.</p>

            {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-400 mt-1">Min 8 characters, upper + lowercase + number.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
            <p className="text-sm text-gray-500 mb-6">Enter the code we sent to {email}.</p>

            {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError('')} /></div>}

            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
