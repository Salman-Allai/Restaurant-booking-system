import { useState } from 'react';
import api from '../api/axiosInstance';

const TIME_SLOTS = [
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM',
  '5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM',
];

function BookTable() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTables = async () => {
    if (!date || !timeSlot) return;
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/tables/available', { params: { date, timeSlot } });
      setTables(data); setStep(2);
    } catch { setError('Failed to load available tables'); }
    finally { setLoading(false); }
  };

  const confirmBooking = async () => {
    if (!selectedTable) return;
    setLoading(true); setError('');
    try {
      await api.post('/bookings', { tableId: selectedTable._id, date, timeSlot, guests, specialRequest });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  const stepLabels = ['Date & Time', 'Choose Table', 'Confirmed'];

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.container}>
        <div style={s.header}>
          <p style={s.eyebrow}>Reservations</p>
          <h1 style={s.title}>Book a Table</h1>
          <div style={s.stepper}>
            {stepLabels.map((label, i) => (
              <div key={i} style={s.stepItem}>
                <div style={{
                  ...s.stepCircle,
                  background: step > i + 1 ? '#c9a84c' : step === i + 1 ? 'linear-gradient(135deg,#c9a84c,#e8c97a)' : 'rgba(255,255,255,0.05)',
                  border: step >= i + 1 ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  color: step >= i + 1 ? '#0a0f1e' : '#6b7a9e',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ ...s.stepLabel, color: step === i + 1 ? '#c9a84c' : '#6b7a9e' }}>{label}</span>
                {i < stepLabels.length - 1 && (
                  <div style={{ ...s.stepLine, background: step > i + 1 ? '#c9a84c' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          {step === 1 && (
            <div style={s.form}>
              <h2 style={s.cardTitle}>When would you like to dine?</h2>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>Select date</label>
                  <input type="date" value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Select time</label>
                  <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                    <option value="">Choose a time slot</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {error && <p style={s.errorMsg}>{error}</p>}
              <button style={{ ...s.btn, opacity: (!date || !timeSlot || loading) ? 0.5 : 1 }}
                onClick={searchTables} disabled={!date || !timeSlot || loading}>
                {loading ? 'Searching...' : 'Find Available Tables →'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={s.cardTitle}>Select your table</h2>
              <div style={s.slotTags}>
                <span style={s.tag}>{date}</span>
                <span style={s.tag}>{timeSlot}</span>
              </div>
              {tables.length === 0 ? (
                <div style={s.empty}>
                  <p style={s.emptyTitle}>No tables available</p>
                  <p style={s.emptyDesc}>Try a different date or time.</p>
                  <button style={s.outlineBtn} onClick={() => setStep(1)}>← Go Back</button>
                </div>
              ) : (
                <>
                  <div style={s.tableGrid}>
                    {tables.map((table) => (
                      <div key={table._id} onClick={() => setSelectedTable(table)}
                        style={{
                          ...s.tableCard,
                          borderColor: selectedTable?._id === table._id ? '#c9a84c' : 'rgba(255,255,255,0.07)',
                          background: selectedTable?._id === table._id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                          boxShadow: selectedTable?._id === table._id ? '0 0 0 1px #c9a84c' : 'none',
                        }}>
                        <div style={{ ...s.tableTop, background: selectedTable?._id === table._id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)' }}>
                          <span style={{ ...s.tableNumber, color: selectedTable?._id === table._id ? '#c9a84c' : '#ffffff' }}>
                            {table.tableNumber}
                          </span>
                        </div>
                        <p style={s.tableName}>Table {table.tableNumber}</p>
                        <p style={s.tableMeta}>{table.capacity} seats</p>
                        <p style={s.tableLoc}>{table.location}</p>
                      </div>
                    ))}
                  </div>
                  <div style={s.form}>
                    <div style={s.formGrid}>
                      <div style={s.field}>
                        <label style={s.label}>Number of guests</label>
                        <input type="number" min="1" max="20" value={guests}
                          onChange={(e) => setGuests(e.target.value)} />
                      </div>
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>Special request (optional)</label>
                      <textarea rows="3" value={specialRequest}
                        placeholder="Dietary requirements, occasion, seating preference..."
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        style={{ resize: 'vertical', fontFamily: "'Inter', sans-serif" }} />
                    </div>
                    {error && <p style={s.errorMsg}>{error}</p>}
                    <div style={s.btnRow}>
                      <button style={s.outlineBtn} onClick={() => setStep(1)}>← Back</button>
                      <button style={{ ...s.btn, opacity: (!selectedTable || loading) ? 0.5 : 1, flex: 2 }}
                        onClick={confirmBooking} disabled={!selectedTable || loading}>
                        {loading ? 'Confirming...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={s.success}>
              <div style={s.successIconWrap}>
                <span style={s.successIcon}>✦</span>
              </div>
              <h2 style={s.successTitle}>Reservation Confirmed!</h2>
              <p style={s.successDesc}>Your table has been successfully booked.</p>
              <div style={s.successDetails}>
                <div style={s.successRow}><span style={s.successKey}>Table</span><span style={s.successVal}>{selectedTable?.tableNumber} · {selectedTable?.location}</span></div>
                <div style={s.successRow}><span style={s.successKey}>Date</span><span style={s.successVal}>{date}</span></div>
                <div style={s.successRow}><span style={s.successKey}>Time</span><span style={s.successVal}>{timeSlot}</span></div>
                <div style={s.successRow}><span style={s.successKey}>Guests</span><span style={s.successVal}>{guests}</span></div>
              </div>
              <button style={s.outlineBtn} onClick={() => { setStep(1); setDate(''); setTimeSlot(''); setSelectedTable(null); }}>
                Book Another Table
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#0a0f1e', minHeight: '100vh', padding: '100px 2rem 4rem', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  container: { maxWidth: '660px', margin: '0 auto', position: 'relative', zIndex: 2 },
  header: { textAlign: 'center', marginBottom: '3rem' },
  eyebrow: { color: '#c9a84c', fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem' },
  stepper: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0 },
  stepLabel: { fontSize: '0.8rem', fontWeight: '500', whiteSpace: 'nowrap' },
  stepLine: { width: '48px', height: '1px', margin: '0 0.5rem', flexShrink: 0 },
  card: { background: 'rgba(15,21,32,0.9)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { color: '#6b7a9e', fontSize: '0.8rem', fontWeight: '500' },
  btn: { background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', color: '#0a0f1e', border: 'none', borderRadius: '10px', padding: '0.95rem 1.75rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(201,168,76,0.2)', flex: 1 },
  outlineBtn: { background: 'transparent', color: 'rgba(232,237,248,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.95rem 1.75rem', fontSize: '0.95rem', cursor: 'pointer', flex: 1 },
  btnRow: { display: 'flex', gap: '1rem' },
  slotTags: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tag: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#e8c97a', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.82rem' },
  tableGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '2rem' },
  tableCard: { border: '1px solid', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease' },
  tableTop: { padding: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  tableNumber: { fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: '700', transition: 'all 0.2s ease' },
  tableName: { color: '#ffffff', fontWeight: '500', fontSize: '0.85rem', textAlign: 'center', padding: '0 0.75rem 0.2rem' },
  tableMeta: { color: '#6b7a9e', fontSize: '0.78rem', textAlign: 'center' },
  tableLoc: { color: '#6b7a9e', fontSize: '0.78rem', textAlign: 'center', paddingBottom: '0.75rem', textTransform: 'capitalize' },
  errorMsg: { color: '#f87171', fontSize: '0.88rem', background: 'rgba(239,68,68,0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' },
  empty: { textAlign: 'center', padding: '2.5rem 0' },
  emptyTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' },
  emptyDesc: { color: '#6b7a9e', marginBottom: '1.5rem' },
  success: { textAlign: 'center', padding: '1rem 0' },
  successIconWrap: { width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  successIcon: { color: '#c9a84c', fontSize: '1.8rem' },
  successTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.7rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' },
  successDesc: { color: '#6b7a9e', marginBottom: '2rem' },
  successDetails: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' },
  successRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  successKey: { color: '#6b7a9e', fontSize: '0.88rem' },
  successVal: { color: '#c9a84c', fontSize: '0.88rem', fontWeight: '600' },
};

export default BookTable;