import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

const DEFAULT_ROADMAP = [
  { id: '1', title: 'Arrays & Hashing', status: 'not_started', deadline: null },
  { id: '2', title: 'Two Pointers', status: 'not_started', deadline: null },
  { id: '3', title: 'Sliding Window', status: 'not_started', deadline: null },
  { id: '4', title: 'Stack', status: 'not_started', deadline: null },
  { id: '5', title: 'Binary Search', status: 'not_started', deadline: null },
  { id: '6', title: 'Linked List', status: 'not_started', deadline: null },
  { id: '7', title: 'Trees', status: 'not_started', deadline: null },
  { id: '8', title: 'Tries', status: 'not_started', deadline: null },
  { id: '9', title: 'Backtracking', status: 'not_started', deadline: null },
  { id: '10', title: 'Graphs', status: 'not_started', deadline: null },
  { id: '11', title: 'Advanced Graphs', status: 'not_started', deadline: null },
  { id: '12', title: '1-D Dynamic Programming', status: 'not_started', deadline: null },
  { id: '13', title: '2-D Dynamic Programming', status: 'not_started', deadline: null },
  { id: '14', title: 'Greedy', status: 'not_started', deadline: null },
  { id: '15', title: 'Math & Geometry', status: 'not_started', deadline: null },
  { id: '16', title: 'Bit Manipulation', status: 'not_started', deadline: null },
];

export const useDsaStore = create(
  persist(
    (set, get) => ({
      leetcodeUsername: '',
      leetcodeStats: null,
      lastFetched: null,
      fetchError: null,
      isFetching: false,
      
      roadmap: DEFAULT_ROADMAP,
      videos: [],

      setUsername: (username) => set({ leetcodeUsername: username }),

      fetchLeetCodeStats: async () => {
        const username = get().leetcodeUsername;
        if (!username) {
          set({ fetchError: 'Please enter a username first.' });
          return;
        }

        set({ isFetching: true, fetchError: null });

        try {
          const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
          if (!res.ok) throw new Error('Failed to fetch from LeetCode API');
          
          const data = await res.json();
          if (data.errors) throw new Error(data.errors[0]?.message || 'User not found');

          set({ 
            leetcodeStats: {
              totalSolved: data.totalSolved || 0,
              totalQuestions: data.totalQuestions || 0,
              easySolved: data.easySolved || 0,
              totalEasy: data.totalEasy || 0,
              mediumSolved: data.mediumSolved || 0,
              totalMedium: data.totalMedium || 0,
              hardSolved: data.hardSolved || 0,
              totalHard: data.totalHard || 0,
              ranking: data.ranking || 0,
              reputation: data.reputation || 0,
              contributionPoint: data.contributionPoint || 0,
            },
            lastFetched: new Date().toISOString(),
            isFetching: false
          });
        } catch (error) {
          set({
            isFetching: false,
            fetchError: error.message || 'Error fetching LeetCode stats',
          });
        }
      },

      // Roadmap
      updateRoadmapTopic: (id, updates) => set((state) => ({
        roadmap: state.roadmap.map(topic => 
          topic.id === id ? { ...topic, ...updates } : topic
        )
      })),

      // Videos Tracker
      addVideo: (video) => set((state) => ({
        videos: [{
          id: generateId(),
          createdAt: new Date().toISOString(),
          title: '',
          url: '',
          channel: '',
          completed: false,
          notes: '',
          ...video
        }, ...state.videos]
      })),
      
      updateVideo: (id, updates) => set((state) => ({
        videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter(v => v.id !== id)
      })),

    }),
    {
      name: 'dsa-store',
      partialize: (state) => ({
        leetcodeUsername: state.leetcodeUsername,
        leetcodeStats: state.leetcodeStats,
        lastFetched: state.lastFetched,
        roadmap: state.roadmap,
        videos: state.videos,
      }),
    }
  )
);
