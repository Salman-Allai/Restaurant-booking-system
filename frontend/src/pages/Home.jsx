import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const features = [
  { num: '01', title: 'Pick Your Moment', desc: 'Choose any date and time. Real-time availability so you always get the slot you want.' },
  { num: '02', title: 'Choose Your Setting', desc: 'Indoor, outdoor, or private dining room. Every table configured for your comfort.' },
  { num: '03', title: 'Instant Confirmation', desc: 'Booking confirmed immediately. Manage, track, or cancel anytime from your dashboard.' },
];

function Home() {
  const { user } = useAuth();

  return (
    <div style={s.page}>

      <div style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.badge}>
            <span style={s.badgeDot} />
            Fine Dining Reservations
          </div>
          <h1 style={s.title}>
            The smartest way to<br />
            <span style={s.titleAccent}>reserve your table</span>
          </h1>
          <p style={s.subtitle}>
            Effortless bookings, real-time availability, and instant confirmation —
            all in one elegant platform built for modern dining.
          </p>
          <div style={s.actions}>
            <Link to={user ? '/book' : '/register'} style={s.primaryBtn}>
              {user ? 'Book a Table' : 'Get Started'}
            </Link>
            {!user && <Link to="/login" style={s.ghostBtn}>Sign In</Link>}
          </div>
          <div className="hero-stats" style={s.statsRow}>
            {[['500+', 'Reservations'], ['5', 'Table Types'], ['100%', 'Online']].map(([val, label]) => (
              <div key={label} style={s.stat}>
                <span style={s.statVal}>{val}</span>
                <span style={s.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.features}>
        <div style={s.sectionHeader}>
          <p style={s.sectionEyebrow}>How it works</p>
          <h2 style={s.sectionTitle}>Three steps to your perfect table</h2>
        </div>
        <div style={s.featuresGrid}>
          {features.map((f) => (
            <div key={f.num} style={s.featureCard}>
              <span style={s.featureNum}>{f.num}</span>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={s.ctaSection}>
        <div className="cta-card" style={s.ctaCard}>
          <div style={s.ctaGlow} />
          <h2 style={s.ctaTitle}>Ready to make a reservation?</h2>
          <p style={s.ctaDesc}>Join hundreds of guests who book their tables online every week.</p>
          <Link to={user ? '/book' : '/register'} style={s.primaryBtn}>
            Reserve Your Table →
          </Link>
        </div>
      </div>

    </div>
  );
}

const s = {
  page: { background: '#0a0f1e', minHeight: '100vh' },

  hero: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    padding: 'clamp(5rem, 10vw, 7rem) clamp(1.5rem, 5vw, 4rem) 4rem',
    position: 'relative', overflow: 'hidden',
  },

  heroBg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'url(/hero-restaurant.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },

  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(105deg, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.8) 60%, rgba(10,15,30,0.5) 100%)',
  },

  heroContent: {
    maxWidth: '600px',
    position: 'relative', zIndex: 2,
    width: '100%',
  },

  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(201,168,76,0.12)',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#e8c97a',
    padding: '0.4rem 1rem', borderRadius: '20px',
    fontSize: '0.78rem', fontWeight: '500', letterSpacing: '0.06em',
    marginBottom: '1.5rem',
  },

  badgeDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#c9a84c', flexShrink: 0,
  },

  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.8rem)',
    fontWeight: '700', color: '#ffffff',
    lineHeight: '1.12', marginBottom: '1.25rem',
  },

  titleAccent: {
    background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },

  subtitle: {
    color: 'rgba(232,237,248,0.7)',
    fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', lineHeight: '1.75',
    marginBottom: '2rem', maxWidth: '460px',
  },

  actions: { display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' },

  primaryBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
    color: '#0a0f1e', padding: '0.9rem 2.2rem', borderRadius: '10px',
    fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 8px 24px rgba(201,168,76,0.35)',
    border: 'none', cursor: 'pointer',
  },

  ghostBtn: {
    color: '#e8edf8', border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.9rem 2.2rem', borderRadius: '10px', fontSize: '0.95rem',
    textDecoration: 'none', display: 'inline-block',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px)',
  },

  statsRow: {
    display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },

  stat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },

  statVal: {
    fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
    fontWeight: '700', color: '#c9a84c',
  },

  statLabel: { color: 'rgba(232,237,248,0.5)', fontSize: '0.8rem' },

  features: {
    padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
    maxWidth: '1200px', margin: '0 auto',
  },

  sectionHeader: { marginBottom: '3rem' },

  sectionEyebrow: {
    color: '#c9a84c', fontSize: '0.78rem', fontWeight: '500',
    letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem',
  },

  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
    fontWeight: '700', color: '#ffffff',
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
  },

  featureCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.1)',
    borderRadius: '16px', padding: 'clamp(1.5rem, 3vw, 2.5rem)',
  },

  featureNum: {
    fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', fontWeight: '700',
    color: '#c9a84c', letterSpacing: '0.15em',
    display: 'block', marginBottom: '1.25rem',
  },

  featureTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: '1.1rem',
    color: '#ffffff', fontWeight: '600', marginBottom: '0.75rem',
  },

  featureDesc: { color: '#6b7a9e', lineHeight: '1.7', fontSize: '0.93rem' },

  ctaSection: {
    padding: 'clamp(0rem, 2vw, 0rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 6rem)',
  },

  ctaCard: {
    background: 'rgba(201,168,76,0.05)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '24px', padding: 'clamp(2rem, 5vw, 4rem)',
    textAlign: 'center', position: 'relative', overflow: 'hidden',
  },

  ctaGlow: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '400px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  ctaTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: '700', color: '#ffffff',
    marginBottom: '1rem', position: 'relative',
  },

  ctaDesc: {
    color: '#6b7a9e', fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    marginBottom: '2rem', position: 'relative',
  },
};

export default Home;