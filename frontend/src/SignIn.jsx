import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        // Store player name or tag if returned
        localStorage.setItem('user', JSON.stringify(data)); // { email, username, tag, etc }
        navigate('/dashboard'); // redirect after login
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <Navbar />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-yellow-400">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Sign In</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-md transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-yellow-300">
          Don’t have an account?{' '}
          <Link to="/Register" className="underline hover:text-yellow-500 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
