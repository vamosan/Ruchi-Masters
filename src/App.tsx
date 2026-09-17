import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { RuchiNavbar } from './components/layout/RuchiNavbar';
import { RuchiDashboard } from './components/tournament/RuchiDashboard';

// Dark Broadcast option components
import { Sidebar } from './components/layout/Sidebar';
import { TopMatchTicker } from './components/layout/TopMatchTicker';
import { BottomLiveDock } from './components/layout/BottomLiveDock';
import { TournamentFeed } from './components/tournament/TournamentFeed';

// Interactive Fun Features
import { MatchdayPickEm } from './components/predictions/MatchdayPickEm';
import { SocialPosterStudio } from './components/social/SocialPosterStudio';
import { HallOfFamePage } from './components/halloffame/HallOfFamePage';

// Shared View Tabs
import { FixtureList } from './components/fixtures/FixtureList';
import { LiveScoringConsole } from './components/scoring/LiveScoringConsole';
import { PointsTable } from './components/standings/PointsTable';
import { TeamList } from './components/teams/TeamList';
import { Leaderboards } from './components/stats/Leaderboards';
import { KnockoutBracket } from './components/playoffs/KnockoutBracket';
import { OrganizerSuite } from './components/organizer/OrganizerSuite';
import { TournamentWizardModal } from './components/tournament/TournamentWizardModal';
import { AuthModal } from './components/auth/AuthModal';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    isAuthModalOpen, 
    authModalTeamId, 
    closeAuthModal 
  } = useTournament();
  
  const [themeMode, setThemeMode] = useState<'clean' | 'broadcast'>('clean');
  const [showEditTournamentModal, setShowEditTournamentModal] = useState(false);

  return (
    <>
      {themeMode === 'clean' ? (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#CCFF00] selection:text-slate-950 flex flex-col">
          {/* Top Sporty Navbar */}
          <RuchiNavbar themeMode={themeMode} setThemeMode={setThemeMode} />

          {/* Body Container */}
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <main className="min-w-0">
              {activeTab === 'overview' && <RuchiDashboard />}
              {activeTab === 'halloffame' && <HallOfFamePage />}
              {activeTab === 'pickem' && <MatchdayPickEm />}
              {activeTab === 'social' && <SocialPosterStudio />}
              {activeTab === 'videos' && <RuchiDashboard />}
              {activeTab === 'fixtures' && <FixtureList />}
              {activeTab === 'live' && <LiveScoringConsole />}
              {activeTab === 'standings' && <PointsTable />}
              {activeTab === 'teams' && <TeamList />}
              {activeTab === 'stats' && <Leaderboards />}
              {activeTab === 'playoffs' && <KnockoutBracket />}
              {activeTab === 'organizer' && <OrganizerSuite />}
            </main>
          </div>

          {/* Global Edit Tournament Modal */}
          <TournamentWizardModal
            isOpen={showEditTournamentModal}
            onClose={() => setShowEditTournamentModal(false)}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-[#100a2e] text-slate-100 flex flex-col md:flex-row selection:bg-cyan-400 selection:text-slate-950 font-sans">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0 bg-[#140e3a] p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
            <div className="flex justify-end">
              <button
                onClick={() => setThemeMode('clean')}
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 shadow"
              >
                Switch to Clean Theme ➔
              </button>
            </div>

            <TopMatchTicker />

            <main className="flex-1 space-y-6">
              {activeTab === 'overview' && <TournamentFeed />}
          {activeTab === 'halloffame' && <HallOfFamePage />}
              {activeTab === 'pickem' && <MatchdayPickEm />}
              {activeTab === 'social' && <SocialPosterStudio />}
              {activeTab === 'videos' && <TournamentFeed />}
              {activeTab === 'fixtures' && <FixtureList />}
              {activeTab === 'live' && <LiveScoringConsole />}
              {activeTab === 'standings' && <PointsTable />}
              {activeTab === 'teams' && <TeamList />}
              {activeTab === 'stats' && <Leaderboards />}
              {activeTab === 'playoffs' && <KnockoutBracket />}
              {activeTab === 'organizer' && <OrganizerSuite />}
            </main>
          </div>

          <BottomLiveDock />

          <TournamentWizardModal
            isOpen={showEditTournamentModal}
            onClose={() => setShowEditTournamentModal(false)}
          />
        </div>
      )}

      {/* Global Auth Modal rendered at Root Level */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTeamId={authModalTeamId}
      />
    </>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <MainLayout />
    </TournamentProvider>
  );
}
