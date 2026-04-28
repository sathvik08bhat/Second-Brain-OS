import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, PlaySquare, TrendingUp, RefreshCw, Trophy, Target, GitCommit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/shared/StatsCard';
import { useDsaStore } from '../../store/dsaStore';

export default function DsaHome() {
  const { leetcodeUsername, leetcodeStats, lastFetched, isFetching, fetchError, setUsername, fetchLeetCodeStats, roadmap } = useDsaStore();
  const [inputUser, setInputUser] = useState('');

  useEffect(() => {
    if (leetcodeUsername && !leetcodeStats && !isFetching) {
      fetchLeetCodeStats();
    }
  }, [leetcodeUsername]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (!inputUser.trim()) return;
    setUsername(inputUser.trim());
    fetchLeetCodeStats();
  };

  const masteredTopics = roadmap.filter(t => t.status === 'mastered').length;
  const learningTopics = roadmap.filter(t => t.status === 'learning').length;

  const pieData = leetcodeStats ? [
    { name: 'Easy', value: leetcodeStats.easySolved, color: '#1cbab3' }, // LeetCode easy color
    { name: 'Medium', value: leetcodeStats.mediumSolved, color: '#ffb700' }, // LeetCode medium color
    { name: 'Hard', value: leetcodeStats.hardSolved, color: '#f63737' }, // LeetCode hard color
  ].filter(d => d.value > 0) : [];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">💻 DSA Hub</span></h1>
        <p>Data Structures & Algorithms tracking and LeetCode sync</p>
        {leetcodeUsername && (
          <div className="header-actions">
            <button className="btn-secondary" onClick={fetchLeetCodeStats} disabled={isFetching}>
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> {isFetching ? 'Syncing...' : 'Sync LeetCode'}
            </button>
            <button className="btn-icon" style={{ background: '#ef444420', color: '#ef4444' }} onClick={() => setUsername('')} title="Disconnect LeetCode">
              Disconnect
            </button>
          </div>
        )}
      </div>

      {fetchError && (
        <div style={{ padding: '0.75rem', background: '#ef444415', border: '2px solid #ef444430', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-lg)' }}>
          ⚠️ {fetchError}
        </div>
      )}

      {/* LeetCode Connection / Overview Section */}
      {!leetcodeUsername ? (
        <motion.div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: 'var(--space-xl)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Code2 size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Connect LeetCode</h3>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Enter your LeetCode username to automatically pull your solved stats and track your progress.
          </p>
          <form onSubmit={handleConnect} style={{ display: 'flex', gap: '0.5rem', maxWidth: 400, margin: '0 auto' }}>
            <input
              type="text"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              placeholder="e.g. neetcode"
              className="input-primary"
              required
            />
            <button type="submit" className="btn-primary" disabled={isFetching}>
              {isFetching ? 'Connecting...' : 'Connect'}
            </button>
          </form>
        </motion.div>
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
            <StatsCard
              icon={Trophy}
              label="Total Solved"
              value={leetcodeStats?.totalSolved || 0}
              subtitle={leetcodeStats ? `Rank: ${leetcodeStats.ranking.toLocaleString()}` : 'Syncing...'}
              color="#06b6d4"
            />
            <StatsCard
              icon={Target}
              label="Roadmap Mastery"
              value={`${masteredTopics}/${roadmap.length}`}
              subtitle={`${learningTopics} currently learning`}
              color="var(--accent-primary)"
              delay={0.1}
            />
            <StatsCard
              icon={GitCommit}
              label="Reputation"
              value={leetcodeStats?.reputation || 0}
              subtitle={`${leetcodeStats?.contributionPoint || 0} contributions`}
              color="#f59e0b"
              delay={0.2}
            />
          </div>

          {leetcodeStats && (
            <motion.div className="glass-card" style={{ marginBottom: 'var(--space-xl)', padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', itemsCenter: 'center', gap: 8 }}><TrendingUp size={18} /> Difficulty Breakdown</h3>
                <span className="badge badge-gray" style={{ fontSize: '10px' }}>@{leetcodeUsername}</span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '2px solid #1cbab330' }}>
                    <div style={{ color: '#1cbab3', fontWeight: 700, fontSize: 'var(--font-sm)', marginBottom: 4 }}>Easy</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{leetcodeStats.easySolved} <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {leetcodeStats.totalEasy}</span></div>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '2px solid #ffb70030' }}>
                    <div style={{ color: '#ffb700', fontWeight: 700, fontSize: 'var(--font-sm)', marginBottom: 4 }}>Medium</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{leetcodeStats.mediumSolved} <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {leetcodeStats.totalMedium}</span></div>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '2px solid #f6373730' }}>
                    <div style={{ color: '#f63737', fontWeight: 700, fontSize: 'var(--font-sm)', marginBottom: 4 }}>Hard</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{leetcodeStats.hardSolved} <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {leetcodeStats.totalHard}</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Navigation Cards */}
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}><Code2 size={18} /> Tools</h3>
      <div className="grid-2">
        <Link to="/dsa/roadmap" className="glass-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}>
          <div style={{ width: 48, height: 48, background: 'var(--accent-primary)20', color: 'var(--accent-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>Structured Roadmap</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>Track 15 core structural patterns like NeetCode 150</div>
          </div>
        </Link>
        <Link to="/dsa/videos" className="glass-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}>
          <div style={{ width: 48, height: 48, background: '#ec489920', color: '#ec4899', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlaySquare size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>Tutorial Videos</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>Track YouTube lectures, playlists, and conceptual videos</div>
          </div>
        </Link>
      </div>
    </PageWrapper>
  );
}
