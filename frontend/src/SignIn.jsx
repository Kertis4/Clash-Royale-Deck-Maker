import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <Navbar/>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-yellow-400">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Sign In</h2>
        <form>
          <div className="mb-4">
            <label className="block text-yellow-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-md text-yellow-300 placeholder-yellow-300"
              placeholder="Enter your password"
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
