import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

const LEADERSHIP_ASPECTS = [
  { key: 'communication', label: 'Communication', emoji: '🗣️', color: '#3b82f6', description: 'Clear, persuasive, and empathetic communication' },
  { key: 'decisionMaking', label: 'Decision Making', emoji: '⚖️', color: '#f59e0b', description: 'Analytical thinking and confident decision-making' },
  { key: 'teamManagement', label: 'Team Management', emoji: '👥', color: '#10b981', description: 'Building, motivating, and leading teams effectively' },
  { key: 'publicSpeaking', label: 'Public Speaking', emoji: '🎤', color: '#ef4444', description: 'Presenting ideas confidently to audiences' },
  { key: 'conflictResolution', label: 'Conflict Resolution', emoji: '🤝', color: '#06b6d4', description: 'Mediating disputes and finding win-win solutions' },
  { key: 'emotionalIntelligence', label: 'Emotional Intelligence', emoji: '❤️', color: '#ec4899', description: 'Understanding and managing own and others\' emotions' },
  { key: 'strategicThinking', label: 'Strategic Thinking', emoji: '♟️', color: '#8b5cf6', description: 'Long-term vision and planning' },
  { key: 'delegation', label: 'Delegation', emoji: '📋', color: '#f97316', description: 'Assigning tasks effectively and trusting team members' },
  { key: 'mentoring', label: 'Mentoring', emoji: '🧑‍🏫', color: '#22d3ee', description: 'Guiding and developing others' },
  { key: 'timeManagement', label: 'Time Management', emoji: '⏰', color: '#a855f7', description: 'Prioritization and efficient use of time' },
  { key: 'adaptability', label: 'Adaptability', emoji: '🔄', color: '#14b8a6', description: 'Flexibility in changing situations' },
  { key: 'accountability', label: 'Accountability', emoji: '✅', color: '#84cc16', description: 'Taking ownership and keeping commitments' },
];

const LEADERSHIP_RESOURCES = {
  communication: [
    { title: 'Active Listening Framework', description: 'Listen → Reflect → Clarify → Respond. Resist urge to fix.', type: 'technique' },
    { title: 'Nonviolent Communication (NVC)', description: 'Observation → Feeling → Need → Request. No blame, pure clarity.', type: 'framework' },
    { title: 'STAR Storytelling', description: 'Situation, Task, Action, Result — for impactful narratives.', type: 'technique' },
  ],
  decisionMaking: [
    { title: 'Eisenhower Matrix', description: 'Urgent/Important grid for prioritization.', type: 'framework' },
    { title: 'Pre-Mortem Analysis', description: 'Imagine the decision failed — what went wrong? Fix before it happens.', type: 'technique' },
    { title: '10/10/10 Rule', description: 'How will I feel about this in 10 minutes, 10 months, 10 years?', type: 'technique' },
  ],
  teamManagement: [
    { title: 'Tuckman\'s Stages', description: 'Forming → Storming → Norming → Performing → Adjourning', type: 'framework' },
    { title: 'One-on-One Template', description: 'Regular 1:1s: Wins, blockers, growth, personal check-in.', type: 'template' },
    { title: 'Psychological Safety', description: 'Create environment where team feels safe to take risks and speak up.', type: 'concept' },
  ],
  publicSpeaking: [
    { title: 'Rule of Three', description: 'Structure presentations around 3 main points for retention.', type: 'technique' },
    { title: 'Power Pose Before Speaking', description: '2 min of expansive posture reduces cortisol, boosts testosterone.', type: 'technique' },
    { title: 'Toastmasters Method', description: 'Practice with structure: Table Topics, prepared speeches, evaluations.', type: 'method' },
  ],
  conflictResolution: [
    { title: 'Thomas-Kilmann Model', description: 'Competing, Collaborating, Compromising, Avoiding, Accommodating — choose wisely.', type: 'framework' },
    { title: 'Interest-Based Negotiation', description: 'Focus on interests, not positions. "Why do you want X?" not "What do you want?"', type: 'technique' },
  ],
  emotionalIntelligence: [
    { title: 'Self-Awareness Journal', description: 'Daily: What emotion did I feel? What triggered it? How did I respond?', type: 'practice' },
    { title: 'Empathy Mapping', description: 'What does the person Think, Feel, Say, Do? Understand before responding.', type: 'technique' },
  ],
  strategicThinking: [
    { title: 'SWOT Analysis', description: 'Strengths, Weaknesses, Opportunities, Threats — for any decision.', type: 'framework' },
    { title: 'Second-Order Thinking', description: 'Then what? Consider the consequences of consequences.', type: 'technique' },
  ],
  delegation: [
    { title: 'RACI Matrix', description: 'Responsible, Accountable, Consulted, Informed — clear ownership.', type: 'framework' },
    { title: '70% Rule', description: 'If someone can do it 70% as well as you, delegate it.', type: 'principle' },
  ],
  mentoring: [
    { title: 'GROW Model', description: 'Goal → Reality → Options → Will — coaching conversation framework.', type: 'framework' },
    { title: 'Ask, Don\'t Tell', description: 'Guide through questions, not answers. Build independent thinkers.', type: 'principle' },
  ],
  timeManagement: [
    { title: 'Time Audit', description: 'Track every 30 min for a week. Find where time actually goes.', type: 'practice' },
    { title: 'Eat the Frog', description: 'Do the hardest task first when willpower is highest.', type: 'technique' },
    { title: 'Parkinson\'s Law', description: 'Work expands to fill time available. Set tighter deadlines.', type: 'principle' },
  ],
  adaptability: [
    { title: 'OODA Loop', description: 'Observe → Orient → Decide → Act. Rapid adaptation cycle.', type: 'framework' },
    { title: 'Scenario Planning', description: 'Plan for 3 outcomes: best case, worst case, most likely.', type: 'technique' },
  ],
  accountability: [
    { title: 'Weekly Review', description: 'What did I commit to? What did I deliver? What fell through?', type: 'practice' },
    { title: 'Public Commitment', description: 'Tell someone your goal to increase follow-through by 65%.', type: 'technique' },
  ],
};

export { LEADERSHIP_ASPECTS, LEADERSHIP_RESOURCES };

export const useLeadershipStore = create(
  persist(
    (set, get) => ({
      assessments: [],    // [{ id, date, ratings: { communication: 7, ... }, notes }]
      activities: [],     // [{ id, date, aspect, title, description, reflection, impact: 1-10 }]
      goals: [],          // [{ id, aspect, title, targetDate, status, milestones: [] }]

      // ── Self-Assessment ──
      addAssessment: (assessment) => set((state) => ({
        assessments: [...state.assessments, { id: generateId(), date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), ...assessment }]
      })),

      deleteAssessment: (id) => set((state) => ({
        assessments: state.assessments.filter(a => a.id !== id)
      })),

      // ── Activity Log ──
      addActivity: (activity) => set((state) => ({
        activities: [...state.activities, { id: generateId(), date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), impact: 5, ...activity }]
      })),

      updateActivity: (id, updates) => set((state) => ({
        activities: state.activities.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter(a => a.id !== id)
      })),

      // ── Goals ──
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { id: generateId(), status: 'active', milestones: [], createdAt: new Date().toISOString(), ...goal }]
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      // ── Analytics ──
      getLatestRatings: () => {
        const assessments = get().assessments;
        if (assessments.length === 0) return null;
        return assessments[assessments.length - 1].ratings;
      },

      getAspectTrend: (aspect, count = 10) => {
        return get().assessments
          .filter(a => a.ratings && a.ratings[aspect] != null)
          .slice(-count)
          .map(a => ({ date: a.date, value: a.ratings[aspect] }));
      },

      getOverallScore: () => {
        const latest = get().getLatestRatings();
        if (!latest) return 0;
        const values = Object.values(latest);
        return values.length > 0 ? Math.round(values.reduce((s, v) => s + v, 0) / values.length * 10) / 10 : 0;
      },

      getActivityCount: (aspect) => {
        return get().activities.filter(a => a.aspect === aspect).length;
      },
    }),
    { name: 'leadership-store' }
  )
);
