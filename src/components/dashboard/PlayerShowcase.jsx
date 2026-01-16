import React, { useEffect, useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatMoney } from '../../lib/rules';
import { User, Shield, Activity, Star } from 'lucide-react';

const PlayerShowcase = () => {
    const { state } = useAuction();
    const { currentPlayerId, currentBid, currentBidder, auctionStatus, teams, players } = state;

    const player = players.find(p => p.id === currentPlayerId);
    const bidderTeam = teams.find(t => t.id === currentBidder);

    if (!player && auctionStatus === 'IDLE') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 p-8 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                    <User className="w-10 h-10 opacity-50" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Waiting for Auctioneer...</h2>
                    <p>The next player will appear here.</p>
                </div>
            </div>
        );
    }

    // Fallback if player not found but status isn't IDLE (shouldn't happen)
    if (!player) return null;

    return (
        <div className="h-full flex flex-col relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />

            {/* Top Bar: Category & Status */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 relative z-10">
                <div className="flex gap-3">
                    <div className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-white/10">
                        <Activity className="w-4 h-4 text-blue-400" />
                        {player.category}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-white/10 ${player.country === 'India' ? 'bg-blue-500/10 text-blue-300' : 'bg-orange-500/10 text-orange-300'}`}>
                        <Shield className="w-4 h-4" />
                        {player.country}
                    </div>
                </div>
                <div className="text-right">
                    {auctionStatus === 'SOLD' && (
                        <div className="text-green-500 font-black text-3xl uppercase tracking-widest drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-bounce">
                            SOLD
                        </div>
                    )}
                    {auctionStatus === 'UNSOLD' && (
                        <div className="text-red-500 font-black text-3xl uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                            UNSOLD
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center p-8 gap-8 relative z-10">
                {/* Left: Player Image Placeholder */}
                <div className="w-1/3 aspect-[3/4] bg-gradient-to-t from-black to-slate-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex items-end justify-center relative group">
                    {/* Silhoutte or generation */}
                    <User className="w-64 h-64 text-slate-700 absolute bottom-0 transform group-hover:scale-105 transition-transform duration-700" strokeWidth={1} />
                    <div className="absolute top-4 right-4">
                        <div className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur border border-white/20 flex flex-col items-center justify-center">
                            <span className="text-xs text-slate-400">RTG</span>
                            <span className="font-bold text-yellow-500">{player.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Info & Bidding State */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-6xl font-black text-white tracking-tight mb-2 uppercase italic">{player.name}</h1>
                        <div className="flex items-center gap-4 text-slate-400">
                            <span className="text-xl">Base Price: <span className="text-white font-mono">{formatMoney(player.basePrice)}</span></span>
                            {player.isUncapped && <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/30">UNCAPPED</span>}
                        </div>
                    </div>

                    {/* Current Bid Display */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
                        <div className="text-slate-400 text-sm uppercase tracking-wider mb-2">Current Bid</div>
                        <div className="flex items-baseline gap-4">
                            <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-lg">
                                {formatMoney(currentBid)}
                            </div>
                        </div>

                        {bidderTeam ? (
                            <div className="mt-4 flex items-center gap-3">
                                <div className="text-slate-300">Held by:</div>
                                <div className="font-bold text-2xl text-white px-4 py-2 bg-blue-600 rounded-lg shadow-lg border border-blue-400">
                                    {bidderTeam.name}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 text-slate-500 italic">No bids yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerShowcase;
