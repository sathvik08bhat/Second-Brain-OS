import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogIn, LogOut, Calendar, CheckSquare, RefreshCw, Shield, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useGoogleStore } from '../../store/googleStore';

export default function GoogleIntegration() {
  const {
    isAuthenticated, userEmail, signIn, signOut,
    syncPreferences, setSyncPreference, isTokenValid,
  } = useGoogleStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err.message || 'Failed to sign in. Make sure Google Identity Services is loaded.');
    }
    setLoading(false);
  };

  const tokenValid = isTokenValid();

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🔗 Google Integration</span></h1>
        <p>Connect Google Calendar & Tasks to sync deadlines</p>
      </div>

      {/* Connection Status */}
      <motion.div
        className="glass-card"
        style={{ padding: '1.5rem', marginBottom: 'var(--space-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: isAuthenticated && tokenValid ? '#10b98115' : '#64748b15',
            color: isAuthenticated && tokenValid ? '#10b981' : '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${isAuthenticated && tokenValid ? '#10b981' : '#64748b'}30`,
          }}>
            <Shield size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>
              {isAuthenticated && tokenValid ? '✅ Connected' : '❌ Not Connected'}
            </div>
            {userEmail && <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{userEmail}</div>}
            {isAuthenticated && !tokenValid && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-yellow)' }}>Token expired — click Reconnect</div>}
          </div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={handleSignIn} disabled={loading}>
                <RefreshCw size={14} /> Reconnect
              </button>
              <button className="btn-danger" onClick={signOut} style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.2rem' }}>
                <LogOut size={14} /> Disconnect
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleSignIn} disabled={loading}>
              {loading ? <><RefreshCw size={14} className="animate-spin" /> Connecting...</> : <><LogIn size={14} /> Connect Google</>}
            </button>
          )}
        </div>
        {error && (
          <div style={{ padding: '0.75rem', background: '#ef444415', border: '2px solid #ef444430', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: 'var(--font-sm)' }}>
            ⚠️ {error}
          </div>
        )}
      </motion.div>

      {/* Features */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <motion.div className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Google Calendar</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Sync deadlines as calendar events</div>
            </div>
          </div>
          <ul style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 2 }}>
            <li>Task deadlines → Calendar events</li>
            <li>Course deadlines → Reminders</li>
            <li>Exam dates → All-day events</li>
            <li>AI/ML roadmap milestones</li>
          </ul>
        </motion.div>

        <motion.div className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Google Tasks</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Sync tasks to Google Tasks list</div>
            </div>
          </div>
          <ul style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 2 }}>
            <li>Create tasks in default list</li>
            <li>Due dates sync automatically</li>
            <li>Mark complete in either app</li>
            <li>Task descriptions preserved</li>
          </ul>
        </motion.div>
      </div>

      {/* Setup Guide */}
      <motion.div className="glass-card" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
          <Settings size={18} /> Setup Guide
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '0.75rem' }}>To enable Google integration, you need a Google Cloud OAuth Client ID:</p>
          <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>Google Cloud Console <ExternalLink size={12} /></a></li>
            <li>Create a new project (or use existing)</li>
            <li>Enable <strong>Google Calendar API</strong> and <strong>Google Tasks API</strong></li>
            <li>Go to <strong>Credentials</strong> → Create <strong>OAuth 2.0 Client ID</strong> (Web application)</li>
            <li>Add <code style={{ background: 'var(--bg-glass)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>http://localhost:5173</code> to Authorized JavaScript origins</li>
            <li>Copy the Client ID and paste it in <code style={{ background: 'var(--bg-glass)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>src/store/googleStore.js</code></li>
          </ol>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
