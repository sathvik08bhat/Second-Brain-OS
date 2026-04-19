import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, HeartPulse, Flame, Clock, RefreshCw, Smartphone, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useGoogleStore } from '../../store/googleStore';

export default function GoogleFitHub() {
  const { isTokenValid, fitHistory, fetchGoogleFitHistory, lastFetched } = useGoogleStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!isTokenValid()) return;
    setLoading(true);
    setError(null);
    try {
      await fetchGoogleFitHistory(6); // Get last 7 days (today + 6 past days)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTokenValid() && fitHistory.length === 0) {
      fetchHistory();
    }
  }, [isTokenValid, fitHistory.length]);

  // Derive today's metrics
  const todayMetrics = fitHistory.length > 0 ? fitHistory[fitHistory.length - 1] : { steps: 0, heartPoints: 0, calories: 0, activeMinutes: 0 };

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1><span className="gradient-text">👟 Google Fit Hub</span></h1>
          <p>Advanced metrics and historical syncing from your wearables and devices.</p>
        </div>
        {isTokenValid() && (
          <button className="btn-secondary" onClick={fetchHistory} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
             <RefreshCw size={14} className={loading ? 'spin' : ''} />
             {loading ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>

      {!isTokenValid() ? (
        <div className="empty-state glass-card" style={{ marginTop: '2rem' }}>
          <Smartphone size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
          <h3>Not Connected to Google</h3>
          <p style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>
             To sync physical health data, connect your Google Account and ensure the Analytics APIs are approved.
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
            <StatsCard icon={Activity} label="Steps Today" value={todayMetrics.steps.toLocaleString()} subtitle="Daily aggregate" color="#3b82f6" />
            <StatsCard icon={HeartPulse} label="Heart Points" value={todayMetrics.heartPoints} subtitle="AHA metrics" color="#ef4444" delay={0.1} />
            <StatsCard icon={Flame} label="Calories" value={`${todayMetrics.calories} kcal`} subtitle="Estimated burned" color="#f59e0b" delay={0.2} />
            <StatsCard icon={Clock} label="Active Minutes" value={`${todayMetrics.activeMinutes} min`} subtitle="Time moving" color="#10b981" delay={0.3} />
          </div>

          <div className="grid-2">
            <motion.div className="glass-card" style={{ padding: '1.5rem', height: 350 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                 <Activity size={18} style={{ color: '#3b82f6' }} /> Step History (7 Days)
              </h3>
              {fitHistory.length === 0 && !loading ? (
                 <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>No data available. Sync required.</div>
              ) : (
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={fitHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: '#fff' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            <motion.div className="glass-card" style={{ padding: '1.5rem', height: 350 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                 <Flame size={18} style={{ color: '#f59e0b' }} /> Calories & Activity
              </h3>
              {fitHistory.length === 0 && !loading ? (
                 <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>No data available. Sync required.</div>
              ) : (
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={fitHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: '#fff' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                    <Line yAxisId="right" type="monotone" dataKey="activeMinutes" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>
          <div style={{ marginTop: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center' }}>
            Data pulled from Google Fit REST API • Last synced: {lastFetched ? new Date(lastFetched).toLocaleTimeString() : 'Never'}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
