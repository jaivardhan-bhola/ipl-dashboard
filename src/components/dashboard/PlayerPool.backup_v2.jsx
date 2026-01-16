import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { CATEGORIES } from '../../data/players';
import { Users } from 'lucide-react';

const PlayerPool = () => {
    const { state } = useAuction();
    const { players } = state;
    const [selectedCategory, setSelectedCategory] = useState(null);

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
        <div className={`flex flex-col bg-white/5 border-b border-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl mb-6 transition-all duration-300 ${selectedCategory ? 'min-h-[500px]' : ''}`}>
            {/* Main Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Users className="w-5 h-5" />
                    <span>Available Pool ({availablePlayers.length})</span>
                </div>
                {selectedCategory && (
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white transition-colors"
                    >
                        ← Back to Overview
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {selectedCategory ? (
                    // FOCUSED VIEW (Expanded Category)
                    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 bg-gradient-to-r from-blue-900/40 to-slate-900/40 border-b border-white/5 font-bold text-lg text-white sticky top-0 backdrop-blur-md z-20 flex justify-between items-center">
                            <span>{selectedCategory}</span>
                            <span className="text-sm text-slate-400 font-normal">{grouped[selectedCategory].length} Players</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {grouped[selectedCategory].map(player => (
                                    <div
                                        key={player.id}
                                        className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white/10 hover:border-yellow-500/50 transition-all cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 border border-white/5">
                                            {player.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-sm text-white truncate group-hover:text-yellow-400">
                                                {player.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${player.country === 'India' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-orange-500/30 text-orange-400 bg-orange-500/10'}`}>
                                                    {player.country === 'India' ? 'IND' : 'OS'}
                                                </span>
                                                {player.isUncapped && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-green-500/30 text-green-400 bg-green-500/10">
                                                        Uncapped
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Optional: Add Base Price or Rating here */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // DEFAULT VIEW (4 Columns)
                    <div className="grid grid-cols-4 divide-x divide-white/10 h-full">
                        {categoryOrder.map(category => (
                            <div key={category} className="flex flex-col h-full hover:bg-white/5 transition-colors">
                                {/* Clickable Header */}
                                <div
                                    onClick={() => setSelectedCategory(category)}
                                    className="p-3 bg-white/5 text-center font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-white/5 cursor-pointer hover:text-yellow-400 hover:bg-white/10 transition-all sticky top-0 backdrop-blur-sm z-10"
                                    title="Click to view full list"
                                >
                                    {category} ({grouped[category].length})
                                </div>

                                {/* Full List Preview */}
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
                )}
            </div>
        </div>
    );
};

export default PlayerPool;
