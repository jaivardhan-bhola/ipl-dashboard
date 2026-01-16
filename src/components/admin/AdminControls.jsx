import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Lock } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

const AdminControls = () => {
    const { state, dispatch } = useAuction();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'RESET' | 'PAUSE' | 'PLAY'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleActionClick = (action) => {
        // If Play, maybe no password needed? User requested "reset and pause and play should work after conformation and standard password"
        // Let's require password for all sensitive admin actions as requested.
        setPendingAction(action);
        setShowAuthModal(true);
        setError('');
        setPassword('');
    };

    const confirmAction = async (e) => {
        e.preventDefault();
        try {
            // Verify Password
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (data.success) {
                // Execute Action
                if (pendingAction === 'RESET') {
                    await fetch('/api/admin/reset', { method: 'POST' });
                    window.location.reload(); // Hard reload to clear everything
                } else if (pendingAction === 'PAUSE') {
                    await fetch('/api/admin/status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'PAUSED' })
                    });
                    dispatch({ type: 'SET_STATUS', payload: 'PAUSED' });
                } else if (pendingAction === 'PLAY') {
                    await fetch('/api/admin/status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'LIVE' })
                    });
                    dispatch({ type: 'SET_STATUS', payload: 'IDLE' }); // Back to IDLE/Operating state
                }
                setShowAuthModal(false);
            } else {
                setError('Invalid Password');
            }
        } catch (err) {
            setError('Action failed');
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleActionClick('PLAY')}
                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Start Auction"
            >
                <Play className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleActionClick('PAUSE')}
                className="bg-yellow-600 hover:bg-yellow-500 text-white p-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Pause Auction"
            >
                <Pause className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleActionClick('RESET')}
                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Reset Auction (Danger)"
            >
                <RotateCcw className="w-4 h-4" />
            </button>

            {/* Auth Modal for Actions */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-yellow-500" />
                            Security Check
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Please confirm password to <strong>{pendingAction}</strong> the auction.
                        </p>

                        <form onSubmit={confirmAction} className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                placeholder="Admin Password"
                                autoFocus
                            />
                            {error && <p className="text-red-400 text-xs">{error}</p>}

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAuthModal(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-yellow-500 text-black font-bold px-4 py-2 rounded hover:bg-yellow-400"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminControls;
