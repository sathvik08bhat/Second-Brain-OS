import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const daysUntil = (date) => {
  if (!date) return null;
  const now = new Date();
  const target = new Date(date);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getProgress = (completed, total) => {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateCGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;
  const totalCredits = grades.reduce((sum, g) => sum + (g.credits || 0), 0);
  if (totalCredits === 0) return 0;
  const weightedSum = grades.reduce((sum, g) => sum + (g.gradePoint || 0) * (g.credits || 0), 0);
  return (weightedSum / totalCredits).toFixed(2);
};

export const gradePoints = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

export const statusColors = {
  'todo': 'var(--text-tertiary)',
  'in-progress': 'var(--accent-yellow)',
  'done': 'var(--accent-green)',
  'submitted': 'var(--accent-cyan)',
  'overdue': 'var(--accent-red)',
  'pending': 'var(--accent-yellow)',
  'completed': 'var(--accent-green)',
  'active': 'var(--accent-green)',
  'inactive': 'var(--text-tertiary)',
};

export const semesterOptions = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
  { value: 3, label: 'Semester 3' },
  { value: 4, label: 'Semester 4' },
  { value: 5, label: 'Semester 5' },
  { value: 6, label: 'Semester 6' },
  { value: 7, label: 'Semester 7' },
  { value: 8, label: 'Semester 8' },
];

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const chartColors = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#3b82f6', '#f97316', '#a78bfa', '#22d3ee'
];
