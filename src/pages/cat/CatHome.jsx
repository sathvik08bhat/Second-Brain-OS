import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Target, FileText, BookOpen, AlertCircle, 
  Brain, Clock, Crosshair, TrendingUp, Calculator
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useCatStore } from '../../store/catStore';

const syllabusData = [
  { id: '1', name: 'Arithmetic', weight: 40, status: 'in-progress', section: 'QA' },
  { id: '2', name: 'Algebra', weight: 30, status: 'pending', section: 'QA' },
  { id: '3', name: 'Geometry', weight: 15, status: 'completed', section: 'QA' },
  { id: '4', name: 'Data Interpretation', weight: 50, status: 'in-progress', section: 'DILR' },
  { id: '5', name: 'Logical Reasoning', weight: 50, status: 'completed', section: 'DILR' },
  { id: '6', name: 'Reading Comprehension', weight: 70, status: 'pending', section: 'VARC' },
  { id: '7', name: 'Verbal Ability', weight: 30, status: 'in-progress', section: 'VARC' },
];

const mockBalanceData = [
  { section: 'QA', score: 95, fullMark: 100 },
  { section: 'DILR', score: 72, fullMark: 100 },
  { section: 'VARC', score: 88, fullMark: 100 },
];

const timeDistributionData = [
  { name: 'Mock 1', 'Correct': 20, 'Incorrect': 15, 'Unattempted': 5 },
  { name: 'Mock 2', 'Correct': 25, 'Incorrect': 10, 'Unattempted': 5 },
  { name: 'Mock 3', 'Correct': 22, 'Incorrect': 12, 'Unattempted': 6 },
  { name: 'Mock 4', 'Correct': 30, 'Incorrect': 8, 'Unattempted': 2 },
];

const colors = {
  QA: '#f59e0b',
  DILR: '#3b82f6',
  VARC: 'var(--accent-primary)',
  correct: '#10b981',
  incorrect: '#ef4444',
  unattempted: '#6b7280'
};

export default function CatHome() {
  const { mockTests } = useCatStore();
  const [activeSection, setActiveSection] = useState('All');

  const filteredSyllabus = activeSection === 'All' ? syllabusData : syllabusData.filter(s => s.section === activeSection);

  const getStatusColor = (status) => {
    if(status === 'completed') return '#10b981';
    if(status === 'in-progress') return '#f59e0b';
    return 'var(--border-primary)';
  };

  return (
    <PageWrapper>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <h1><span className="gradient-text">🎯 CAT 2027 Dashboard</span></h1>
            <p>Advanced metrics, syllabus knowledge graph, and analytics</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
             <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Days Left</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-red)' }}>524</span>
             </div>
             <button className="btn-secondary"><Calculator size={16} /> Virtual Calc</button>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr minmax(280px, 320px)', gap: 'var(--space-lg)', minHeight: 'calc(100vh - 180px)' }}>
        
        {/* Left Column: Syllabus Tree */}
        <section className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-glass)' }}>
            <h3 style={{ fontSize: 'var(--font-md)', display: 'flex', alignItems: 'center', gap: 6 }}><Brain size={18} /> Syllabus Map</h3>
            <div style={{ display: 'flex', gap: 4, marginTop: '0.75rem' }}>
              {['All', 'QA', 'DILR', 'VARC'].map(sec => (
                <button key={sec} onClick={() => setActiveSection(sec)} style={{ flex: 1, padding: '0.2rem', fontSize: '10px', background: activeSection === sec ? 'var(--accent-purple-light)' : 'var(--bg-secondary)', border: 'none', borderRadius: 4, color: activeSection === sec ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>{sec}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '1rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredSyllabus.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: `1px solid ${getStatusColor(item.status)}40` }}>
                 <div style={{ width: 12, height: 12, borderRadius: '50%', background: getStatusColor(item.status), border: '2px solid var(--bg-card)' }} />
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{item.name}</div>
                   <div style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>Weight: {item.weight}%</div>
                 </div>
                 <div className="badge" style={{ background: `${colors[item.section]}20`, color: colors[item.section], fontSize: '9px' }}>{item.section}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Center Column: Focus Area & Graphs */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="glass-card" id="accuracy-gauge" style={{ padding: '1.25rem', textAlign: 'center' }}>
                 <Crosshair size={24} style={{ color: colors.correct, marginBottom: '0.5rem' }} />
                 <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>82<span style={{ fontSize: '1rem' }}>%</span></div>
                 <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>TITA Accuracy</div>
              </div>
              <div className="glass-card" id="seconds-per-q" style={{ padding: '1.25rem', textAlign: 'center' }}>
                 <Clock size={24} style={{ color: colors.QA, marginBottom: '0.5rem' }} />
                 <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>114<span style={{ fontSize: '1rem' }}>s</span></div>
                 <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Avg Time / Correct Q</div>
              </div>
              <div className="glass-card" id="score-visualizer" style={{ padding: '1.25rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0,0,0,0))' }}>
                 <TrendingUp size={24} style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem' }} />
                 <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-purple-light)' }}>98.4</div>
                 <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Predicted %ile</div>
              </div>
           </div>

           <div className="glass-card" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ fontSize: 'var(--font-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}><BarChart3 size={18} /> Time Matrix (Last 4 Mocks)</h3>
             <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={timeDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#6b6b80', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#6b6b80', fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Correct" stackId="a" fill={colors.correct} />
                  <Bar dataKey="Incorrect" stackId="a" fill={colors.incorrect} />
                  <Bar dataKey="Unattempted" stackId="a" fill={colors.unattempted} />
                </BarChart>
             </ResponsiveContainer>
           </div>

        </section>

        {/* Right Column: Sectional Balance & Error Log */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
           
           <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-sm)', width: '100%', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}><Target size={14} /> Sectional Radar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockBalanceData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="section" tick={{ fill: 'var(--accent-primary)', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Student" dataKey="score" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.4} />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
           </div>

           <div className="glass-card" id="error-analysis" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-glass)' }}>
                <h3 style={{ fontSize: 'var(--font-sm)', display: 'flex', alignItems: 'center', gap: 6 }}><AlertCircle size={14} /> Error Log & Weaknesses</h3>
              </div>
              <div style={{ padding: '1rem', overflowY: 'auto' }}>
                 {[
                   { topic: 'SI/CI & Installments', type: 'Formula Error', count: 4 },
                   { topic: 'Para-jumbles', type: 'Logic Flow', count: 7 },
                   { topic: 'Games & Tournaments', type: 'Unattempted Threat', count: 12 },
                 ].map((err, i) => (
                   <div key={i} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600 }}>{err.topic}</span>
                        <span style={{ color: 'var(--accent-red)' }}>{err.count} errors</span>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>Root cause: {err.type}</div>
                      <div style={{ width: '100%', background: 'var(--bg-secondary)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
                         <div style={{ width: `${Math.min(err.count * 10, 100)}%`, background: 'var(--accent-red)', height: '100%' }} />
                      </div>
                   </div>
                 ))}
                 
                 <button className="btn-secondary" style={{ width: '100%', fontSize: '10px', marginTop: '1rem' }}>+ Log New Error</button>
              </div>
           </div>

        </section>
      </div>
    </PageWrapper>
  );
}
