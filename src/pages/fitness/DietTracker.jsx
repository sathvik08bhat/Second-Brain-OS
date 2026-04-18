import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Plus, Trash2, Edit3, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/shared/Modal';
import { useFitnessStore } from '../../store/fitnessStore';
import { formatDate } from '../../utils/helpers';

export default function DietTracker() {
  const { meals, addMeal, updateMeal, deleteMeal } = useFitnessStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], mealType: 'lunch', food: '', calories: '', protein: '', carbs: '', fats: '' });

  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, calories: Number(form.calories), protein: Number(form.protein || 0), carbs: Number(form.carbs || 0), fats: Number(form.fats || 0) };
    if (editId) updateMeal(editId, data); else addMeal(data);
    resetForm();
  };
  const resetForm = () => { setForm({ date: filterDate, mealType: 'lunch', food: '', calories: '', protein: '', carbs: '', fats: '' }); setEditId(null); setShowModal(false); };
  const startEdit = (d) => { setForm({ date: d.date, mealType: d.mealType, food: d.food, calories: d.calories, protein: d.protein || '', carbs: d.carbs || '', fats: d.fats || '' }); setEditId(d.id); setShowModal(true); };

  const dayLogs = meals.filter(d => d.date === filterDate);
  const totalCals = dayLogs.reduce((s, d) => s + d.calories, 0);
  const totalProtein = dayLogs.reduce((s, d) => s + (d.protein || 0), 0);
  const totalCarbs = dayLogs.reduce((s, d) => s + (d.carbs || 0), 0);
  const totalFats = dayLogs.reduce((s, d) => s + (d.fats || 0), 0);

  const macroData = [
    { name: 'Protein', value: totalProtein * 4 },
    { name: 'Carbs', value: totalCarbs * 4 },
    { name: 'Fats', value: totalFats * 9 }
  ].filter(d => d.value > 0);
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

  const mealColors = { breakfast: 'badge-yellow', lunch: 'badge-green', dinner: 'badge-blue', snack: 'badge-purple' };

  return (
    <PageWrapper>
      <div className="page-header">
        <h1><span className="gradient-text">🥗 Diet Tracker</span></h1>
        <p>Log your meals, track calories, and monitor macros</p>
        <div className="header-actions">
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }} />
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Meal</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Total Calories</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-cyan)' }}>{totalCals}</div></div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Protein</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#ef4444' }}>{totalProtein}g</div></div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Carbs</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#f59e0b' }}>{totalCarbs}g</div></div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Fats</div><div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#3b82f6' }}>{totalFats}g</div></div>
      </div>

      <div className="grid-2">
        <div className="glass-card" style={{ padding: '0' }}>
          <table className="data-table">
            <thead><tr><th>Meal</th><th>Food</th><th>Cals</th><th>Actions</th></tr></thead>
            <tbody>
              {dayLogs.map((log, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td><span className={`badge ${mealColors[log.mealType]}`}>{log.mealType}</span></td>
                  <td style={{ fontWeight: 600 }}>{log.food}</td>
                  <td style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{log.calories}</td>
                  <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn-icon" onClick={() => startEdit(log)}><Edit3 size={15} /></button><button className="btn-icon" onClick={() => deleteMeal(log.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={15} /></button></div></td>
                </motion.tr>
              ))}
              {dayLogs.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No meals logged for this day.</td></tr>}
            </tbody>
          </table>
        </div>

        {macroData.length > 0 && (
          <motion.div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700, alignSelf: 'flex-start' }}>Macro Split (Calories)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f0f5' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editId ? 'Edit Meal' : 'Log Meal'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="form-group"><label>Meal Type</label><select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select></div>
            <div className="form-group full-width"><label>Food Item *</label><input value={form.food} onChange={(e) => setForm({ ...form, food: e.target.value })} required placeholder="e.g. Chicken breast with rice" /></div>
            <div className="form-group full-width"><label>Calories</label><input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} required /></div>
            <div className="form-group"><label>Protein (g)</label><input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} /></div>
            <div className="form-group"><label>Carbs (g)</label><input type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} /></div>
            <div className="form-group"><label>Fats (g)</label><input type="number" value={form.fats} onChange={(e) => setForm({ ...form, fats: e.target.value })} /></div>
          </div>
          <div className="modal-actions"><button type="submit" className="btn-primary"><Check size={16} /> Save</button></div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
