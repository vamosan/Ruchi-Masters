import React, { useState } from 'react';
import { useTournament, TournamentProvider } from './context/TournamentContext';
import { RuchiNavbar } from './components/layout/RuchiNavbar';
import { RuchiDashboard } from './components/tournament/RuchiDashboard';
import { HallOfFamePage } from './components/halloffame/HallOfFamePage';
import { MatchdayPickEm } from './components/predictions/MatchdayPickEm';
import { SocialPosterStudio } from './components/social/SocialPosterStudio';
import { FixtureList } from './components/fixtures/FixtureList';
import { LiveScoringConsole } from './components/scoring/LiveScoringConsole';
import { PointsTable } from './components/standings/PointsTable';
import { TeamList } from './components/teams/TeamList';
import { Leaderboards } from './components/stats/Leaderboards';
import { KnockoutBracket } from './components/playoffs/KnockoutBracket';
import { OrganizerSuite } from './components/organizer/OrganizerSuite';
import { TournamentWizardModal } from './components/tournament/TournamentWizardModal';
import { AuthModal } from './components/auth/AuthModal';
import { Footer } from './components/layout/Footer';

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* Top Sporty Editorial Navigation Bar */}
      <RuchiNavbar themeMode={themeMode} setThemeMode={setThemeMode} />

      {/* Main Page Container */}
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

      {/* Official League Footer */}
      <Footer />

      {/* Global Auth Modal rendered at Root Level */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTeamId={authModalTeamId}
      />
    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <MainLayout />
    </TournamentProvider>
  );
}
