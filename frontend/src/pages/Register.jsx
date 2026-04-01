import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axiosInstance';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data); navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        <div style={s.header}>
          <span style={s.icon}>✦</span>
          <h1 style={s.title}>Create account</h1>
          <p style={s.subtitle}>Start booking tables in seconds</p>
        </div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Full name</label>
            <input name="name" placeholder="Your full name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c9a84c' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(5rem, 12vw, 2rem) clamp(1rem, 5vw, 2rem)',
    background: '#0a0f1e',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 2,
    background: 'rgba(15,21,32,0.9)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '20px',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
  },
  header: { textAlign: 'center', marginBottom: '1.75rem' },
  icon: {
    color: '#c9a84c',
    fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
    display: 'block',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.4rem, 5vw, 1.9rem)',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.4rem',
  },
  subtitle: { color: '#6b7a9e', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' },
  error: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.88rem',
    marginBottom: '1.25rem',
    textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: {
    color: '#6b7a9e',
    fontSize: '0.8rem',
    fontWeight: '500',
    letterSpacing: '0.04em',
  },
  btn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
    color: '#0a0f1e',
    border: 'none',
    borderRadius: '10px',
    padding: 'clamp(0.8rem, 2vw, 0.95rem)',
    fontSize: 'clamp(0.88rem, 2vw, 0.95rem)',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.25rem',
    boxShadow: '0 8px 24px rgba(201,168,76,0.25)',
    letterSpacing: '0.03em',
    width: '100%',
  },
  footer: {
    color: '#6b7a9e',
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: 'clamp(0.82rem, 2vw, 0.88rem)',
  },
};

export default Register;