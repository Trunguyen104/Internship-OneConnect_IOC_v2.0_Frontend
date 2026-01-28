import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const primaryColor = '#c53030';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setError('');
    setSuccess(true);

    // call API forgot password ở đây
    // POST /auth/forgot-password
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65%)`,
      }}
    >
      <div className="w-full max-w-[420px] px-6">
        <img src="https://iocv2.rikkei.edu.vn/logo.svg" className="mx-auto mb-6 w-[180px]" alt="" />

        <h1 className="text-center font-bold text-4xl mb-4">Forgot Password</h1>

        <p className="text-center text-gray-500 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Reset link has been sent to your email.</p>

            <button
              onClick={() => navigate('/login')}
              className="font-semibold hover:underline"
              style={{ color: primaryColor }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-left">
                Email address <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className={`w-full px-3 py-2 rounded-xl border
                  ${error ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full h-[46px] rounded-xl text-white font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              Send Reset Link
            </button>

            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="hover:underline"
                style={{ color: primaryColor }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
