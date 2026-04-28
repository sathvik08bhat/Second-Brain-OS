import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import MobileNavbar from './components/layout/MobileNavbar';
import PageWrapper from './components/layout/PageWrapper';
import ErrorBoundary from './components/shared/ErrorBoundary';

import Modal from './components/shared/Modal';
import { useGlobalStore } from './store/globalStore';
import { useGoogleStore } from './store/googleStore';
import { useSyncStore, initAutoSync } from './store/syncStore';

// Overview
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/notes/NotesPage';

// Tasks
import TasksPage from './pages/tasks/TasksPage';
import TaskStatsPage from './pages/tasks/TaskStatsPage';

// Focus
import FocusMode from './pages/focus/FocusMode';
import FocusStatsPage from './pages/focus/FocusStatsPage';

// Journal
import DailyJournal from './pages/journal/DailyJournal';
import JournalInsightsPage from './pages/journal/JournalInsightsPage';

// Calendar
import GoogleIntegration from './pages/settings/GoogleIntegration';
import CalendarPage from './pages/settings/CalendarPage';
import TimeAnalyticsPage from './pages/calendar/TimeAnalyticsPage';

// Academics
import AcademicsHome from './pages/academics/AcademicsHome';
import Subjects from './pages/academics/Subjects';
import CGPATracker from './pages/academics/CGPATracker';
import ExamTracker from './pages/academics/ExamTracker';
import AssignmentTracker from './pages/academics/AssignmentTracker';
import AttendanceTracker from './pages/academics/AttendanceTracker';
import Resources from './pages/academics/Resources';
import AssessmentsDashboard from './pages/academics/AssessmentsDashboard';

// AI/ML
import AimlHome from './pages/aiml/AimlHome';
import AimlRoadmap from './pages/aiml/AimlRoadmap';
import AimlCourses from './pages/aiml/AimlCourses';
import AimlProjects from './pages/aiml/AimlProjects';
import AimlPapers from './pages/aiml/AimlPapers';

// GSoC
import GsocHome from './pages/gsoc/GsocHome';
import GsocSkills from './pages/gsoc/GsocSkills';
import GsocContributions from './pages/gsoc/GsocContributions';
import GsocOrganizations from './pages/gsoc/GsocOrganizations';

// CAT
import CatHome from './pages/cat/CatHome';
import CatSections from './pages/cat/CatSections';
import CatMocks from './pages/cat/CatMocks';
import CatResources from './pages/cat/CatResources';

// Placements
import PlacementsHome from './pages/placements/PlacementsHome';
import PlacementSkills from './pages/placements/PlacementSkills';
import Companies from './pages/placements/Companies';

// DSA Hub
import DsaHome from './pages/dsa/DsaHome';
import DsaRoadmap from './pages/dsa/DsaRoadmap';
import DsaVideos from './pages/dsa/DsaVideos';

// Startup
import StartupHome from './pages/startup/StartupHome';
import StartupDatabase from './pages/startup/StartupDatabase';
import IdeaLab from './pages/startup/IdeaLab';
import SprintBoard from './pages/startup/SprintBoard';
import Finance from './pages/startup/Finance';
import OkrsDashboard from './pages/startup/OkrsDashboard';
import B2cMatrix from './pages/startup/B2cMatrix';
import ProductRoadmap from './pages/startup/ProductRoadmap';
import CustomWikiHub from './pages/startup/CustomWikiHub';
import ArchitectureGrid from './pages/startup/ArchitectureGrid';
import MeetingTimeline from './pages/startup/MeetingTimeline';
import PipelineBoard from './pages/startup/PipelineBoard';
import UserAcquisition from './pages/startup/UserAcquisition';
import CapTable from './pages/startup/CapTable';

// Club
import ClubHome from './pages/club/ClubHome';
import Members from './pages/club/Members';
import Events from './pages/club/Events';
import Meetings from './pages/club/Meetings';

// Fitness
import FitnessHome from './pages/fitness/FitnessHome';
import WeightLog from './pages/fitness/WeightLog';
import DietTracker from './pages/fitness/DietTracker';
import Workouts from './pages/fitness/Workouts';
import CardioLog from './pages/fitness/CardioLog';
import GoogleFitHub from './pages/fitness/GoogleFitHub';

// Personal
import PersonalHome from './pages/personal/PersonalHome';
import Journal from './pages/personal/Journal';
import Habits from './pages/personal/Habits';
import Goals from './pages/personal/Goals';

// Finance
import FinanceHome from './pages/finance/FinanceHome';
import FinanceAccounts from './pages/finance/FinanceAccounts';
import FinanceTransactions from './pages/finance/FinanceTransactions';
import FinanceAnalytics from './pages/finance/FinanceAnalytics';
import FinanceSavings from './pages/finance/FinanceSavings';

// Mental Health
import MentalHealthHome from './pages/mental-health/MentalHealthHome';
import MoodTracker from './pages/mental-health/MoodTracker';
import WellnessCheckin from './pages/mental-health/WellnessCheckin';
import MentalHealthResources from './pages/mental-health/MentalHealthResources';

// Leadership
import LeadershipHome from './pages/leadership/LeadershipHome';
import LeadershipSkills from './pages/leadership/LeadershipSkills';
import LeadershipResources from './pages/leadership/LeadershipResources';

// Hobbies
import HobbiesHome from './pages/hobbies/HobbiesHome';
import CustomHobby from './pages/hobbies/CustomHobby';

// Travel
import TravelHome from './pages/travel/TravelHome';
import Planner from './pages/travel/Planner';
import TravelHistory from './pages/travel/TravelHistory';

// Vault
import VaultHome from './pages/vault/VaultHome';

import './App.css';

function AppContent() {
  const { sidebarCollapsed, theme, accentColor, enabledModules, toggleModule } = useGlobalStore();
  const { isAuthenticated, userEmail } = useGoogleStore();
  const { pullFromCloud } = useSyncStore();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--accent-primary', accentColor);
    
    // Toggle dark class for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, accentColor]);

  // One-time cleanup on mount: if we have stale auth with no email, clear it
  useEffect(() => {
    const state = useGoogleStore.getState();
    if (state.isAuthenticated && !state.userEmail) {
      // Try to recover email if token is still valid
      if (state.accessToken && state.tokenExpiry && Date.now() < state.tokenExpiry) {
        fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${state.accessToken}` }
        })
          .then(r => r.json())
          .then(info => {
            if (info.email) {
              useGoogleStore.setState({ userEmail: info.email });
            } else {
              // Token invalid, clear stale auth once
              useGoogleStore.setState({ isAuthenticated: false, accessToken: null, userEmail: null, tokenExpiry: null });
            }
          })
          .catch(() => {
            useGoogleStore.setState({ isAuthenticated: false, accessToken: null, userEmail: null, tokenExpiry: null });
          });
      } else {
        // Token expired or missing, clear stale auth once
        useGoogleStore.setState({ isAuthenticated: false, accessToken: null, userEmail: null, tokenExpiry: null });
      }
    }
  }, []); // Empty deps = runs once on mount only

  // Synchronize with Firebase on Login/Load
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      pullFromCloud(userEmail).then(() => {
        // Initialize auto-sync AFTER pulling from cloud
        initAutoSync(useGoogleStore);
      });
    }
  }, [isAuthenticated, userEmail, pullFromCloud]);

  return (
    <div className="app-layout bg-background text-foreground transition-colors duration-300">

      <MobileNavbar />
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="OS Settings">
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
           <h3 style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
             {Object.keys(enabledModules || {}).map(mod => (
               <label key={mod} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                 <input type="checkbox" checked={(enabledModules || {})[mod]} onChange={() => toggleModule(mod)} style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }} />
                 <span style={{ fontSize: 'var(--font-sm)', textTransform: 'capitalize' }}>{mod.replace(/([A-Z])/g, ' $1')}</span>
               </label>
             ))}
           </div>
         </div>
      </Modal>
      <main className={`app-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/focus/stats" element={<FocusStatsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/journal" element={<DailyJournal />} />
            <Route path="/journal/stats" element={<JournalInsightsPage />} />
             <Route path="/tasks" element={<TasksPage />} />
             <Route path="/tasks/stats" element={<TaskStatsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/stats" element={<TimeAnalyticsPage />} />
            <Route path="/google-sync" element={<GoogleIntegration />} />

            {/* Academics */}
            <Route path="/academics" element={<AcademicsHome />} />
            <Route path="/academics/subjects" element={<Subjects />} />
            <Route path="/academics/cgpa" element={<CGPATracker />} />
            <Route path="/academics/exams" element={<ExamTracker />} />
            <Route path="/academics/assignments" element={<AssignmentTracker />} />
            <Route path="/academics/assessments" element={<AssessmentsDashboard />} />
            <Route path="/academics/attendance" element={<AttendanceTracker />} />
            <Route path="/academics/resources" element={<Resources />} />

            {/* AI/ML */}
            <Route path="/aiml" element={<AimlHome />} />
            <Route path="/aiml/roadmap" element={<AimlRoadmap />} />
            <Route path="/aiml/courses" element={<AimlCourses />} />
            <Route path="/aiml/projects" element={<AimlProjects />} />
            <Route path="/aiml/papers" element={<AimlPapers />} />

            {/* DSA Hub */}
            <Route path="/dsa" element={<DsaHome />} />
            <Route path="/dsa/roadmap" element={<DsaRoadmap />} />
            <Route path="/dsa/videos" element={<DsaVideos />} />

            {/* GSoC */}
            <Route path="/gsoc" element={<GsocHome />} />
            <Route path="/gsoc/skills" element={<GsocSkills />} />
            <Route path="/gsoc/contributions" element={<GsocContributions />} />
            <Route path="/gsoc/organizations" element={<GsocOrganizations />} />

            {/* CAT */}
            <Route path="/cat" element={<CatHome />} />
            <Route path="/cat/sections" element={<CatSections />} />
            <Route path="/cat/mocks" element={<CatMocks />} />
            <Route path="/cat/resources" element={<CatResources />} />

            {/* Placements */}
            <Route path="/placements" element={<PlacementsHome />} />
            <Route path="/placements/skills" element={<PlacementSkills />} />
            <Route path="/placements/companies" element={<Companies />} />

            {/* Startup */}
            <Route path="/startup" element={<StartupHome />} />
            <Route path="/startup/db/:dbId" element={<StartupDatabase />} />
            <Route path="/startup/ideas" element={<IdeaLab />} />
            <Route path="/startup/tasks" element={<SprintBoard />} />
            <Route path="/startup/finance" element={<Finance />} />
            <Route path="/startup/okrs" element={<OkrsDashboard />} />
            <Route path="/startup/matrix" element={<B2cMatrix />} />
            <Route path="/startup/roadmap" element={<ProductRoadmap />} />
            <Route path="/startup/wiki" element={<CustomWikiHub type="wiki" />} />
            <Route path="/startup/sops" element={<CustomWikiHub type="sop" />} />
            <Route path="/startup/architecture" element={<ArchitectureGrid />} />
            <Route path="/startup/meetings" element={<MeetingTimeline />} />
            <Route path="/startup/deals" element={<PipelineBoard type="deals" />} />
            <Route path="/startup/investors" element={<PipelineBoard type="investors" />} />
            <Route path="/startup/growth" element={<UserAcquisition />} />
            <Route path="/startup/cap-table" element={<CapTable />} />

            {/* Club */}
            <Route path="/club" element={<ClubHome />} />
            <Route path="/club/members" element={<Members />} />
            <Route path="/club/events" element={<Events />} />
            <Route path="/club/meetings" element={<Meetings />} />

            {/* Fitness */}
            <Route path="/fitness" element={<FitnessHome />} />
            <Route path="/fitness/weight" element={<WeightLog />} />
            <Route path="/fitness/diet" element={<DietTracker />} />
            <Route path="/fitness/workouts" element={<Workouts />} />
            <Route path="/fitness/cardio" element={<CardioLog />} />
            <Route path="/fitness/google-fit" element={<GoogleFitHub />} />

            {/* Personal */}
            <Route path="/personal" element={<PersonalHome />} />
            <Route path="/personal/journal" element={<Journal />} />
            <Route path="/personal/habits" element={<Habits />} />
            <Route path="/personal/goals" element={<Goals />} />

            {/* Finance */}
            <Route path="/finance" element={<FinanceHome />} />
            <Route path="/finance/accounts" element={<FinanceAccounts />} />
            <Route path="/finance/transactions" element={<FinanceTransactions />} />
            <Route path="/finance/analytics" element={<FinanceAnalytics />} />
            <Route path="/finance/savings" element={<FinanceSavings />} />

            {/* Mental Health */}
            <Route path="/mental-health" element={<MentalHealthHome />} />
            <Route path="/mental-health/mood" element={<MoodTracker />} />
            <Route path="/mental-health/checkin" element={<WellnessCheckin />} />
            <Route path="/mental-health/resources" element={<MentalHealthResources />} />

            {/* Leadership */}
            <Route path="/leadership" element={<LeadershipHome />} />
            <Route path="/leadership/skills" element={<LeadershipSkills />} />
            <Route path="/leadership/resources" element={<LeadershipResources />} />

            {/* Hobbies */}
            <Route path="/hobbies" element={<HobbiesHome />} />
            <Route path="/hobbies/custom/:hobbyId" element={<CustomHobby />} />

            {/* Travel */}
            <Route path="/travel" element={<TravelHome />} />
            <Route path="/travel/planner" element={<Planner />} />
            <Route path="/travel/history" element={<TravelHistory />} />

            {/* Vault */}
            <Route path="/vault/*" element={<VaultHome />} />
          </Routes>
        </AnimatePresence>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
