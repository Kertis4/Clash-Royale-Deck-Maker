import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerInfoFetcher from './PlayerInfoFetcher';
import SignIn from './SignIn';
import Register from './Register';
import Dashboard from './dashboard';
import Navbar from './Navbar';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
    
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PlayerInfoFetcher user={user}/>} />
        <Route path="/signin" element={<SignIn setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} logout={logout} />} />
      </Routes>
    </Router>
  );
}


export default App;
