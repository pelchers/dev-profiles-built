import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Styles from './pages/Styles';
import Boilerplates from './pages/Boilerplates';

const App = () => (
  <div className="overflow-hidden">
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/styles" element={<Styles />} />
        <Route path="/boilerplates" element={<Boilerplates />} />
      </Routes>
    </MainLayout>
  </div>
);

export default App; 