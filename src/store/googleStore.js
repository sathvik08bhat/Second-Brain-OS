import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────
// Replace with your own Google Cloud OAuth Client ID
// https://console.cloud.google.com/apis/credentials
// ─────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = '535881900428-smoieu90ov1ejv0kupbtj027rij7kvfs.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks';

export const useGoogleStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      userEmail: null,
      tokenExpiry: null,
      calendarEvents: [],
      googleTasks: [],
      lastFetched: null,
      syncPreferences: {
        autoSyncTasks: false,
        autoSyncAiml: false,
        autoSyncAcademics: false,
      },

      // ── Auth ──
      signIn: () => {
        return new Promise((resolve, reject) => {
          if (!window.google?.accounts?.oauth2) {
            reject(new Error('Google Identity Services not loaded. Check your internet connection.'));
            return;
          }

          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
              if (response.error) {
                reject(response);
                return;
              }
              set({
                isAuthenticated: true,
                accessToken: response.access_token,
                tokenExpiry: Date.now() + (response.expires_in * 1000),
              });

              // Fetch user info
              fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              })
                .then(r => r.json())
                .then(info => set({ userEmail: info.email }))
                .catch(() => {});

              resolve(response);
            },
          });

          tokenClient.requestAccessToken();
        });
      },

      signOut: () => {
        const token = get().accessToken;
        if (token && window.google?.accounts?.oauth2) {
          window.google.accounts.oauth2.revoke(token);
        }
        set({
          isAuthenticated: false,
          accessToken: null,
          userEmail: null,
          tokenExpiry: null,
          calendarEvents: [],
          googleTasks: [],
        });
      },

      isTokenValid: () => {
        const { accessToken, tokenExpiry } = get();
        return accessToken && tokenExpiry && Date.now() < tokenExpiry;
      },

      setSyncPreference: (key, value) => set((s) => ({
        syncPreferences: { ...s.syncPreferences, [key]: value }
      })),

      // ── Fetch Calendar Events ──
      fetchCalendarEvents: async (timeMin, timeMax) => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        const now = new Date();
        const min = timeMin || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const max = timeMax || new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

        const params = new URLSearchParams({
          timeMin: min,
          timeMax: max,
          singleEvents: 'true',
          orderBy: 'startTime',
          maxResults: '100',
        });

        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || 'Failed to fetch events');
        }

        const data = await res.json();
        const events = (data.items || []).map(e => ({
          id: e.id,
          title: e.summary || '(No title)',
          description: e.description || '',
          start: e.start?.dateTime || e.start?.date || '',
          end: e.end?.dateTime || e.end?.date || '',
          allDay: !e.start?.dateTime,
          color: e.colorId || null,
          htmlLink: e.htmlLink,
          status: e.status,
        }));

        set({ calendarEvents: events, lastFetched: Date.now() });
        return events;
      },

      // ── Fetch Google Tasks ──
      fetchGoogleTasks: async () => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        const listsRes = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const listsData = await listsRes.json();
        const lists = listsData.items || [];

        let allTasks = [];
        for (const list of lists) {
          const res = await fetch(`https://www.googleapis.com/tasks/v1/lists/${list.id}/tasks?maxResults=100&showCompleted=true`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!res.ok) continue;
          const data = await res.json();
          const tasks = (data.items || []).map(t => ({
            id: t.id,
            listId: list.id,
            listName: list.title,
            title: t.title || '(No title)',
            notes: t.notes || '',
            due: t.due || null,
            status: t.status, // 'needsAction' or 'completed'
            completed: t.status === 'completed',
            updated: t.updated,
          }));
          allTasks = [...allTasks, ...tasks];
        }

        // Sort: incomplete first, then by due date
        allTasks.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          if (a.due && b.due) return new Date(a.due) - new Date(b.due);
          if (a.due) return -1;
          return 1;
        });

        set({ googleTasks: allTasks, lastFetched: Date.now() });
        return allTasks;
      },

      // ── Google Calendar ──
      createCalendarEvent: async ({ title, description, startDate, endDate, colorId }) => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        const event = {
          summary: title,
          description: description || '',
          start: {
            dateTime: new Date(startDate).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endDate
              ? new Date(endDate).toISOString()
              : new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 30 },
              { method: 'popup', minutes: 1440 },
            ],
          },
        };

        if (colorId) event.colorId = colorId;

        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || 'Failed to create calendar event');
        }

        return res.json();
      },

      deleteCalendarEvent: async (eventId) => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      },

      // ── Google Tasks ──
      createGoogleTask: async ({ title, notes, dueDate }) => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        const listsRes = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const listsData = await listsRes.json();
        const defaultListId = listsData.items?.[0]?.id;

        if (!defaultListId) throw new Error('No task list found');

        const task = {
          title,
          notes: notes || '',
        };

        if (dueDate) {
          task.due = new Date(dueDate).toISOString();
        }

        const res = await fetch(`https://www.googleapis.com/tasks/v1/lists/${defaultListId}/tasks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || 'Failed to create task');
        }

        return res.json();
      },

      toggleGoogleTaskComplete: async (listId, taskId, currentlyCompleted) => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        await fetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: currentlyCompleted ? 'needsAction' : 'completed' }),
        });

        // Refresh tasks after toggle
        await get().fetchGoogleTasks();
      },

      getDefaultTaskListId: async () => {
        const { accessToken } = get();
        const res = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        return data.items?.[0]?.id;
      },
    }),
    {
      name: 'google-store',
      partialize: (state) => ({
        syncPreferences: state.syncPreferences,
        // Don't persist tokens — they expire and should be refreshed
      }),
    }
  )
);
