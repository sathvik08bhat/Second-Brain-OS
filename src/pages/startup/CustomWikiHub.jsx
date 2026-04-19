import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckSquare, Plus, Save, Trash2, FileText } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useStartupStore } from '../../store/startupStore';

export default function CustomWikiHub({ type }) {
  // 'wiki' vs 'sop' passed from router
  const dbKey = type === 'wiki' ? 'companyWiki' : 'sopDB';
  const { [dbKey]: documents, addGenericItem, updateGenericItem, deleteGenericItem } = useStartupStore();
  
  const [activeDocId, setActiveDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Handle switching active items safely
  useEffect(() => {
    if (activeDocId) {
      const doc = documents.find(d => d.id === activeDocId);
      if (doc) {
        setEditTitle(doc.title || '');
        setEditContent(doc.content || '');
      } else {
        setActiveDocId(null);
        setEditTitle('');
        setEditContent('');
      }
    }
  }, [activeDocId, documents]);

  const handleCreateNew = () => {
    const newItem = { title: 'Untitled Document', content: '' };
    // This adds to store instantly. We then just let the state pick it up.
    addGenericItem(dbKey, newItem);
  };

  const activeDoc = documents.find(d => d.id === activeDocId);

  const handleSave = () => {
    if (!activeDocId) return;
    updateGenericItem(dbKey, activeDocId, { 
      title: editTitle, 
      content: editContent 
    });
  };

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link to="/startup" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Startup OS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: type === 'wiki' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {type === 'wiki' ? <BookOpen size={24} color="#8b5cf6" /> : <CheckSquare size={24} color="#10b981" />}
            </div>
            <h1>{type === 'wiki' ? 'Company Wiki' : 'SOP Hub'}</h1>
          </div>
          <p style={{ marginTop: '0.5rem' }}>
            {type === 'wiki' 
              ? 'The single source of truth for company vision, brand guidelines, and documents.'
              : 'Standard Operating Procedures to streamline employee onboarding and processes.'}
          </p>
        </div>
      </div>

      {/* Split Pane Editor Layout */}
      <div style={{ display: 'flex', gap: '1.5rem', height: '65vh', minHeight: '600px' }}>
        
        {/* Left Sidebar: Document List */}
        <div className="glass-card" style={{ width: '320px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Documents</h3>
            <button onClick={handleCreateNew} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Plus size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {documents.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No documents found. Create one.
              </div>
            ) : (
              documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    background: activeDocId === doc.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                    borderLeft: activeDocId === doc.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <FileText size={16} color={activeDocId === doc.id ? 'var(--accent-primary)' : 'var(--text-tertiary)'} />
                  <span style={{ fontSize: '0.9rem', color: activeDocId === doc.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeDocId === doc.id ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.title || 'Untitled Document'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Editor */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!activeDoc ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a document from the left, or create a new one.
            </div>
          ) : (
            <>
              {/* Editor Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600, outline: 'none', width: '70%' }}
                  placeholder="Document Title"
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleSave} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Save size={14} /> Save
                  </button>
                  <button 
                    onClick={() => {
                      deleteGenericItem(dbKey, activeDocId);
                      setActiveDocId(null);
                    }} 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Start typing your documentation..."
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-heading)' // clean sans-serif
                }}
              />
            </>
          )}
        </div>

      </div>

    </PageWrapper>
  );
}
