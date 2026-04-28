import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, Trash2, Edit3, Check, ExternalLink, Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useAimlStore } from '../../store/aimlStore';
import { useGoogleStore } from '../../store/googleStore';

const statusColors = { ideation: 'var(--accent-primary)', building: '#f59e0b', testing: '#3b82f6', shipped: '#10b981' };
const statusLabels = { ideation: '💡 Ideation', building: '🔨 Building', testing: '🧪 Testing', shipped: '🚀 Shipped' };

export default function AimlProjects() {
  const { projects, addProject, updateProject, deleteProject } = useAimlStore();
  const { isAuthenticated, createCalendarEvent } = useGoogleStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', description: '', techStack: '', status: 'ideation', githubUrl: '', deadline: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, deadline: form.deadline || null };
    if (editId) updateProject(editId, data);
    else addProject(data);
    resetForm();
  };

  const resetForm = () => { setForm({ name: '', description: '', techStack: '', status: 'ideation', githubUrl: '', deadline: '' }); setEditId(null); setShowModal(false); };

  const startEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', techStack: p.techStack || '', status: p.status, githubUrl: p.githubUrl || '', deadline: p.deadline || '' });
    setEditId(p.id);
    setShowModal(true);
  };

  const syncToCalendar = async (project) => {
    if (!project.deadline) return;
    try {
      await createCalendarEvent({
        title: `🧪 Project Deadline: ${project.name}`,
        description: `Status: ${project.status}\nTech: ${project.techStack}\n${project.githubUrl || ''}`,
        startDate: project.deadline,
      });
      alert('✅ Synced to Google Calendar!');
    } catch (err) { alert('❌ ' + err.message); }
  };

  const filtered = projects.filter(p => filter === 'all' || p.status === filter);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🧪 AI/ML Projects</span></h1>
        <p>Hands-on projects to solidify your ML skills</p>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 140 }}>
            <option value="all">All Projects</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Project</button>
        </div>
      </div>

      {/* Kanban-style status row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = projects.filter(p => p.status === key).length;
          return (
            <div key={key} style={{
              flex: '1 1 120px', padding: '0.75rem', textAlign: 'center',
              background: `${statusColors[key]}10`, border: `2px solid ${statusColors[key]}30`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              outline: filter === key ? `2px solid ${statusColors[key]}` : 'none',
            }} onClick={() => setFilter(filter === key ? 'all' : key)}>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: statusColors[key] }}>{count}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{label}</div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><FlaskConical size={48} /><h3>No Projects</h3><p>Start building to learn by doing.</p><button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Project</button></div>
      ) : (
        <div className="grid-auto">
          {filtered.map((project, i) => (
            <motion.div key={project.id} className="glass-card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-md)', marginBottom: '0.25rem' }}>{project.name}</div>
                  <span className="badge" style={{ background: `${statusColors[project.status]}15`, color: statusColors[project.status] }}>{statusLabels[project.status]}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-icon"><ExternalLink size={14} /></a>}
                  {isAuthenticated && project.deadline && <button className="btn-icon" onClick={() => syncToCalendar(project)} style={{ color: 'var(--accent-blue)' }}><Calendar size={14} /></button>}
                  <button className="btn-icon" onClick={() => startEdit(project)}><Edit3 size={14} /></button>
                  <button className="btn-icon" onClick={() => deleteProject(project.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              {project.description && <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{project.description}</div>}
              {project.techStack && (
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {project.techStack.split(',').map((tech, idx) => (
                    <span key={idx} className="chip">{tech.trim()}</span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                <span>Started {new Date(project.createdAt).toLocaleDateString('en-IN')}</span>
                {project.deadline && <span style={{ color: new Date(project.deadline) < new Date() && project.status !== 'shipped' ? 'var(--accent-red)' : 'var(--text-muted)' }}>📅 {project.deadline}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Project Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Sentiment Analysis API" /></div>
            <div className="form-group full-width"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What does this project do?" /></div>
            <div className="form-group"><label>Tech Stack</label><input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="Python, PyTorch, FastAPI..." /></div>
            <div className="form-group"><label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group"><label>GitHub URL</label><input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." /></div>
            <div className="form-group"><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn-primary"><Check size={16} /> {editId ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
