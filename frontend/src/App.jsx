import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerInfoFetcher from './PlayerInfoFetcher';
import SignIn from './SignIn';
import Register from './Register';
import Dashboard from './dashboard';
import Navbar from './Navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/current_user', { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  function logout() {
    fetch('/api/logout', { method: 'POST', credentials: 'include' })
      .then(() => setUser(null));
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PlayerInfoFetcher user={user} />} />
        <Route path="/signin" element={<SignIn setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} logout={logout} />} />
      </Routes>
    </Router>
  );
}

export default App;
