import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogIn, LogOut, Calendar, CheckSquare, RefreshCw, Shield, ExternalLink, Check } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useGoogleStore } from '../../store/googleStore';

export default function GoogleIntegration() {
  const {
    isAuthenticated, userEmail, signIn, signOut,
    isTokenValid, syncPreferences, setSyncPreference
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
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 p-6 lg:p-12 text-foreground">
        {/* Header Section */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-transparent inline-block">
            Google Workspace
          </h1>
          <p className="text-muted-foreground text-lg">
            Unified synchronization for your digital ecosystem
          </p>
        </div>

        {/* Status Card */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between bg-card border border-border rounded-2xl p-8 gap-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className={`p-5 rounded-2xl transition-all duration-300 border ${
              isAuthenticated && tokenValid 
                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                : 'bg-muted text-muted-foreground border-border'
            }`}>
              <Shield size={40} />
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {isAuthenticated && tokenValid ? 'Workspace Connected' : 'Workspace Disconnected'}
              </div>
              {userEmail && <div className="text-muted-foreground font-medium flex items-center gap-2 justify-center md:justify-start">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {userEmail}
              </div>}
              {isAuthenticated && !tokenValid && (
                <div className="text-yellow-500 font-bold text-sm animate-pulse">
                  Session expired — Re-authentication required
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {isAuthenticated ? (
              <>
                <button 
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                  onClick={handleSignIn} 
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <RefreshCw size={18} />}
                  Reconnect
                </button>
                <button 
                  className="px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                  onClick={signOut}
                >
                  <LogOut size={18} /> Disconnect
                </button>
              </>
            ) : (
              <button 
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                onClick={handleSignIn} 
                disabled={loading}
              >
                {loading ? <RefreshCw className="animate-spin" /> : <LogIn size={20} />}
                {loading ? 'Connecting...' : 'Connect Workspace'}
              </button>
            )}
          </div>
        </motion.div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="p-8 bg-card border border-border rounded-2xl space-y-6"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Calendar size={24} />
              </div>
              <h3 className="font-bold text-xl">Google Calendar</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Automatic deadline synchronization',
                'Course and exam schedule integration',
                'Real-time event updates',
                'Milestone tracking from roadmap'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                  <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="p-8 bg-card border border-border rounded-2xl space-y-6"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckSquare size={24} />
              </div>
              <h3 className="font-bold text-xl">Google Tasks</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Two-way task list synchronization',
                'Due date and priority preservation',
                'Cross-platform completion status',
                'Native description support'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                  <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Sync Preferences */}
        {isAuthenticated && tokenValid && (
          <motion.div 
            className="p-8 bg-card border border-border rounded-2xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Settings size={24} />
              </div>
              <h3 className="font-bold text-xl">Automation & Sync Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'autoSyncTasks', label: 'Auto-sync Google Tasks', color: 'bg-green-500' },
                { key: 'autoSyncAcademics', label: 'Auto-sync Academic Classes', color: 'bg-blue-500' },
                { key: 'autoSyncAiml', label: 'Auto-sync AIML Roadmap', color: 'bg-purple-500' },
              ].map((pref) => (
                <label key={pref.key} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border cursor-pointer hover:bg-secondary transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{pref.label}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Real-time Push</span>
                  </div>
                  <div 
                    onClick={() => setSyncPreference(pref.key, !syncPreferences[pref.key])}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${syncPreferences[pref.key] ? pref.color : 'bg-muted'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${syncPreferences[pref.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Links */}
        <motion.div 
          className="text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <a 
            href="https://console.cloud.google.com" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Configure Google Cloud Console <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

