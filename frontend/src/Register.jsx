import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
function Register() {
  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <Navbar/>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-yellow-400">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Your email address"
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Confirm your password"
              autoComplete="new-password"
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
