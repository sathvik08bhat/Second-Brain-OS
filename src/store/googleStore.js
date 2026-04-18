import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────
// Replace with your own Google Cloud OAuth Client ID
// https://console.cloud.google.com/apis/credentials
// ─────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks';

export const useGoogleStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      userEmail: null,
      tokenExpiry: null,
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
        });
      },

      isTokenValid: () => {
        const { accessToken, tokenExpiry } = get();
        return accessToken && tokenExpiry && Date.now() < tokenExpiry;
      },

      setSyncPreference: (key, value) => set((s) => ({
        syncPreferences: { ...s.syncPreferences, [key]: value }
      })),

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
              { method: 'popup', minutes: 1440 }, // 1 day
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

        // Get default task list
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

      completeGoogleTask: async (taskListId, taskId) => {
        const { accessToken, isTokenValid } = get();
        if (!isTokenValid()) throw new Error('Not authenticated');

        const listId = taskListId || (await get().getDefaultTaskListId());

        await fetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'completed' }),
        });
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
