import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user }) {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="w-full p-4 border-b border-yellow-400 text-yellow-300 bg-gray-900">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link to="/" className="text-yellow-400 text-xl font-bold">
            Clash Deck Builder
          </Link>
          {user && user.name ? (
            <Link
              to="/dashboard"
              className="text-yellow-300 hover:text-yellow-500 text-sm font-medium"
            >
              {user.name}'s Dashboard
            </Link>
          ) : (
            <Link
              to="/signin"
              className="text-yellow-300 hover:text-yellow-500 text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
