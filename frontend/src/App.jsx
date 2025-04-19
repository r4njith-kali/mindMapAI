import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MindMap from './pages/MindMap';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mindmap" element={<MindMap />} />
    </Routes>
  </Router>
);

export default App;
