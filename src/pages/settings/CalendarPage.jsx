import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, LogIn, Clock, ListTodo, CheckCircle2, Circle, Plus, Trash2, Edit2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useGoogleStore } from '../../store/googleStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EVENT_COLORS = {
  '1': '#7986cb', '2': '#33b679', '3': '#8e24aa', '4': '#e67c73',
  '5': '#f6bf26', '6': '#f4511e', '7': '#039be5', '8': '#616161',
  '9': '#3f51b5', '10': '#0b8043', '11': '#d50000',
  default: '#8b5cf6',
};

function formatTime(dateStr) {
  if (!dateStr || dateStr.length <= 10) return 'All day';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

export default function CalendarPage() {
  const {
    isAuthenticated, isTokenValid, signIn, signOut, userEmail,
    calendarEvents, googleTasks, lastFetched,
    fetchCalendarEvents, fetchGoogleTasks, toggleGoogleTaskComplete,
    createCalendarEvent, editCalendarEvent, deleteCalendarEvent,
    createGoogleTask, editGoogleTask, deleteGoogleTask
  } = useGoogleStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [eventForm, setEventForm] = useState({ title: '', description: '', startDate: '', endDate: '', colorId: '1' });

  const isReady = isAuthenticated && isTokenValid();

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady, currentDate.getMonth(), currentDate.getFullYear()]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const min = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const max = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();
      await Promise.all([
        fetchCalendarEvents(min, max),
      ]);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  /* ── CRUD HANDLERS ── */

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.startDate) return;
    setLoading(true);
    try {
      if (editingId) {
        await editCalendarEvent(editingId, eventForm);
      } else {
        await createCalendarEvent(eventForm);
      }
      setIsEventModalOpen(false);
      setEditingId(null);
      await loadData();
    } catch (err) {
      alert("Error saving event: " + err.message);
    }
    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this calendar event?")) return;
    setLoading(true);
    try {
      await deleteCalendarEvent(id);
      await loadData();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  /* ── EDIT TRIGGERS ── */
  const openEditEvent = (ev) => {
    setEditingId(ev.id);
    let start = ev.start;
    let end = ev.end;
    if (start && start.length <= 10) start = start + 'T09:00'; 
    if (end && end.length <= 10) end = end + 'T10:00';
    if (start && start.includes('Z')) start = start.substring(0, 16); 
    if (end && end.includes('Z')) end = end.substring(0, 16);

    setEventForm({
      title: ev.title,
      description: ev.description,
      startDate: start || '',
      endDate: end || '',
      colorId: ev.color || '1'
    });
    setIsEventModalOpen(true);
  };

  // Calendar grid data
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const dayEvents = calendarEvents.filter(e => e.start.substring(0, 10) === dateStr);
      cells.push({ day: d, dateStr, isToday, events: dayEvents });
    }
    return cells;
  }, [currentDate, calendarEvents]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => { setCurrentDate(new Date()); setSelectedDate(null); };

  const selectedEvents = selectedDate
    ? calendarEvents.filter(e => e.start.substring(0, 10) === selectedDate)
    : calendarEvents.filter(e => {
        const d = new Date(e.start);
        return d >= new Date() || e.start.substring(0, 10) === new Date().toISOString().substring(0, 10);
      }).slice(0, 8);

  if (!isReady) {
    return (
      <PageWrapper>
        <div className="page-header">
          <h1><span className="gradient-text">📅 Google Calendar</span></h1>
          <p>Full Read/Write access to Calendar events</p>
        </div>
        <motion.div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Calendar size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Connect Google Account</h3>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Sign in with Google to view and edit your calendar events natively in Second Brain OS.
          </p>
          <button className="btn-primary" onClick={() => signIn().catch(() => {})}>
            <LogIn size={16} /> Connect Calendar
          </button>
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">📅 Google Calendar</span></h1>
        <div className="header-actions">
          {userEmail && <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', background: 'var(--bg-glass)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>{userEmail}</div>}
          <button className="btn-primary" onClick={() => { setEditingId(null); setEventForm({ title: '', description: '', startDate: '', endDate: '', colorId: '1' }); setIsEventModalOpen(true); }}><Plus size={16} /> Add Event</button>

          <button className="btn-secondary" onClick={() => signOut()}>Disconnect</button>
          <button className="btn-secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: '#ef444415', border: '2px solid #ef444430', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-lg)' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-lg)' }}>
        {/* Calendar Grid */}
        <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '2px solid var(--border-primary)' }}>
            <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-lg)' }}>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
              <button onClick={goToday} style={{ background: 'none', border: 'none', color: 'var(--accent-purple-light)', fontSize: 'var(--font-xs)', cursor: 'pointer', fontWeight: 600 }}>Today</button>
            </div>
            <button className="btn-icon" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-primary)' }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: '0.5rem', textAlign: 'center', fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--border-primary)', gap: '1px' }}>
            {calendarGrid.map((cell, i) => (
              <div
                key={i} onClick={() => cell && setSelectedDate(cell.dateStr)}
                style={{
                  minHeight: 110, padding: '0.4rem',
                  background: cell?.dateStr === selectedDate ? 'var(--accent-purple-light)' : cell?.isToday ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  cursor: cell ? 'pointer' : 'default', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {cell && (
                  <>
                    <div style={{
                      fontSize: 'var(--font-sm)', fontWeight: cell.isToday ? 800 : 500,
                      color: cell.isToday ? 'var(--accent-purple)' : 'var(--text-primary)',
                      padding: '0.2rem', marginBottom: '0.3rem',
                      ...(cell.isToday ? { background: 'var(--accent-purple)', color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}),
                    }}>
                      {cell.day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {cell.events.slice(0, 3).map(ev => (
                        <div key={ev.id} style={{
                          fontSize: '0.65rem', lineHeight: 1.3, padding: '2px 4px',
                          background: `${EVENT_COLORS[ev.color] || EVENT_COLORS.default}20`,
                          color: EVENT_COLORS[ev.color] || EVENT_COLORS.default,
                          borderRadius: '4px', borderLeft: `3px solid ${EVENT_COLORS[ev.color] || EVENT_COLORS.default}`,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600,
                        }}>
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event sidebar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '2px solid var(--border-primary)', fontWeight: 700, fontSize: 'var(--font-md)' }}>
              {selectedDate ? <>📌 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</> : '📌 Upcoming Events'}
            </div>

            {selectedEvents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                {selectedDate ? 'No events this day' : 'No upcoming events'}
              </div>
            ) : (
              <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                {selectedEvents.map(ev => (
                  <div key={ev.id} style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 4, minHeight: 36, borderRadius: 2, flexShrink: 0, marginTop: 2, background: EVENT_COLORS[ev.color] || EVENT_COLORS.default }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)', marginBottom: 2 }}>{ev.title}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10} />
                        {ev.allDay ? 'All day' : `${formatTime(ev.start)} – ${formatTime(ev.end)}`}
                      </div>
                      {ev.description && (
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4, maxHeight: 40, overflow: 'hidden' }}>{ev.description.substring(0, 100)}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <button onClick={() => openEditEvent(ev)} className="btn-icon" title="Edit Event" style={{ color: 'var(--text-secondary)' }}><Edit2 size={12} /></button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="btn-icon" title="Delete Event" style={{ color: 'var(--accent-red)' }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── MODALS ── */}
      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={editingId ? "Edit Calendar Event" : "New Calendar Event"}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" className="input-field" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Date & Time</label>
              <input type="datetime-local" className="input-field" value={eventForm.startDate} onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End Date & Time</label>
              <input type="datetime-local" className="input-field" value={eventForm.endDate} onChange={e => setEventForm({ ...eventForm, endDate: e.target.value })} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="input-field" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label>Color Code (Google Enum)</label>
            <select className="input-field" value={eventForm.colorId} onChange={e => setEventForm({ ...eventForm, colorId: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}>
              {Object.keys(EVENT_COLORS).filter(k=>k!=='default').map(k => <option key={k} value={k}>Google Color Enum #{k}</option>)}
            </select>
          </div>
          <button onClick={handleSaveEvent} className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            {editingId ? 'Update Event' : 'Push to Live Calendar'}
          </button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
