import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="w-full p-4 border-b border-yellow-400 text-yellow-300">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <Link to="/" className="text-yellow-400 text-xl font-bold">
          Clash Deck Builder
        </Link>
        <Link to="/signin" className="text-yellow-300 hover:text-yellow-500 text-sm font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
