import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Key, Building2, FileText, Plus, Copy, CheckCircle2, ShieldAlert, Eye, EyeOff, Trash2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useVaultStore } from '../../store/vaultStore';

export default function VaultHome() {
  const { masterPin, setMasterPin, passwords, addPassword, deletePassword, bankDetails, addBankDetail, deleteBankDetail, privateNotes, updatePrivateNotes } = useVaultStore();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('passwords');

  // Lock automatically on unmount
  useEffect(() => {
    return () => setIsUnlocked(false);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!masterPin) {
      if (pinInput.length < 4) {
        setError('PIN must be at least 4 characters.');
        return;
      }
      setMasterPin(pinInput);
      setIsUnlocked(true);
      setError('');
    } else {
      if (pinInput === masterPin) {
        setIsUnlocked(true);
        setError('');
        setPinInput('');
      } else {
        setError('Incorrect PIN. Try again.');
        setPinInput('');
      }
    }
  };

  if (!isUnlocked) {
    return (
      <PageWrapper showBackButton={false}>
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            className="glass-card" 
            style={{ padding: '3rem 2rem', textAlign: 'center', width: '100%', maxWidth: 400 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #0f172a, #334155)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '4px 4px 0px #000' }}>
              <Lock size={40} />
            </div>
            <h2>Private Vault</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {!masterPin ? 'Create a master PIN to secure your vault.' : 'Enter your PIN to access secure storage.'}
            </p>

            <form onSubmit={handleUnlock}>
              <input 
                type="password" 
                maxLength={10}
                required
                autoFocus
                placeholder={!masterPin ? "Create New PIN" : "Enter PIN"}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="input-primary"
                style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem', padding: '1rem', marginBottom: '1rem' }}
              />
              {error && <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
              <button className="btn-primary" type="submit" style={{ width: '100%' }}>
                {!masterPin ? 'Set PIN & Unlock' : 'Unlock Vault'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>
              <ShieldAlert size={14} /> Data is stored locally on this device.
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1><span className="gradient-text">🔒 Private Vault</span></h1>
          <p>Secure storage for passwords, banking details, and private notes</p>
        </div>
        <button className="btn-secondary" onClick={() => setIsUnlocked(false)}>
          <Unlock size={14} /> Lock Vault
        </button>
      </div>

      <div className="tab-nav" style={{ marginBottom: 'var(--space-lg)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button className={activeTab === 'passwords' ? 'active' : ''} onClick={() => setActiveTab('passwords')}><Key size={14} /> Passwords</button>
        <button className={activeTab === 'banks' ? 'active' : ''} onClick={() => setActiveTab('banks')}><Building2 size={14} /> Bank Details</button>
        <button className={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}><FileText size={14} /> Secure Notes</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
        >
          {activeTab === 'passwords' && <PasswordManager passwords={passwords} addPassword={addPassword} deletePassword={deletePassword} />}
          {activeTab === 'banks' && <BankManager bankDetails={bankDetails} addBankDetail={addBankDetail} deleteBankDetail={deleteBankDetail} />}
          {activeTab === 'notes' && <SecureNotes notes={privateNotes} updatePrivateNotes={updatePrivateNotes} />}
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
}

// Subcomponents

function PasswordManager({ passwords, addPassword, deletePassword }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ platform: '', username: '', password: '', url: '' });

  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.platform) return;
    addPassword(formData);
    setFormData({ platform: '', username: '', password: '', url: '' });
    setShowForm(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Saved Passwords ({passwords.length})</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> Add Password</button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSubmit} className="form-grid cols-2">
            <div className="form-group">
              <label>Platform / App</label>
              <input required className="input-primary" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} placeholder="e.g. Netflix" />
            </div>
            <div className="form-group">
              <label>Website URL (optional)</label>
              <input type="url" className="input-primary" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Username / Email</label>
              <input required className="input-primary" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input required type="text" className="input-primary" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">Save Entry</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {passwords.length === 0 ? (
        <div className="empty-state glass-card">
          <Key size={48} />
          <h3>No Passwords Stored</h3>
          <p>Add your first secure password entry to get started.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {passwords.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
               <button onClick={() => deletePassword(p.id)} className="btn-icon-danger" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.2rem' }}>
                  <Trash2 size={14} />
               </button>
               <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{p.platform}</h4>
               
               <div style={{ marginBottom: '0.5rem' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Username</div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 500 }}>{p.username}</div>
                    <button onClick={() => copyToClipboard(p.username, p.id + 'u')} className="btn-icon" style={{ padding: 4 }}>
                      {copiedId === p.id + 'u' ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                 </div>
               </div>

               <div style={{ marginBottom: '0.5rem' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Password</div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-primary)' }}>
                    <div style={{ fontWeight: 500, letterSpacing: visiblePasswords[p.id] ? 'normal' : '0.2em', fontFamily: visiblePasswords[p.id] ? 'inherit' : 'monospace' }}>
                      {visiblePasswords[p.id] ? p.password : '••••••••'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={() => toggleVisibility(p.id)} className="btn-icon" style={{ padding: 4 }}>
                        {visiblePasswords[p.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => copyToClipboard(p.password, p.id + 'p')} className="btn-icon" style={{ padding: 4 }}>
                        {copiedId === p.id + 'p' ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BankManager({ bankDetails, addBankDetail, deleteBankDetail }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ bankName: '', accountName: '', accountNo: '', ifsc: '', upi: '' });
  const [copiedId, setCopiedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bankName) return;
    addBankDetail(formData);
    setFormData({ bankName: '', accountName: '', accountNo: '', ifsc: '', upi: '' });
    setShowForm(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Bank Accounts & UPI</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> Add Account</button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSubmit} className="form-grid cols-2">
            <div className="form-group">
              <label>Bank Name</label>
              <input required className="input-primary" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="e.g. HDFC Bank" />
            </div>
            <div className="form-group">
              <label>Account Holder Name</label>
              <input className="input-primary" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input type="password" required className="input-primary" value={formData.accountNo} onChange={e => setFormData({...formData, accountNo: e.target.value})} />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input className="input-primary" value={formData.ifsc} onChange={e => setFormData({...formData, ifsc: e.target.value})} style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>UPI ID (Optional)</label>
              <input className="input-primary" value={formData.upi} onChange={e => setFormData({...formData, upi: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">Save Details</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {bankDetails.length === 0 ? (
        <div className="empty-state glass-card">
          <Building2 size={48} />
          <h3>No Bank Details Stored</h3>
          <p>Add your sensitive banking information safely behind the PIN lock.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {bankDetails.map(b => (
            <div key={b.id} className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
               <button onClick={() => deleteBankDetail(b.id)} className="btn-icon-danger" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.2rem' }}>
                  <Trash2 size={14} />
               </button>
               <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#3b82f6' }}>{b.bankName}</h4>
               
               <div style={{ display: 'grid', gap: '0.75rem' }}>
                 {[
                   { label: 'Name', value: b.accountName, id: b.id+'n' },
                   { label: 'Acc No', value: b.accountNo, id: b.id+'a' },
                   { label: 'IFSC', value: b.ifsc, id: b.id+'i' },
                   { label: 'UPI', value: b.upi, id: b.id+'u' },
                 ].filter(x => x.value).map(field => (
                   <div key={field.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{field.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{field.value}</div>
                        <button onClick={() => copyToClipboard(field.value, field.id)} className="btn-icon" style={{ padding: 2 }}>
                          {copiedId === field.id ? <CheckCircle2 size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecureNotes({ notes, updatePrivateNotes }) {
  const [val, setVal] = useState(notes);
  const [saving, setSaving] = useState(false);

  // Auto-save debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (val !== notes) {
        updatePrivateNotes(val);
        setSaving(true);
        setTimeout(() => setSaving(false), 500);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [val, notes, updatePrivateNotes]);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '2px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-glass)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Private Journal</h3>
        <div style={{ fontSize: '0.8rem', color: saving ? 'var(--accent-green)' : 'var(--text-tertiary)', fontWeight: 600 }}>
          {saving ? 'Saved securely' : 'Auto-saves locally'}
        </div>
      </div>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Write anything you want to keep strictly private from prying eyes... Crypto keys, diary entries, deep secrets."
        className="input-primary"
        style={{ flex: 1, border: 'none', borderRadius: 0, padding: '1.5rem', resize: 'none', fontSize: '1rem', lineHeight: 1.6, background: 'transparent' }}
      />
    </div>
  );
}
