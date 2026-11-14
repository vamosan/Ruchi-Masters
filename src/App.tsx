import React, { useState } from 'react';
import { useTournament, TournamentProvider } from './context/TournamentContext';
import { RuchiNavbar } from './components/layout/RuchiNavbar';
import { HomePage } from './components/home/HomePage';
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
    closeAuthModal,
  } = useTournament();

  const [showEditTournamentModal, setShowEditTournamentModal] = useState(false);

  const isFullBleed = activeTab === 'overview' || activeTab === 'videos';

  return (
    <div className="min-h-screen bg-[#f6f4f4] text-[#090909] font-sans flex flex-col">
      {/* Rally Editorial Top Navigation */}
      <RuchiNavbar />

      {/* Main Content */}
      {isFullBleed ? (
        <main className="flex-1 min-w-0">
          <HomePage />
        </main>
      ) : (
        <div className="flex-1 max-w-[1320px] w-full mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <main className="min-w-0">
            {activeTab === 'halloffame' && <HallOfFamePage />}
            {activeTab === 'pickem' && <MatchdayPickEm />}
            {activeTab === 'social' && <SocialPosterStudio />}
            {activeTab === 'fixtures' && <FixtureList />}
            {activeTab === 'live' && <LiveScoringConsole />}
            {activeTab === 'standings' && <PointsTable />}
            {activeTab === 'teams' && <TeamList />}
            {activeTab === 'stats' && <Leaderboards />}
            {activeTab === 'playoffs' && <KnockoutBracket />}
            {activeTab === 'organizer' && <OrganizerSuite />}
          </main>
        </div>
      )}

      {/* Global Edit Tournament Modal */}
      <TournamentWizardModal
        isOpen={showEditTournamentModal}
        onClose={() => setShowEditTournamentModal(false)}
      />

      {/* Pre-Footer CTA & Multi-Column Footer */}
      <Footer />

      {/* Global Auth Modal */}
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
