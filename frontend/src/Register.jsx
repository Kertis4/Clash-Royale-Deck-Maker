import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Register() {
  const [email, setEmail] = useState('');
  const [tag, setTag] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tag }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        console.log('Registered:', data.username);
        navigate('/signin');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <Navbar />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-yellow-400">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Register</h2>
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
              placeholder="Your email address"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="tag">
              Clash Royale Tag
            </label>
            <input
              type="text"
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="e.g. 208Q29LCU0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-md transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-yellow-300">
          Already have an account?{' '}
          <Link to="/signin" className="underline hover:text-yellow-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
