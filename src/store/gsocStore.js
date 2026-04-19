import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

export const useGsocStore = create(
  persist(
    (set, get) => ({
      skills: [],
      contributions: [],
      organizations: [],
      resources: [],
      applications: [],
      milestones: [],

      // Github Sync
      githubUsername: '',
      githubStats: null,
      isFetchingGithub: false,
      githubError: null,
      
      setGithubUsername: (username) => set({ githubUsername: username }),

      fetchGithubStats: async () => {
        const username = get().githubUsername;
        if (!username) {
          set({ githubError: 'Please enter a GitHub username.' });
          return;
        }

        set({ isFetchingGithub: true, githubError: null });

        try {
          // Fetch basic profile
          const userRes = await fetch(`https://api.github.com/users/${username}`);
          if (!userRes.ok) throw new Error('GitHub User not found');
          const userData = await userRes.json();

          // Fetch PR count manually via search API
          const prRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr+is:public`);
          const prData = prRes.ok ? await prRes.json() : { total_count: 0 };

          set({ 
            githubStats: {
              followers: userData.followers || 0,
              publicRepos: userData.public_repos || 0,
              totalPRs: prData.total_count || 0,
              avatar: userData.avatar_url || '',
              name: userData.name || username
            },
            isFetchingGithub: false
          });
        } catch (error) {
          set({
            isFetchingGithub: false,
            githubError: error.message || 'Error fetching GitHub stats',
          });
        }
      },

      // Skills
      addSkill: (skill) => set((s) => ({ skills: [...s.skills, { id: generateId(), createdAt: new Date().toISOString(), progress: 0, level: 'beginner', ...skill }] })),
      updateSkill: (id, u) => set((s) => ({ skills: s.skills.map((sk) => sk.id === id ? { ...sk, ...u } : sk) })),
      deleteSkill: (id) => set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id) })),

      // Contributions
      addContribution: (c) => set((s) => ({ contributions: [...s.contributions, { id: generateId(), createdAt: new Date().toISOString(), ...c }] })),
      updateContribution: (id, u) => set((s) => ({ contributions: s.contributions.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteContribution: (id) => set((s) => ({ contributions: s.contributions.filter((c) => c.id !== id) })),

      // Organizations
      addOrganization: (o) => set((s) => ({ organizations: [...s.organizations, { id: generateId(), createdAt: new Date().toISOString(), ...o }] })),
      updateOrganization: (id, u) => set((s) => ({ organizations: s.organizations.map((o) => o.id === id ? { ...o, ...u } : o) })),
      deleteOrganization: (id) => set((s) => ({ organizations: s.organizations.filter((o) => o.id !== id) })),

      // Resources
      addResource: (r) => set((s) => ({ resources: [...s.resources, { id: generateId(), createdAt: new Date().toISOString(), ...r }] })),
      updateResource: (id, u) => set((s) => ({ resources: s.resources.map((r) => r.id === id ? { ...r, ...u } : r) })),
      deleteResource: (id) => set((s) => ({ resources: s.resources.filter((r) => r.id !== id) })),

      // Applications
      addApplication: (a) => set((s) => ({ applications: [...s.applications, { id: generateId(), createdAt: new Date().toISOString(), ...a }] })),
      updateApplication: (id, u) => set((s) => ({ applications: s.applications.map((a) => a.id === id ? { ...a, ...u } : a) })),
      deleteApplication: (id) => set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),

      // Milestones
      addMilestone: (m) => set((s) => ({ milestones: [...s.milestones, { id: generateId(), createdAt: new Date().toISOString(), completed: false, ...m }] })),
      updateMilestone: (id, u) => set((s) => ({ milestones: s.milestones.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMilestone: (id) => set((s) => ({ milestones: s.milestones.filter((m) => m.id !== id) })),
    }),
    { 
      name: 'gsoc-store',
      partialize: (state) => ({
        skills: state.skills,
        contributions: state.contributions,
        organizations: state.organizations,
        resources: state.resources,
        applications: state.applications,
        milestones: state.milestones,
        githubUsername: state.githubUsername,
        githubStats: state.githubStats,
      })
    }
  )
);
