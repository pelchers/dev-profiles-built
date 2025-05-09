import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Styles from './pages/Styles';

const App = () => (
  <div className="overflow-hidden">
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/styles" element={<Styles />} />
      </Routes>
    </MainLayout>
  </div>
);

export default App; 