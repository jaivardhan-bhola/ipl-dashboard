import React from 'react';
import { formatMoney } from '../../lib/rules';
import { CATEGORIES } from '../../data/players';
import { X, Trophy, AlertCircle, CheckCircle } from 'lucide-react';

const TeamDetailModal = ({ team, onClose }) => {
    if (!team) return null;

    // Calculate role counts
    const counts = team.squad.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        if (p.country === 'Overseas') acc.overseas = (acc.overseas || 0) + 1;
        return acc;
    }, { overseas: 0 });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                    <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-wider">{team.name}</h2>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-emerald-400 font-mono font-bold">Purse: {formatMoney(team.budget)}</span>
                            <span className="text-slate-400">|</span>
                            <span className="text-white">Squad: {team.squad.length}/15</span>
                            <span className="text-slate-400">|</span>
                            <span className="text-yellow-500">RTM: {team.rtmAvailable ? 'Available' : 'Used'}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {Object.values(CATEGORIES).map(cat => (
                            <div key={cat} className="bg-black/40 rounded-lg p-3 border border-white/5">
                                <div className="text-xs text-slate-500 uppercase">{cat}</div>
                                <div className="text-xl font-bold text-white">{counts[cat] || 0}</div>
                            </div>
                        ))}
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                            <div className="text-xs text-orange-400 uppercase">Overseas</div>
                            <div className="text-xl font-bold text-white">{counts.overseas} / 5</div>
                        </div>
                    </div>

                    {/* Squad List */}
                    <div className="space-y-8">
                        {(() => {
                            // Group players by Country + Role
                            const grouped = team.squad.reduce((acc, player) => {
                                const key = `${player.country} ${player.category}`;
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(player);
                                return acc;
                            }, {});

                            // Define Display Order
                            const order = [
                                "India Batsman", "Overseas Batsman",
                                "India Wicket-Keeper", "Overseas Wicket-Keeper",
                                "India All-Rounder", "Overseas All-Rounder",
                                "India Bowler", "Overseas Bowler"
                            ];

                            // Filter to only groups that have players
                            const activeGroups = order.filter(key => grouped[key] && grouped[key].length > 0);

                            // Also catch any groups that might not be in our explicit order (fallback)
                            const otherKeys = Object.keys(grouped).filter(key => !order.includes(key));
                            const finalKeys = [...activeGroups, ...otherKeys];

                            if (finalKeys.length === 0) {
                                return (
                                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/10 rounded-xl">
                                        No players purchased yet.
                                    </div>
                                );
                            }

                            return finalKeys.map(groupKey => (
                                <div key={groupKey}>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider border-b border-white/10 pb-2">
                                        {/* Dynamic Icon based on role/country? Keeping it simple for now or reusing specific icons if needed */}
                                        <Trophy className="w-5 h-5 text-yellow-500/50" />
                                        {groupKey} <span className="text-slate-500 text-sm ml-2">({grouped[groupKey].length})</span>
                                    </h3>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 text-xs uppercase tracking-wider text-slate-500 px-4 pb-2">
                                            <div className="col-span-1">#</div>
                                            <div className="col-span-4">Player Name</div>
                                            <div className="col-span-3">Category</div>
                                            <div className="col-span-2">Country</div>
                                            <div className="col-span-2 text-right">Price</div>
                                        </div>

                                        {grouped[groupKey].map((player, idx) => (
                                            <div key={player.id} className="grid grid-cols-12 items-center px-4 py-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="col-span-1 text-slate-500 text-sm">{idx + 1}</div>
                                                <div className="col-span-4 font-bold text-white">{player.name}</div>
                                                <div className="col-span-3">
                                                    <span className="text-xs bg-black/40 px-2 py-1 rounded text-slate-300">
                                                        {player.category}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-sm text-slate-400">{player.country}</div>
                                                <div className="col-span-2 text-right font-mono font-bold text-green-400">
                                                    {formatMoney(player.soldPrice)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailModal;
