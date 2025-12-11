import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Routes,
  Route,
  Link,
} from 'react-router-dom';

// Simple placeholders for routes
function Home() {
  return (
    <div>
      <h1 className="title">Recipe Hub</h1>
      <p className="description">Browse and search recipes.</p>
    </div>
  );
}

function Favorites() {
  return <h2 className="title">Favorites</h2>;
}

function Profile() {
  return <h2 className="title">Profile</h2>;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header" role="banner">
        <nav className="navbar" aria-label="Main">
          <Link className="App-link" to="/">Home</Link>{' | '}
          <Link className="App-link" to="/favorites">Favorites</Link>{' | '}
          <Link className="App-link" to="/profile">Profile</Link>
        </nav>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main role="main" className="container" style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
