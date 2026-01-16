import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { CATEGORIES } from '../../data/players';
import { Users } from 'lucide-react';

const PlayerPool = () => {
    const { state } = useAuction();
    const { players } = state;

    const availablePlayers = players.filter(p => p.status === 'Available');

    // Group players by category
    const grouped = availablePlayers.reduce((acc, player) => {
        if (!acc[player.category]) acc[player.category] = [];
        acc[player.category].push(player);
        return acc;
    }, {
        [CATEGORIES.BATSMAN]: [],
        [CATEGORIES.BOWLER]: [],
        [CATEGORIES.ALL_ROUNDER]: [],
        [CATEGORIES.WICKET_KEEPER]: []
    });

    const categoryOrder = [CATEGORIES.BATSMAN, CATEGORIES.WICKET_KEEPER, CATEGORIES.ALL_ROUNDER, CATEGORIES.BOWLER];

    return (
        <div className="flex flex-col bg-white/5 border-b border-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl mb-6">
            {/* Header */}
            <div className="flex items-center px-6 py-2 border-b border-white/10 gap-2 text-slate-300 font-bold bg-black/20">
                <Users className="w-4 h-4" />
                <span>Available Pool ({availablePlayers.length})</span>
            </div>

            {/* 4 Columns Grid */}
            <div className="flex-1 grid grid-cols-4 divide-x divide-white/10 overflow-hidden">
                {categoryOrder.map(category => (
                    <div key={category} className="flex flex-col h-full">
                        {/* Column Header */}
                        <div className="p-2 bg-white/5 text-center font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-white/5 sticky top-0 backdrop-blur-sm z-10">
                            {category} ({grouped[category].length})
                        </div>

                        {/* Full List */}
                        <div className="flex-1 p-2 space-y-2">
                            {grouped[category].length === 0 ? (
                                <div className="text-center text-xs text-slate-600 italic py-4">Empty</div>
                            ) : (
                                grouped[category].map(player => (
                                    <div
                                        key={player.id}
                                        className="bg-black/20 border border-white/5 rounded p-2 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                                            {player.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-xs text-white truncate group-hover:text-yellow-400" title={player.name}>
                                                {player.name}
                                            </div>
                                            <div className={`text-[9px] px-1 rounded border w-fit mt-0.5 ${player.country === 'India' ? 'border-blue-500/30 text-blue-400' : 'border-orange-500/30 text-orange-400'}`}>
                                                {player.country === 'India' ? 'IND' : 'OS'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerPool;
