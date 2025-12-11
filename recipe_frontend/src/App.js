import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

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

function NavAuthActions() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  if (token) {
    return (
      <>
        {' | '}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          aria-label="Log out"
        >
          Logout
        </button>
      </>
    );
  }
  return (
    <>
      {' | '}
      <Link className="App-link" to="/login">Login</Link>
      {' | '}
      <Link className="App-link" to="/register">Register</Link>
    </>
  );
}

// PUBLIC_INTERFACE
function AppShell() {
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
          <NavAuthActions />
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
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Root App component with AuthProvider so that routes can access auth state.
   */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
