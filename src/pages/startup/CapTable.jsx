import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PieChart, Plus, Users, Hash } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore } from '../../store/startupStore';

const COLORS = ['var(--accent-primary)', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e'];

export default function CapTable() {
  const { capTable, addGenericItem, deleteGenericItem } = useStartupStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', shares: 0, role: 'Founder' });

  const handleSave = () => {
    if (!formData.title) return;
    addGenericItem('capTable', {
      title: formData.title,
      shares: Number(formData.shares),
      role: formData.role
    });
    setIsModalOpen(false);
    setFormData({ title: '', shares: 0, role: 'Founder' });
  };

  // Pre-process Data for Pie Chart
  const totalShares = capTable.reduce((acc, obj) => acc + (Number(obj.shares) || 0), 0);
  
  const chartData = capTable.map(entity => ({
    name: entity.title,
    value: Number(entity.shares) || 0,
    percentage: totalShares > 0 ? ((Number(entity.shares) / totalShares) * 100).toFixed(1) : 0
  })).sort((a, b) => b.value - a.value); // sort largest to smallest

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart size={24} color="#38bdf8" />
            </div>
            <h1>Cap Table & Equity</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>Track company ownership, outstanding shares, and dynamically map equity.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#38bdf8', color: '#000' }}>
          <Plus size={18} /> Issue Shares
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Left Side: Summary Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={16} /> Total Outstanding Shares
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalShares.toLocaleString()}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} /> Shareholders on Record
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {capTable.length}
            </div>
          </div>
        </div>

        {/* Right Side: The Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Ownership Distribution</h3>
          {capTable.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Issue shares to view equity distribution.
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => value.toLocaleString()}
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* The Ledger Table */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Shareholder Ledger</h3>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Entity Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Classification</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Shares Owned</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>% Ownership</th>
              <th style={{ padding: '1rem', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((entity, i) => (
              <tr key={entity.name + i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                  {entity.name}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {capTable.find(c => c.title === entity.name)?.role || 'N/A'}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{entity.value.toLocaleString()}</td>
                <td style={{ padding: '1rem', color: '#38bdf8', fontWeight: 600 }}>{entity.percentage}%</td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => {
                      const idToDelete = capTable.find(c => c.title === entity.name)?.id;
                      if (idToDelete) deleteGenericItem('capTable', idToDelete);
                    }} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
            {capTable.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No shareholders recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Equity">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="form-group">
            <label>Entity Name (Person, VC Firm, or Option Pool)</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Employee Option Pool" style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Number of Shares</label>
              <input type="number" className="input-field" value={formData.shares} onChange={e => setFormData({ ...formData, shares: e.target.value })} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Classification</label>
              <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }}>
                <option value="Founder">Founder</option>
                <option value="Employee (Stock Option)">Employee</option>
                <option value="Investor (Preferred)">Investor</option>
                <option value="Option Pool (Unallocated)">Option Pool</option>
                <option value="Advisor">Advisor</option>
              </select>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#38bdf8', color: '#000' }}>Issue Shares</button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
