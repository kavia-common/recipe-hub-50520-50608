import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Registration page for new users.
 * Submits name/email/password to backend via AuthContext.register, handles errors, and redirects on success.
 */

// PUBLIC_INTERFACE
export default function Register() {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Registration failed');
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, margin: '3rem auto', textAlign: 'left' }}>
      <h1 className="title" style={{ textAlign: 'center' }}>Create account</h1>
      <p className="description" style={{ textAlign: 'center' }}>
        Join Recipe Hub to save favorites and add notes.
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

      <form onSubmit={handleSubmit} aria-label="Register form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          style={inputStyle}
          autoComplete="name"
        />

        <label htmlFor="email" style={{ marginTop: 12 }}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={inputStyle}
          autoComplete="email"
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
          placeholder="Choose a secure password"
          style={inputStyle}
          autoComplete="new-password"
        />

        <button
          className="theme-toggle"
          type="submit"
          disabled={loading}
          style={{ width: '100%', marginTop: 16 }}
          aria-busy={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account? <Link to="/login">Sign in</Link>
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
