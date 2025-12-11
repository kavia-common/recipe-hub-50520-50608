import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login page for existing users.
 * Submits email/password to backend via AuthContext.login, handles errors, and redirects on success.
 */

// PUBLIC_INTERFACE
export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Login failed');
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, margin: '3rem auto', textAlign: 'left' }}>
      <h1 className="title" style={{ textAlign: 'center' }}>Sign in</h1>
      <p className="description" style={{ textAlign: 'center' }}>
        Welcome back! Please enter your credentials.
      </p>

      {error && (
        <div
          role="alert"
          style={{
            background: '#FEE2E2',
            color: '#B91C1C',
            border: '1px solid #FCA5A5',
            padding: '10px 12px',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} aria-label="Login form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={inputStyle}
          autoComplete="username"
        />

        <label htmlFor="password" style={{ marginTop: 12 }}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your secure password"
          style={inputStyle}
          autoComplete="current-password"
        />

        <button
          className="theme-toggle"
          type="submit"
          disabled={loading}
          style={{ width: '100%', marginTop: 16 }}
          aria-busy={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid var(--border-color)',
  marginTop: 6,
  boxSizing: 'border-box',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
};
