import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, ArrowUpRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useStartupStore, STARTUP_COLLECTIONS, DB_SCHEMAS } from '../../store/startupStore';

export default function StartupDatabase() {
  const { dbId } = useParams();
  
  // Extract configuration from store arrays
  const collectionName = STARTUP_COLLECTIONS[dbId];
  const columns = DB_SCHEMAS[dbId] || [];
  
  // Store getters/setters dynamically based on dbId
  const items = useStartupStore(s => s[dbId] || []);
  const { addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  if (!collectionName) {
    return (
      <PageWrapper>
        <div className="page-header">
          <h1>Database Not Found</h1>
          <Link to="/startup" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>← Back to Startup OS</Link>
        </div>
      </PageWrapper>
    );
  }

  const handleOpenModal = () => {
    // build default form data based on schema
    const initialData = {};
    columns.forEach(c => { initialData[c.key] = ''; });
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Basic validation
    if (!formData[columns[0].key]) return; // require title at least
    
    addGenericItem(dbId, formData);
    setIsModalOpen(false);
  };

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
            <h1>{collectionName}</h1>
          </div>
          <p style={{ marginTop: '0.25rem' }}>{items.length} records found in this database.</p>
        </div>
        
        <button className="btn-primary" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Entry
        </button>
      </div>

      {/* Universal Data Table View */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>
                  {col.label}
                </th>
              ))}
              <th style={{ padding: '1rem', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  This database is currently empty.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {columns.map((col, idx) => (
                    <td key={col.key} style={{ padding: '1rem', color: idx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: idx === 0 ? 500 : 400 }}>
                      
                      {/* Render Links specially */}
                      {col.type === 'link' && item[col.key] ? (
                        <a href={item[col.key]} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Open <ArrowUpRight size={14} />
                        </a>
                      ) : col.type === 'status' ? (
                        <span style={{ 
                          padding: '0.25rem 0.6rem', 
                          borderRadius: '100px', 
                          fontSize: '0.75rem', 
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)'
                        }}>
                          {item[col.key]}
                        </span>
                      ) : (
                        item[col.key]
                      )}

                    </td>
                  ))}
                  
                  {/* Delete Action */}
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => deleteGenericItem(dbId, item.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Data Entry Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`New ${collectionName} Entry`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          {columns.map(col => (
            <div key={col.key} className="form-group">
              <label>{col.label}</label>
              <input
                type={col.type === 'number' ? 'number' : 'text'}
                className="input-field"
                value={formData[col.key] || ''}
                placeholder={col.type === 'link' ? 'https://...' : ''}
                onChange={(e) => setFormData(p => ({ ...p, [col.key]: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          ))}

          <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Save Entry
          </button>
        </div>
      </Modal>

    </PageWrapper>
  );
}
