import React, { useState } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import TeamLeaderboard from './components/dashboard/TeamLeaderboard';
import PlayerShowcase from './components/dashboard/PlayerShowcase';
import AuctioneerControls from './components/dashboard/AuctioneerControls';
import PlayerPool from './components/dashboard/PlayerPool';
import TeamDetailModal from './components/dashboard/TeamDetailModal';
import TeamSelectionScreen from './components/dashboard/TeamSelectionScreen';
import Login from './components/auth/Login';
import AdminControls from './components/admin/AdminControls';

function AppContent() {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { state, isAuthenticated, setIsAuthenticated } = useAuction();

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!state.myTeamId) {
    return <TeamSelectionScreen />;
  }

  const selectedTeam = selectedTeamId ? state.teams.find(t => t.id === selectedTeamId) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black font-sans selection:bg-yellow-500/30 pb-12">

      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            IPL
          </div>
          <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            MEGA AUCTION 2026
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <AdminControls />
          <div className="text-xs font-mono text-slate-400 border border-white/10 px-3 py-1 rounded-full">
            OFFICIAL DASHBOARD
          </div>
        </div>
      </header>

      {/* Top: Player Pool */}
      <PlayerPool />

      {/* Main Grid */}
      <main className="grid grid-cols-12 gap-6 p-6">

        {/* Left: Players & Controls (8 cols) */}
        <div className="col-span-8 flex flex-col gap-4 h-full">
          {/* Player Card Area */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden shadow-2xl">
            <PlayerShowcase />
          </div>

          {/* Controls Area */}
          <div className="h-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
            <AuctioneerControls />
          </div>
        </div>

        {/* Right: Team Leaderboard (4 cols) */}
        <div className="col-span-4 h-full flex flex-col gap-0">

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col h-fit sticky top-24">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h2 className="font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Team Status
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <TeamLeaderboard onTeamClick={setSelectedTeamId} />
            </div>
          </div>

        </div>
      </main>

      {/* Modals */}
      {selectedTeam && (
        <TeamDetailModal team={selectedTeam} onClose={() => setSelectedTeamId(null)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuctionProvider>
      <AppContent />
    </AuctionProvider>
  );
}

export default App;
