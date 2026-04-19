import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import MobileNavbar from './components/layout/MobileNavbar';
import PageWrapper from './components/layout/PageWrapper';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { useGlobalStore } from './store/globalStore';

// Pages
import Dashboard from './pages/Dashboard';
import QuickCapture from './pages/QuickCapture';

// Tasks
import TasksPage from './pages/tasks/TasksPage';

// Academics
import AcademicsHome from './pages/academics/AcademicsHome';
import Subjects from './pages/academics/Subjects';
import CGPATracker from './pages/academics/CGPATracker';
import ExamTracker from './pages/academics/ExamTracker';
import AssignmentTracker from './pages/academics/AssignmentTracker';
import AttendanceTracker from './pages/academics/AttendanceTracker';
import Resources from './pages/academics/Resources';

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
import IdeaLab from './pages/startup/IdeaLab';
import SprintBoard from './pages/startup/SprintBoard';
import Finance from './pages/startup/Finance';

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

// Settings
import GoogleIntegration from './pages/settings/GoogleIntegration';
import CalendarPage from './pages/settings/CalendarPage';

// Vault
import VaultHome from './pages/vault/VaultHome';

import './App.css';

function AppContent() {
  const { sidebarCollapsed, theme, accentColor } = useGlobalStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--accent-primary', accentColor);
  }, [theme, accentColor]);

  return (
    <div className="app-layout">
      <MobileNavbar />
      <Sidebar />
      <main className={`app-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inbox" element={<QuickCapture />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/google-sync" element={<GoogleIntegration />} />

            {/* Academics */}
            <Route path="/academics" element={<AcademicsHome />} />
            <Route path="/academics/subjects" element={<Subjects />} />
            <Route path="/academics/cgpa" element={<CGPATracker />} />
            <Route path="/academics/exams" element={<ExamTracker />} />
            <Route path="/academics/assignments" element={<AssignmentTracker />} />
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
            <Route path="/startup/ideas" element={<IdeaLab />} />
            <Route path="/startup/tasks" element={<SprintBoard />} />
            <Route path="/startup/finance" element={<Finance />} />

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
