import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const statusConfig = {
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  confirmed: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch { console.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    try { await api.patch('/bookings/' + id + '/cancel'); fetchBookings(); }
    catch (err) { alert(err.response?.data?.message || 'Cannot cancel'); }
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.container}>
        <div style={s.header}>
          <p style={s.eyebrow}>Your Account</p>
          <h1 style={s.title}>My Reservations</h1>
          <p style={s.count}>{bookings.length} reservation{bookings.length !== 1 ? 's' : ''}</p>
        </div>

        {loading && <p style={s.muted}>Loading your reservations...</p>}

        {!loading && bookings.length === 0 && (
          <div style={s.empty}>
            <span style={s.emptyIcon}>✦</span>
            <h3 style={s.emptyTitle}>No reservations yet</h3>
            <p style={s.muted}>Your bookings will appear here once made.</p>
          </div>
        )}

        <div style={s.list}>
          {bookings.map((b) => {
            const sc = statusConfig[b.status] || statusConfig.pending;
            const dateObj = new Date(b.date);
            return (
              <div key={b._id} style={s.card}>
                <div style={s.dateBox}>
                  <span style={s.dateDay}>{String(dateObj.getDate() + 1).padStart(2, '0')}</span>
                  <span style={s.dateMon}>{dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardRow}>
                    <h3 style={s.tableTitle}>Table {b.table?.tableNumber}</h3>
                    <span style={{ ...s.badge, color: sc.color, background: sc.bg, border: '1px solid ' + sc.border }}>
                      {b.status}
                    </span>
                  </div>
                  <p style={s.detail}>{b.timeSlot} · {b.guests} guests · <span style={{ textTransform: 'capitalize' }}>{b.table?.location}</span></p>
                  {b.specialRequest && <p style={s.request}>"{b.specialRequest}"</p>}
                </div>
                {b.status === 'pending' && (
                  <button style={s.cancelBtn} onClick={() => cancelBooking(b._id)}>Cancel</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#0a0f1e', minHeight: '100vh', padding: '100px 2rem 4rem', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none' },
  container: { maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 2 },
  header: { marginBottom: '2.5rem' },
  eyebrow: { color: '#c9a84c', fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem' },
  count: { color: '#6b7a9e', fontSize: '0.9rem' },
  muted: { color: '#6b7a9e' },
  empty: { textAlign: 'center', padding: '4rem 0' },
  emptyIcon: { color: 'rgba(201,168,76,0.3)', fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  emptyTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: 'rgba(15,21,32,0.9)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '16px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', backdropFilter: 'blur(10px)' },
  dateBox: { background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', textAlign: 'center', minWidth: '58px', flexShrink: 0 },
  dateDay: { display: 'block', fontFamily: "'Syne', sans-serif", fontSize: '1.7rem', fontWeight: '700', color: '#c9a84c', lineHeight: 1 },
  dateMon: { display: 'block', fontSize: '0.65rem', color: '#6b7a9e', letterSpacing: '0.1em', marginTop: '0.25rem' },
  cardBody: { flex: 1 },
  cardRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' },
  tableTitle: { color: '#ffffff', fontWeight: '600', fontSize: '1rem' },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500' },
  detail: { color: '#6b7a9e', fontSize: '0.88rem' },
  request: { color: '#6b7a9e', fontSize: '0.84rem', fontStyle: 'italic', marginTop: '0.3rem' },
  cancelBtn: { flexShrink: 0, background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.4rem 0.9rem', fontSize: '0.82rem', cursor: 'pointer' },
};

export default MyBookings;