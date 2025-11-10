import { useState } from 'react';
import { USER } from '../data/user';

// LoginPage Component
export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate credentials against USER data
    if (username === USER.username && password === USER.password) {
      onLogin(USER.name);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#703923] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to ShelfMate</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#703923] focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#703923] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-[#703923] text-white py-3 px-5 rounded-lg text-base font-semibold hover:opacity-90 active:scale-95 transition-all mt-6"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <button type="button" className="text-[#703923] text-sm font-medium hover:underline">
              Forgot Password?
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button type="button" className="text-[#703923] font-medium hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}