import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AuthBar from './components/AuthBar';
import MapPage from './pages/MapPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', background: '#111827', color: 'white', zIndex: 1000 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>Norigerion the Move</Link>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Map</Link>
            <AuthBar />
          </div>
        </nav>
        <div style={{ paddingTop: 56 }}>
          <Routes>
            <Route path="/" element={<MapPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
