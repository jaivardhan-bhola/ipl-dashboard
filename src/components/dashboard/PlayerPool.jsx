import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { CATEGORIES } from '../../data/players';
import { Users } from 'lucide-react';

const PlayerPool = () => {
    const { state, startAuctionForPlayer } = useAuction();
    const { players } = state;
    const [selectedCategory, setSelectedCategory] = useState(null);

    const availablePlayers = players.filter(p => p.status === 'Available');

    // Granular Grouping Logic
    const grouped = availablePlayers.reduce((acc, player) => {
        const isIndian = player.country === 'India';
        let key = '';

        // Category Matching
        // Internal standard categories: 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'
        // Goal: Merge Wicket Keeper into Batters for display

        let displayCategory = '';
        if (player.category === CATEGORIES.BATSMAN || player.category === CATEGORIES.WICKET_KEEPER) {
            displayCategory = 'Batters';
        } else if (player.category === CATEGORIES.BOWLER) {
            displayCategory = 'Bowlers';
        } else if (player.category === CATEGORIES.ALL_ROUNDER) {
            displayCategory = 'All-Rounders';
        }

        if (displayCategory) {
            key = `${isIndian ? 'Indian' : 'Overseas'} ${displayCategory}`;
        }

        if (key) {
            if (!acc[key]) acc[key] = [];
            acc[key].push(player);
        }
        return acc;
    }, {});

    // Define fixed order for tabs - EXACTLY 6 TABS
    const tabOrder = [
        'Indian Batters',
        'Overseas Batters',
        'Indian Bowlers',
        'Overseas Bowlers',
        'Indian All-Rounders',
        'Overseas All-Rounders'
    ];

    const handlePlayerClick = (player) => {
        startAuctionForPlayer(player.id);
        setSelectedCategory(null); // Close modal
    };

    return (
        <>
            {/* New Category Navigation Bar (Tab Style) */}
            <div className="flex bg-[#2d3748] border-b border-white/10 shadow-md sticky top-16 z-30 overflow-x-auto custom-scrollbar">
                {tabOrder.map(category => {
                    const count = grouped[category]?.length || 0;
                    if (count === 0) return null; // Hide empty tabs if preferred, or keep show 0

                    const isActive = selectedCategory === category;

                    return (
                        <div
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                                relative whitespace-nowrap px-5 py-3 cursor-pointer transition-colors duration-200 border-r border-white/5
                                ${isActive ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm uppercase tracking-wide">{category}</span>
                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-black/20 text-slate-500'}`}>
                                    {count}
                                </span>
                            </div>

                            {/* Green Active Indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal Overlay for Selected Category */}
            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-[#1a1b26] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-green-400" />
                                <h2 className="text-xl font-bold text-white tracking-wide">{selectedCategory}</h2>
                                <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full font-mono">
                                    {grouped[selectedCategory]?.length || 0} Available
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Grid Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {grouped[selectedCategory] && grouped[selectedCategory].map(player => (
                                    <div
                                        key={player.id}
                                        onClick={() => handlePlayerClick(player)}
                                        className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 hover:border-green-500/30 transition-all cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/5 transition-all duration-500" />

                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                                            {player.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1 relative z-10">
                                            <div className="font-bold text-sm text-white truncate group-hover:text-green-400 transition-colors">
                                                {player.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${player.country === 'India' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-orange-500/30 text-orange-400 bg-orange-500/5'}`}>
                                                    {player.country === 'India' ? 'IND' : 'OS'}
                                                </span>
                                                {player.category === CATEGORIES.WICKET_KEEPER && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded border border-purple-500/30 text-purple-400 bg-purple-500/5 font-medium">
                                                        WK
                                                    </span>
                                                )}
                                                {player.isUncapped && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded border border-green-500/30 text-green-400 bg-green-500/5 font-medium">
                                                        Uncapped
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );



};

export default PlayerPool;
