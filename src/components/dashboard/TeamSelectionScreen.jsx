import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatMoney } from '../../lib/rules';
import { ShieldCheck } from 'lucide-react';

const TeamSelectionScreen = () => {
    const { state, selectMyTeam } = useAuction();
    const sortedTeams = [...state.teams].sort((a, b) => a.name.localeCompare(b.name));

    const handleSelect = (teamId) => {
        selectMyTeam(teamId);
    };

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 z-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <div className="max-w-5xl w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.3)] mb-4">
                        <ShieldCheck className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Select Your Franchise
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Who will you represent in the Mega Auction 2026? This selection will highlight your team in the dashboard.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {sortedTeams.map((team) => (
                        <button
                            key={team.id}
                            onClick={() => handleSelect(team.id)}
                            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl flex flex-col items-center gap-4 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300 shadow-inner">
                                {team.id}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight group-hover:text-yellow-400 transition-colors">
                                    {team.name}
                                </h3>
                                <p className="text-xs text-emerald-400 font-mono mt-1">
                                    {formatMoney(team.budget)}
                                </p>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/30 rounded-xl transition-colors duration-300" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamSelectionScreen;
