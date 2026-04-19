import React, { useState } from 'react';
import { useSyncStore } from '../../store/syncStore';
import { useGoogleStore } from '../../store/googleStore';

export default function SyncDebugPanel() {
  const [open, setOpen] = useState(false);
  const { syncLog, lastSynced, isSyncing, syncError, forcePush, forcePull } = useSyncStore();
  const { userEmail, isAuthenticated } = useGoogleStore();

  return (
    <>
      {/* Floating sync indicator button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99999,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: syncError ? '#ef4444' : isSyncing ? '#f59e0b' : isAuthenticated ? '#10b981' : '#6b7280',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isSyncing ? 'spin 1s linear infinite' : 'none',
        }}
        title="Sync Status"
      >
        🔄
      </button>

      {/* Debug Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 99999,
            width: '360px',
            maxWidth: '90vw',
            maxHeight: '60vh',
            background: '#1e1e2e',
            color: '#cdd6f4',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'monospace',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#89b4fa' }}>
            🔧 Sync Debug Panel
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>Auth:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
          <div style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
            <strong>Email:</strong> {userEmail || '(none)'}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Status:</strong> {isSyncing ? '⏳ Syncing...' : '✅ Idle'}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Last Sync:</strong> {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Never'}
          </div>
          {syncError && (
            <div style={{ marginBottom: '8px', color: '#f38ba8' }}>
              <strong>Error:</strong> {syncError}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => forcePush(userEmail)}
              disabled={!userEmail || isSyncing}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                background: '#89b4fa', color: '#1e1e2e', fontWeight: 'bold',
                cursor: 'pointer', fontSize: '11px',
                opacity: (!userEmail || isSyncing) ? 0.5 : 1,
              }}
            >
              ⬆️ Force Push
            </button>
            <button
              onClick={() => forcePull(userEmail)}
              disabled={!userEmail || isSyncing}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                background: '#a6e3a1', color: '#1e1e2e', fontWeight: 'bold',
                cursor: 'pointer', fontSize: '11px',
                opacity: (!userEmail || isSyncing) ? 0.5 : 1,
              }}
            >
              ⬇️ Force Pull
            </button>
          </div>

          {/* Log */}
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#89b4fa' }}>Recent Log:</div>
          <div style={{ 
            background: '#181825', borderRadius: '8px', padding: '8px',
            maxHeight: '200px', overflowY: 'auto', fontSize: '11px', lineHeight: '1.6'
          }}>
            {syncLog.length === 0 ? (
              <div style={{ color: '#585b70' }}>No sync activity yet</div>
            ) : (
              syncLog.map((entry, i) => (
                <div key={i} style={{ 
                  color: entry.includes('ERROR') ? '#f38ba8' : 
                         entry.includes('SUCCESS') ? '#a6e3a1' : 
                         entry.includes('SKIPPED') ? '#fab387' : '#cdd6f4' 
                }}>
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
