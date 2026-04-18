import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={48} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: 'var(--font-xl)', marginBottom: '1rem', fontWeight: 800 }}>Component Crashed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px' }}>
            We encountered an unexpected error while rendering this page.
          </p>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', width: '100%', maxWidth: '800px', overflowX: 'auto', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--accent-red)', fontWeight: 600, marginBottom: '0.5rem' }}>{this.state.error?.toString()}</p>
            <pre style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0, padding: 0 }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => window.location.reload()}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <RefreshCcw size={16} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
