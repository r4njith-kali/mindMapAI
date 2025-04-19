import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MindMap from './MindMap';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mindmap" element={<MindMap />} />
    </Routes>
  </Router>
);

export default App;
