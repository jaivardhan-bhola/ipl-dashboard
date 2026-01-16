import React, { useState, useEffect } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatMoney, getNextBidAmount, validateBid } from '../../lib/rules';
import { Play, Gavel, XCircle, ArrowRight } from 'lucide-react';

const AuctioneerControls = () => {
    const { state, startAuctionForPlayer, placeBid, sellPlayer, passPlayer, nextPlayer } = useAuction();
    const { auctionStatus, currentPlayerId, currentBid, currentBidder, teams, players } = state;

    const [bidAmount, setBidAmount] = useState(0);

    useEffect(() => {
        setBidAmount(getNextBidAmount(currentBid));
    }, [currentBid]);

    // Find next available player (random or sequential) - Simple sequential logic for now
    const getNextPlayerId = () => {
        const remaining = players.filter(p => p.status === 'Available' && p.id !== currentPlayerId);
        if (remaining.length === 0) return null;
        // Rules say "random basis", so pick random
        const randomIndex = Math.floor(Math.random() * remaining.length);
        return remaining[randomIndex].id;
    };

    const handleStartNext = () => {
        const nextId = getNextPlayerId();
        if (nextId) startAuctionForPlayer(nextId);
        else alert("No more players available!");
    };

    if (auctionStatus === 'IDLE' || auctionStatus === 'SOLD' || auctionStatus === 'UNSOLD') {
        return (
            <div className="h-full flex items-center justify-center">
                <button
                    onClick={auctionStatus === 'IDLE' ? handleStartNext : nextPlayer}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl font-bold text-xl shadow-xl hover:scale-105 transition-transform active:scale-95 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="flex items-center gap-3">
                        {auctionStatus === 'IDLE' ? <Play className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                        {auctionStatus === 'IDLE' ? "START AUCTION" : "NEXT PLAYER"}
                    </span>
                </button>
            </div>
        );
    }

    // In Bidding Mode
    const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-sm">Control Panel</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Bid:</span>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={Math.floor(bidAmount / 10000000)}
                            onChange={(e) => {
                                const newCr = Number(e.target.value);
                                const currentLacs = (bidAmount % 10000000) / 100000;
                                setBidAmount((newCr * 10000000) + (currentLacs * 100000));
                            }}
                            className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-white w-16 font-mono text-right"
                            placeholder="Cr"
                        />
                        <span className="text-slate-400 text-xs font-bold">Cr</span>
                        <input
                            type="number"
                            value={(bidAmount % 10000000) / 100000}
                            onChange={(e) => {
                                const newLacs = Number(e.target.value);
                                const currentCr = Math.floor(bidAmount / 10000000);
                                setBidAmount((currentCr * 10000000) + (newLacs * 100000));
                            }}
                            className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-white w-20 font-mono text-right"
                            placeholder="L"
                        />
                        <span className="text-slate-400 text-xs font-bold">L</span>
                    </div>
                </div>
            </div>

            {/* Team Bid Buttons Grid */}
            <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[100px] custom-scrollbar">
                {sortedTeams.map(team => {
                    const isValid = validateBid(team, bidAmount).valid;
                    const isCurrentBidder = team.id === currentBidder;

                    return (
                        <button
                            key={team.id}
                            onClick={() => placeBid(team.id, bidAmount)}
                            disabled={!isValid || isCurrentBidder}
                            className={`
                            px-2 py-2 rounded text-sm font-bold truncate transition-all
                            ${isCurrentBidder
                                    ? 'bg-yellow-500 text-black cursor-default opacity-100 ring-2 ring-yellow-300'
                                    : isValid
                                        ? 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white'
                                        : 'bg-red-900/20 text-red-500 cursor-not-allowed opacity-50'
                                }
                        `}
                            title={!isValid ? "Insufficient Funds/Squad Full" : ""}
                        >
                            {team.id}
                        </button>
                    )
                })}
            </div>

            {/* Global Actions */}
            <div className="border-t border-white/10 pt-4 flex gap-4 justify-end">
                <button
                    onClick={passPlayer}
                    className="px-6 py-2 rounded-lg bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 flex items-center gap-2"
                >
                    <XCircle className="w-5 h-5" />
                    UNSOLD
                </button>
                <button
                    onClick={sellPlayer}
                    disabled={!currentBidder}
                    className={`
                    px-8 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all
                    ${currentBidder
                            ? 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105 hover:shadow-green-500/25'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }
                `}
                >
                    <Gavel className="w-5 h-5" />
                    SELL PLAYER
                </button>
            </div>
        </div>
    );
};

export default AuctioneerControls;
