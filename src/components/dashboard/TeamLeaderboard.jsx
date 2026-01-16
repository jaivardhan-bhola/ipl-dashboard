import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatMoney, MIN_SQUAD_SIZE, MAX_SQUAD_SIZE } from '../../lib/rules';
import { Users, Wallet, Trophy } from 'lucide-react';

const TeamLeaderboard = ({ onTeamClick }) => {
    const { state } = useAuction();
    const sortedTeams = [...state.teams].sort((a, b) => b.budget - a.budget);

    return (
        <div className="flex flex-col h-full w-full">
            {sortedTeams.map((team) => {
                const squadSize = team.squad.length;
                const isFull = squadSize >= MAX_SQUAD_SIZE;
                const needsPlayers = squadSize < MIN_SQUAD_SIZE;
                const isMyTeam = state.myTeamId === team.id;

                return (
                    <div
                        key={team.id}
                        onClick={() => onTeamClick && onTeamClick(team.id)}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors group relative cursor-pointer 
                            ${state.currentBidder === team.id ? 'bg-yellow-500/10 border-l-4 border-l-yellow-500' : ''}
                            ${isMyTeam ? 'bg-blue-500/5' : ''}
                        `}
                    >
                        {isMyTeam && (
                            <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
                                You
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className={`font-bold text-lg leading-tight transition-colors ${isMyTeam ? 'text-blue-400' : 'group-hover:text-yellow-400'}`}>
                                    {team.name}
                                </h3>
                                <div className="text-xs text-slate-400 font-mono mt-0.5">{team.id}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-emerald-400 text-lg">
                                    {formatMoney(team.budget)}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Remaining Purse</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-black/40 rounded px-2 py-1.5 flex items-center gap-2">
                                <Users className={`w-3.5 h-3.5 ${needsPlayers ? 'text-red-400' : 'text-slate-400'}`} />
                                <span className="text-xs font-medium">
                                    <span className={isFull ? 'text-red-400' : 'text-slate-200'}>{squadSize}</span>
                                    <span className="text-slate-500">/{MAX_SQUAD_SIZE}</span>
                                </span>
                            </div>

                            <div className="bg-black/40 rounded px-2 py-1.5 flex items-center gap-2">
                                <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                                <span className="text-xs text-slate-300">RTM: {team.rtmAvailable ? 'Yes' : 'No'}</span>
                            </div>
                        </div>

                        {/* Active Bidder Indicator */}
                        {state.currentBidder === team.id && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse">
                                HIGHEST BIDDER
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TeamLeaderboard;
