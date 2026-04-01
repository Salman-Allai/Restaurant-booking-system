import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState, useEffect } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => setMenuOpen(false), 0);
  return () => clearTimeout(timer);
}, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        ...s.nav,
        background: scrolled || menuOpen ? 'rgba(10,15,30,0.97)' : 'rgba(10,15,30,0.3)',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        backdropFilter: 'blur(20px)',
      }}>
        <Link to="/" style={s.brand}>
          <span style={{ color: '#c9a84c' }}>✦</span>
          <span style={s.brandText}>RestaurantBook</span>
        </Link>

        <div className="nav-desktop" style={s.links}>
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

        <button
          className="nav-hamburger"
          style={s.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{ ...s.bar, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...s.bar, opacity: menuOpen ? 0 : 1, margin: '4px 0' }} />
          <span style={{ ...s.bar, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu" style={s.mobileMenu}>
          {!user && (
            <>
              <Link to="/login" style={s.mobileLink}>Sign In</Link>
              <Link to="/register" style={s.mobileCta}>Reserve Now</Link>
            </>
          )}
          {user && (
            <>
              <div style={s.mobileUser}>
                <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                <div>
                  <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500' }}>{user.name}</p>
                  <p style={{ color: '#6b7a9e', fontSize: '0.8rem' }}>{user.role}</p>
                </div>
              </div>
              <Link to="/book" style={s.mobileLink}>Book Table</Link>
              <Link to="/my-bookings" style={s.mobileLink}>My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={s.mobileLink}>Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} style={s.mobileLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

const s = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', transition: 'all 0.4s ease',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' },
  brandText: { color: '#ffffff', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.04em', fontFamily: "'Syne', sans-serif" },
  links: { display: 'flex', gap: '0.2rem', alignItems: 'center' },
  link: { color: 'rgba(232,237,248,0.6)', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.88rem', textDecoration: 'none', transition: 'all 0.2s ease' },
  activeLink: { color: '#c9a84c', background: 'rgba(201,168,76,0.08)' },
  ctaBtn: { background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', color: '#0a0f1e', padding: '0.5rem 1.3rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', textDecoration: 'none', marginLeft: '0.5rem', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' },
  userChip: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '20px', padding: '0.3rem 0.8rem 0.3rem 0.4rem', marginLeft: '0.5rem' },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#0a0f1e', flexShrink: 0 },
  userName: { color: '#e8edf8', fontSize: '0.85rem' },
  logoutBtn: { background: 'transparent', color: 'rgba(232,237,248,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.88rem' },
  hamburger: { flexDirection: 'column', background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer' },
  bar: { display: 'block', width: '22px', height: '2px', background: '#ffffff', borderRadius: '2px', transition: 'all 0.3s ease' },
  mobileMenu: {
    position: 'fixed', top: '62px', left: 0, right: 0, zIndex: 99,
    background: 'rgba(10,15,30,0.98)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(201,168,76,0.15)',
    padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem',
  },
  mobileUser: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '12px', marginBottom: '0.25rem' },
  mobileLink: { color: 'rgba(232,237,248,0.85)', padding: '0.9rem 1rem', borderRadius: '10px', fontSize: '0.95rem', textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },
  mobileCta: { background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', color: '#0a0f1e', padding: '0.9rem 1rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none', display: 'block', textAlign: 'center' },
  mobileLogout: { background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.9rem 1rem', fontSize: '0.95rem', textAlign: 'left', marginTop: '0.25rem' },
};

export default Navbar;