import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Portfolio from './Portfolio';
import AdminApp from './Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}