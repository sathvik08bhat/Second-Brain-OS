import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Plus, Users, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

export default function UserAcquisition() {
  const { userAcquisitionLogs, addGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], activeUsers: 0, newSignups: 0, marketingSpend: 0 });

  const handleSave = () => {
    addGenericItem('userAcquisitionLogs', {
      ...formData,
      activeUsers: Number(formData.activeUsers),
      newSignups: Number(formData.newSignups),
      marketingSpend: Number(formData.marketingSpend)
    });
    setIsModalOpen(false);
    setFormData({ date: new Date().toISOString().split('T')[0], activeUsers: 0, newSignups: 0, marketingSpend: 0 });
  };

  // Sort chronologically for charts
  const sortedLogs = [...userAcquisitionLogs].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Analytics Engine
  const totalSpend = sortedLogs.reduce((acc, log) => acc + (log.marketingSpend || 0), 0);
  const totalSignups = sortedLogs.reduce((acc, log) => acc + (log.newSignups || 0), 0);
  const blendedCAC = totalSignups > 0 ? (totalSpend / totalSignups).toFixed(2) : 0;
  
  const latestDAU = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].activeUsers : 0;

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} color="#ec4899" />
            </div>
            <h1>Growth & User Analytics</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>Track DAU velocity and calculate Customer Acquisition Costs (CAC).</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ec4899', color: 'white' }}>
          <Plus size={18} /> Log Daily Metrics
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <Activity size={16} /> Latest DAU
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>
            {latestDAU.toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <Users size={16} /> Total New Signups
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
            {totalSignups.toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', title: 'Customer Acquisition Cost' }}>
            <TrendingUp size={16} /> Blended CAC
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
            ${blendedCAC}
          </div>
        </div>

      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Daily Active Users (DAU) Velocity</h3>
        {sortedLogs.length < 2 ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            Log at least two daily metrics to visualize the growth curve.
          </div>
        ) : (
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer>
              <AreaChart data={sortedLogs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorDAU)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>DAU</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>New Signups</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Ad Spend</th>
              <th style={{ padding: '1rem', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{new Date(log.date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', fontWeight: 600, color: '#3b82f6' }}>{log.activeUsers?.toLocaleString()}</td>
                <td style={{ padding: '1rem', color: '#10b981' }}>+{log.newSignups?.toLocaleString()}</td>
                <td style={{ padding: '1rem', color: '#f59e0b' }}>${log.marketingSpend?.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => deleteGenericItem('userAcquisitionLogs', log.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                </td>
              </tr>
            ))}
            {sortedLogs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No logs recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Daily Metrics">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', colorScheme: 'dark' }} />
          </div>

          <div className="form-group">
            <label>Total Daily Active Users (DAU)</label>
            <input type="number" className="input-field" value={formData.activeUsers} onChange={e => setFormData({ ...formData, activeUsers: e.target.value })} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>New Signups</label>
              <input type="number" className="input-field" value={formData.newSignups} onChange={e => setFormData({ ...formData, newSignups: e.target.value })} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Daily Ad Spend ($)</label>
              <input type="number" className="input-field" value={formData.marketingSpend} onChange={e => setFormData({ ...formData, marketingSpend: e.target.value })} style={{ width: '100%' }} />
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#ec4899', color: 'white' }}>Log Stats</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
