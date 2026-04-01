import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState, useEffect } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      ...s.nav,
      background: scrolled ? 'rgba(10,15,30,0.97)' : 'rgba(10,15,30,0.3)',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
      backdropFilter: 'blur(20px)',
    }}>
      <Link to="/" style={s.brand}>
        <div style={s.brandIcon}>✦</div>
        <span style={s.brandText}>RestaurantBook</span>
      </Link>
      <div style={s.links}>
        {!user && (
          <>
            <Link to="/login" style={{ ...s.link, ...(isActive('/login') ? s.activeLink : {}) }}>Sign In</Link>
            <Link to="/register" style={s.ctaBtn}>Reserve Now</Link>
          </>
        )}
        {user && (
          <>
            <Link to="/book" style={{ ...s.link, ...(isActive('/book') ? s.activeLink : {}) }}>Book Table</Link>
            <Link to="/my-bookings" style={{ ...s.link, ...(isActive('/my-bookings') ? s.activeLink : {}) }}>My Bookings</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...s.link, ...(isActive('/admin') ? s.activeLink : {}) }}>Admin</Link>
            )}
            <div style={s.userChip}>
              <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
              <span style={s.userName}>{user.name?.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.1rem 3rem', transition: 'all 0.4s ease',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' },
  brandIcon: { color: '#c9a84c', fontSize: '1rem' },
  brandText: {
    color: '#ffffff', fontSize: '1rem', fontWeight: '600',
    letterSpacing: '0.04em', fontFamily: "'Syne', sans-serif",
  },
  links: { display: 'flex', gap: '0.2rem', alignItems: 'center' },
  link: {
    color: 'rgba(232,237,248,0.6)', padding: '0.45rem 0.9rem', borderRadius: '8px',
    fontSize: '0.88rem', fontWeight: '400', textDecoration: 'none', transition: 'all 0.2s ease',
  },
  activeLink: { color: '#c9a84c', background: 'rgba(201,168,76,0.08)' },
  ctaBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
    color: '#0a0f1e', padding: '0.5rem 1.3rem', borderRadius: '8px',
    fontSize: '0.88rem', fontWeight: '600', textDecoration: 'none', marginLeft: '0.5rem',
    boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '20px', padding: '0.3rem 0.8rem 0.3rem 0.4rem', marginLeft: '0.5rem',
  },
  avatar: {
    width: '24px', height: '24px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: '700', color: '#0a0f1e',
  },
  userName: { color: '#e8edf8', fontSize: '0.85rem' },
  logoutBtn: {
    background: 'transparent', color: 'rgba(232,237,248,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.88rem',
  },
};

export default Navbar;