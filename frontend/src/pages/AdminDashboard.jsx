import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const statusConfig = {
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  confirmed: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
};

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('bookings');
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '', location: 'indoor', description: '' });

  const fetchAll = async () => {
    try {
      const [b, t] = await Promise.all([api.get('/bookings'), api.get('/tables')]);
      setBookings(b.data); setTables(t.data);
    } catch { console.error('Fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id, status) => {
    try { await api.patch('/bookings/' + id + '/status', { status }); fetchAll(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const createTable = async () => {
    try { await api.post('/tables', newTable); setNewTable({ tableNumber: '', capacity: '', location: 'indoor', description: '' }); fetchAll(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const deleteTable = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try { await api.delete('/tables/' + id); fetchAll(); }
    catch { alert('Delete failed'); }
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { label: 'Active Tables', value: tables.length },
  ];

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.container}>
        <div style={s.header}>
          <p style={s.eyebrow}>Admin Panel</p>
          <h1 style={s.title}>Dashboard</h1>
        </div>

        <div style={s.statsGrid}>
          {stats.map((stat, ) => (
            <div key={stat.label} style={s.statCard}>
              <span style={s.statValue}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
              <div style={s.statAccent} />
            </div>
          ))}
        </div>

        <div style={s.tabsBar}>
          {['bookings', 'tables'].map((t) => (
            <button key={t} style={{ ...s.tabBtn, ...(tab === t ? s.activeTabBtn : {}) }}
              onClick={() => setTab(t)}>
              {t === 'bookings' ? `Bookings (${bookings.length})` : `Tables (${tables.length})`}
            </button>
          ))}
        </div>

        {loading && <p style={s.muted}>Loading...</p>}

        {!loading && tab === 'bookings' && (
          <div style={s.list}>
            {bookings.length === 0 && <p style={s.muted}>No bookings yet.</p>}
            {bookings.map((b) => {
              const sc = statusConfig[b.status] || statusConfig.pending;
              return (
                <div key={b._id} style={s.card}>
                  <div style={s.cardBody}>
                    <div style={s.cardTop}>
                      <div>
                        <p style={s.guestName}>{b.user?.name}</p>
                        <p style={s.guestEmail}>{b.user?.email}</p>
                      </div>
                      <span style={{ ...s.badge, color: sc.color, background: sc.bg, border: '1px solid ' + sc.border }}>
                        {b.status}
                      </span>
                    </div>
                    <p style={s.detail}>Table {b.table?.tableNumber} · {b.date} at {b.timeSlot} · {b.guests} guests</p>
                  </div>
                  {b.status === 'pending' && (
                    <div style={s.actionBtns}>
                      <button style={s.confirmBtn} onClick={() => updateStatus(b._id, 'confirmed')}>Confirm</button>
                      <button style={s.rejectBtn} onClick={() => updateStatus(b._id, 'cancelled')}>Cancel</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && tab === 'tables' && (
          <div>
            <div style={s.addCard}>
              <h3 style={s.addTitle}>Add New Table</h3>
              <div style={s.addForm}>
                <input style={s.miniInput} placeholder="Table No." type="number"
                  value={newTable.tableNumber} onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })} />
                <input style={s.miniInput} placeholder="Capacity" type="number"
                  value={newTable.capacity} onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })} />
                <select style={s.miniInput} value={newTable.location}
                  onChange={(e) => setNewTable({ ...newTable, location: e.target.value })}>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="private">Private</option>
                </select>
                <button style={s.addBtn} onClick={createTable}>+ Add Table</button>
              </div>
            </div>
            <div style={s.tableGrid}>
              {tables.map((t) => (
                <div key={t._id} style={s.tableCard}>
                  <div style={s.tableNumBig}>{t.tableNumber}</div>
                  <p style={s.tableName}>Table {t.tableNumber}</p>
                  <p style={s.tableInfo}>{t.capacity} seats</p>
                  <span style={s.tableBadge}>{t.location}</span>
                  <button style={s.deleteBtn} onClick={() => deleteTable(t._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: '#0a0f1e', minHeight: '100vh', padding: '100px 2rem 4rem', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', top: '5%', right: '0', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none' },
  container: { maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 },
  header: { marginBottom: '2.5rem' },
  eyebrow: { color: '#c9a84c', fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: '700', color: '#ffffff' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' },
  statCard: { background: 'rgba(15,21,32,0.9)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden' },
  statValue: { display: 'block', fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: '700', color: '#c9a84c', lineHeight: 1, marginBottom: '0.4rem' },
  statLabel: { display: 'block', color: '#6b7a9e', fontSize: '0.8rem' },
  statAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #c9a84c, transparent)' },
  tabsBar: { display: 'flex', gap: '0.25rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.3rem' },
  tabBtn: { flex: 1, padding: '0.6rem 1rem', borderRadius: '9px', border: 'none', background: 'transparent', color: '#6b7a9e', fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  activeTabBtn: { background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' },
  muted: { color: '#6b7a9e' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: { background: 'rgba(15,21,32,0.9)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: '14px', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem' },
  cardBody: { flex: 1 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' },
  guestName: { color: '#ffffff', fontWeight: '500', fontSize: '0.95rem', marginBottom: '0.15rem' },
  guestEmail: { color: '#6b7a9e', fontSize: '0.82rem' },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', flexShrink: 0 },
  detail: { color: '#6b7a9e', fontSize: '0.85rem' },
  actionBtns: { display: 'flex', gap: '0.5rem', flexShrink: 0 },
  confirmBtn: { background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.84rem', cursor: 'pointer' },
  rejectBtn: { background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.84rem', cursor: 'pointer' },
  addCard: { background: 'rgba(15,21,32,0.9)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' },
  addTitle: { fontFamily: "'Syne', sans-serif", color: '#ffffff', fontWeight: '600', fontSize: '1.1rem', marginBottom: '1.25rem' },
  addForm: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' },
  miniInput: { padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '0.9rem', maxWidth: '150px', fontFamily: "'Inter', sans-serif" },
  addBtn: { background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', color: '#0a0f1e', border: 'none', borderRadius: '8px', padding: '0.65rem 1.5rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(201,168,76,0.2)' },
  tableGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  tableCard: { background: 'rgba(15,21,32,0.9)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' },
  tableNumBig: { fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: '800', color: 'rgba(201,168,76,0.2)', lineHeight: 1, marginBottom: '0.5rem' },
  tableName: { color: '#ffffff', fontWeight: '600', marginBottom: '0.2rem', fontSize: '0.95rem' },
  tableInfo: { color: '#6b7a9e', fontSize: '0.82rem', marginBottom: '0.75rem' },
  tableBadge: { display: 'inline-block', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', marginBottom: '1rem', textTransform: 'capitalize' },
  deleteBtn: { display: 'block', width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' },
};

export default AdminDashboard;