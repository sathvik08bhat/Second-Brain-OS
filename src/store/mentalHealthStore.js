import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

const MENTAL_HEALTH_ASPECTS = [
  { key: 'mood', label: 'Mood', emoji: '😊', color: '#f59e0b', description: 'Overall emotional state' },
  { key: 'stress', label: 'Stress Management', emoji: '🧘', color: '#ef4444', description: 'Ability to cope with pressure' },
  { key: 'sleep', label: 'Sleep Quality', emoji: '😴', color: '#6366f1', description: 'Rest and recovery quality' },
  { key: 'anxiety', label: 'Anxiety Level', emoji: '💭', color: '#f97316', description: 'Worry and nervousness levels (lower is better)' },
  { key: 'energy', label: 'Energy & Vitality', emoji: '⚡', color: '#10b981', description: 'Physical and mental energy' },
  { key: 'focus', label: 'Focus & Clarity', emoji: '🎯', color: '#3b82f6', description: 'Concentration and mental clarity' },
  { key: 'gratitude', label: 'Gratitude', emoji: '🙏', color: '#ec4899', description: 'Appreciation and thankfulness' },
  { key: 'social', label: 'Social Connection', emoji: '🤝', color: '#06b6d4', description: 'Relationships and belonging' },
  { key: 'selfEsteem', label: 'Self-Esteem', emoji: '💪', color: '#8b5cf6', description: 'Self-worth and confidence' },
  { key: 'emotionalRegulation', label: 'Emotional Regulation', emoji: '🧠', color: '#22c55e', description: 'Managing and expressing emotions' },
  { key: 'mindfulness', label: 'Mindfulness', emoji: '🕊️', color: '#14b8a6', description: 'Present-moment awareness' },
  { key: 'resilience', label: 'Resilience', emoji: '🛡️', color: '#a855f7', description: 'Ability to bounce back from setbacks' },
];

const IMPROVEMENT_RESOURCES = {
  stress: [
    { title: '4-7-8 Breathing Technique', type: 'technique', description: 'Inhale 4s, hold 7s, exhale 8s. Activates parasympathetic nervous system.', url: '' },
    { title: 'Progressive Muscle Relaxation', type: 'technique', description: 'Systematically tense and release muscle groups to reduce physical tension.', url: '' },
    { title: 'Box Breathing', type: 'technique', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Used by Navy SEALs for stress.', url: '' },
    { title: 'Journaling for Stress', type: 'practice', description: 'Write down worries to externalize them. Brain-dump technique.', url: '' },
    { title: 'Time Blocking', type: 'strategy', description: 'Reduce overwhelm by scheduling focused blocks of work.', url: '' },
  ],
  sleep: [
    { title: 'Sleep Hygiene Checklist', type: 'guide', description: 'No screens 1hr before, consistent schedule, cool dark room, no caffeine after 2pm.', url: '' },
    { title: 'Body Scan Meditation', type: 'technique', description: 'Progressive relaxation from toes to head before sleeping.', url: '' },
    { title: 'Sleep Restriction Therapy', type: 'strategy', description: 'Limit time in bed to improve sleep efficiency.', url: '' },
    { title: '10-3-2-1-0 Rule', type: 'guide', description: '10hr: no caffeine, 3hr: no food/alcohol, 2hr: no work, 1hr: no screens, 0: snooze presses', url: '' },
  ],
  mood: [
    { title: 'Gratitude Practice', type: 'practice', description: 'Write 3 things you\'re grateful for daily. Rewires brain for positivity.', url: '' },
    { title: 'Behavioral Activation', type: 'technique', description: 'Schedule enjoyable activities even when motivation is low.', url: '' },
    { title: 'Cognitive Reframing', type: 'technique', description: 'Challenge negative thoughts by finding alternative perspectives.', url: '' },
    { title: 'Exercise for Mood', type: 'practice', description: '20 minutes of cardio releases endorphins. Natural mood booster.', url: '' },
  ],
  anxiety: [
    { title: 'Grounding: 5-4-3-2-1 Technique', type: 'technique', description: '5 things you see, 4 hear, 3 touch, 2 smell, 1 taste.', url: '' },
    { title: 'Worry Window', type: 'strategy', description: 'Designate 15 min/day for worrying. Postpone anxious thoughts to this window.', url: '' },
    { title: 'Exposure Hierarchy', type: 'technique', description: 'Gradually face fears from least to most anxiety-provoking.', url: '' },
    { title: 'Cognitive Defusion', type: 'technique', description: 'Observe thoughts without engaging. "I notice I\'m having the thought that..."', url: '' },
  ],
  energy: [
    { title: 'Ultradian Rhythm Work', type: 'strategy', description: 'Work in 90-minute focus sessions, then take 20-min breaks.', url: '' },
    { title: 'Cold Exposure', type: 'practice', description: 'Cold showers for 30-60 seconds to boost alertness and dopamine.', url: '' },
    { title: 'Nutrition Optimization', type: 'guide', description: 'Protein-rich breakfast, hydration, avoiding sugar crashes.', url: '' },
    { title: 'Power Nap Protocol', type: 'technique', description: '10-20 min naps before 3pm for energy restoration.', url: '' },
  ],
  focus: [
    { title: 'Pomodoro Technique', type: 'technique', description: '25 min focused work, 5 min break. After 4 cycles, longer break.', url: '' },
    { title: 'Digital Minimalism', type: 'strategy', description: 'Limit notifications, use app blockers, create focused environment.', url: '' },
    { title: 'Single-Tasking', type: 'practice', description: 'One task at a time. Multitasking reduces efficiency by 40%.', url: '' },
    { title: 'Flow State Triggers', type: 'guide', description: 'Clear goals, immediate feedback, challenge-skill balance.', url: '' },
  ],
  gratitude: [
    { title: 'Morning Gratitude Journal', type: 'practice', description: 'Write 3 specific things you\'re grateful for every morning.', url: '' },
    { title: 'Gratitude Letter', type: 'practice', description: 'Write a letter thanking someone who impacted your life.', url: '' },
    { title: 'Gratitude Walk', type: 'practice', description: 'Walk mindfully, noticing things to be grateful for.', url: '' },
  ],
  social: [
    { title: 'Active Listening', type: 'technique', description: 'Focus fully on the speaker, reflect back what you hear.', url: '' },
    { title: 'Vulnerability Practice', type: 'practice', description: 'Share honestly about feelings with trusted people.', url: '' },
    { title: 'Social Energy Budgeting', type: 'strategy', description: 'Balance social activities with alone time based on your needs.', url: '' },
  ],
  selfEsteem: [
    { title: 'Self-Compassion Break', type: 'technique', description: 'Acknowledge suffering, remember common humanity, offer kindness to self.', url: '' },
    { title: 'Strengths Journaling', type: 'practice', description: 'Daily write one thing you did well or a quality you appreciate about yourself.', url: '' },
    { title: 'Boundary Setting', type: 'strategy', description: 'Learn to say no. Boundaries protect energy and self-respect.', url: '' },
    { title: 'Imposter Syndrome Toolkit', type: 'guide', description: 'Keep an achievement log. Reframe "I got lucky" to "I worked hard".', url: '' },
  ],
  emotionalRegulation: [
    { title: 'RAIN Technique', type: 'technique', description: 'Recognize, Allow, Investigate, Nurture your emotions.', url: '' },
    { title: 'Emotion Labeling', type: 'technique', description: 'Name your emotion precisely. "Naming it to tame it" — reduces amygdala activation.', url: '' },
    { title: 'Wise Mind Practice', type: 'technique', description: 'Balance emotional mind and rational mind for wise decisions.', url: '' },
  ],
  mindfulness: [
    { title: '5-Minute Meditation', type: 'practice', description: 'Focus on breath. When mind wanders, gently return. Start with just 5 minutes.', url: '' },
    { title: 'Mindful Eating', type: 'practice', description: 'Eat slowly, notice flavors, textures. No phone during meals.', url: '' },
    { title: 'Body Awareness Scan', type: 'technique', description: 'Notice physical sensations without judgment throughout the day.', url: '' },
  ],
  resilience: [
    { title: 'Growth Mindset Reframing', type: 'technique', description: 'Replace "I failed" with "I learned what doesn\'t work". Every setback is data.', url: '' },
    { title: 'Stress Inoculation', type: 'strategy', description: 'Deliberately take on small challenges to build tolerance for difficulty.', url: '' },
    { title: 'Post-Traumatic Growth Journal', type: 'practice', description: 'After setbacks, write what you learned and how you grew.', url: '' },
  ],
};

export { MENTAL_HEALTH_ASPECTS, IMPROVEMENT_RESOURCES };

export const useMentalHealthStore = create(
  persist(
    (set, get) => ({
      checkins: [],           // [{ id, date, ratings: { mood: 7, stress: 4, ... }, notes }]
      gratitudeEntries: [],   // [{ id, date, entries: ['...', '...', '...'] }]
      moodLogs: [],           // [{ id, date, mood: 'happy'|'sad'|..., note, intensity: 1-10 }]
      wellnessGoals: [],      // [{ id, aspect, targetScore, currentScore, strategies: [] }]
      meditationSessions: [], // [{ id, date, duration, type, notes }]
      therapyNotes: [],       // [{ id, date, topic, insights, actionItems }]

      // ── Daily Check-in ──
      addCheckin: (checkin) => set((state) => ({
        checkins: [...state.checkins, { id: generateId(), date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), ...checkin }]
      })),

      updateCheckin: (id, updates) => set((state) => ({
        checkins: state.checkins.map(c => c.id === id ? { ...c, ...updates } : c)
      })),

      deleteCheckin: (id) => set((state) => ({
        checkins: state.checkins.filter(c => c.id !== id)
      })),

      // ── Gratitude ──
      addGratitude: (entry) => set((state) => ({
        gratitudeEntries: [...state.gratitudeEntries, { id: generateId(), date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), ...entry }]
      })),

      deleteGratitude: (id) => set((state) => ({
        gratitudeEntries: state.gratitudeEntries.filter(g => g.id !== id)
      })),

      // ── Mood Logs ──
      addMoodLog: (log) => set((state) => ({
        moodLogs: [...state.moodLogs, { id: generateId(), date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), ...log }]
      })),

      deleteMoodLog: (id) => set((state) => ({
        moodLogs: state.moodLogs.filter(m => m.id !== id)
      })),

      // ── Wellness Goals ──
      addWellnessGoal: (goal) => set((state) => ({
        wellnessGoals: [...state.wellnessGoals, { id: generateId(), currentScore: 0, strategies: [], createdAt: new Date().toISOString(), ...goal }]
      })),

      updateWellnessGoal: (id, updates) => set((state) => ({
        wellnessGoals: state.wellnessGoals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),

      deleteWellnessGoal: (id) => set((state) => ({
        wellnessGoals: state.wellnessGoals.filter(g => g.id !== id)
      })),

      // ── Meditation Sessions ──
      addMeditationSession: (session) => set((state) => ({
        meditationSessions: [...state.meditationSessions, { id: generateId(), createdAt: new Date().toISOString(), ...session }]
      })),

      deleteMeditationSession: (id) => set((state) => ({
        meditationSessions: state.meditationSessions.filter(m => m.id !== id)
      })),

      // ── Analytics ──
      getAverageRatings: (days = 30) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const recent = get().checkins.filter(c => new Date(c.date) >= cutoff);
        if (recent.length === 0) return null;

        const totals = {};
        const counts = {};
        recent.forEach(c => {
          if (c.ratings) {
            Object.entries(c.ratings).forEach(([key, val]) => {
              totals[key] = (totals[key] || 0) + val;
              counts[key] = (counts[key] || 0) + 1;
            });
          }
        });

        const averages = {};
        Object.keys(totals).forEach(key => {
          averages[key] = Math.round((totals[key] / counts[key]) * 10) / 10;
        });
        return averages;
      },

      getCheckinTrend: (aspect, days = 30) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return get().checkins
          .filter(c => new Date(c.date) >= cutoff && c.ratings && c.ratings[aspect] != null)
          .map(c => ({ date: c.date, value: c.ratings[aspect] }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      },
    }),
    { name: 'mental-health-store' }
  )
);
