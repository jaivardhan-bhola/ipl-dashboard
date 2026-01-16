import React, { createContext, useContext, useReducer, useState } from 'react';
import { TEAMS } from '../data/teams';
import { PLAYERS } from '../data/players';
import { getNextBidAmount, validateBid } from '../lib/rules';

const AuctionContext = createContext();

const initialState = {
    teams: TEAMS,
    players: PLAYERS,
    currentBid: 0,
    currentBidder: null, // Team ID
    currentPlayerId: null,
    history: [], // For undo/logs
    currentPlayerId: null,
    history: [], // For undo/logs
    auctionStatus: 'IDLE', // IDLE, ACTIVE, INDIVIDUAL_LUNCH_BREAK (Wait, rule says no breaks but user can eat) - Let's use IDLE (waiting for next player), BIDDING (active on a player), SOLD (player sold, waiting confirmation/next), UNSOLD.
    myTeamId: null, // Fetched from DB
};

const auctionReducer = (state, action) => {
    switch (action.type) {
        case 'START_PLAYER':
            return {
                ...state,
                currentPlayerId: action.payload.playerId,
                currentBid: action.payload.basePrice,
                currentBidder: null,
                auctionStatus: 'BIDDING',
            };

        case 'PLACE_BID':
            return {
                ...state,
                currentBid: action.payload.amount,
                currentBidder: action.payload.teamId,
            };

        case 'SELL_PLAYER': {
            const { playerId, teamId, amount } = action.payload;

            const updatedTeams = state.teams.map(team => {
                if (team.id === teamId) {
                    // Find full player object
                    const player = state.players.find(p => p.id === playerId);
                    return {
                        ...team,
                        budget: team.budget - amount,
                        squad: [...team.squad, { ...player, soldPrice: amount }],
                    };
                }
                return team;
            });

            const updatedPlayers = state.players.map(p =>
                p.id === playerId ? { ...p, status: 'Sold', soldTo: teamId, soldPrice: amount } : p
            );

            return {
                ...state,
                teams: updatedTeams,
                players: updatedPlayers,
                auctionStatus: 'SOLD',
                history: [...state.history, { type: 'SOLD', playerId, teamId, amount, timestamp: new Date() }],
            };
        }

        case 'UNSOLD_PLAYER': {
            const updatedPlayers = state.players.map(p =>
                p.id === state.currentPlayerId ? { ...p, status: 'Unsold' } : p
            );
            return {
                ...state,
                players: updatedPlayers,
                auctionStatus: 'UNSOLD',
                history: [...state.history, { type: 'UNSOLD', playerId: state.currentPlayerId, timestamp: new Date() }],
            };
        }

        case 'RESET_ROUND':
            return {
                ...state,
                currentPlayerId: null,
                currentBid: 0,
                currentBidder: null,
                auctionStatus: 'IDLE'
            }

        case 'SET_PLAYERS':
            return {
                ...state,
                players: action.payload,
                currentPlayerId: null,
                auctionStatus: 'IDLE'
            };

        case 'INIT_STATE':
            return {
                ...state,
                teams: action.payload.teams && action.payload.teams.length > 0 ? action.payload.teams : state.teams,
                players: action.payload.players && action.payload.players.length > 0 ? action.payload.players : state.players,
                teams: action.payload.teams && action.payload.teams.length > 0 ? action.payload.teams : state.teams,
                players: action.payload.players && action.payload.players.length > 0 ? action.payload.players : state.players,
                auctionStatus: action.payload.status === 'PAUSED' ? 'PAUSED' : 'IDLE', // Map DB status to UI status
                myTeamId: action.payload.myTeamId || null,
            };

        case 'SET_STATUS':
            return {
                ...state,
                auctionStatus: action.payload // 'IDLE' or 'PAUSED'
            };

        case 'SELECT_MY_TEAM':
            return {
                ...state,
                myTeamId: action.payload
            };

        default:
            return state;
    }
};

export const AuctionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(auctionReducer, initialState);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initial State Fetch
    React.useEffect(() => {
        const fetchState = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/state');
                const data = await res.json();
                if (data) {
                    dispatch({ type: 'INIT_STATE', payload: data });
                }
            } catch (error) {
                console.warn("Backend unavailble, using local mock state");
            }
        };
        fetchState();
    }, []);

    // Middleware to sync state changes to backend (Optimistic UI)
    const dispatchWithSync = async (action) => {
        dispatch(action);

        // Persist specific actions
        const actionsToPersist = ['PLACE_BID', 'SELL_PLAYER', 'UNSOLD_PLAYER', 'RESET_ROUND', 'SET_PLAYERS'];
        if (actionsToPersist.includes(action.type)) {
            try {
                // For simplicity, we can sync the WHOLE state or just the action.
                // Given the requirement, let's sync the relevant parts.
                // Actually, the easiest robust way for this MVP is to sync the modified entites.
                // But since we don't have the *next* state here easily without recalculating, 
                // we'll rely on a lightweight sync or just accept frontend-first.

                // Better approach: Let the frontend be the source of truth for high-frequency (bidding) 
                // and push to backend.

                // For this step, I'll just push the current state after a short delay or assume the backend 
                // API for 'sync' will be called.

                // Let's defer strict sync logic to a separate helper or effect, 
                // but strictly speaking, `sellPlayer` should call the API.
            } catch (e) {
                console.error("Sync failed", e);
            }
        }
    };

    /**
     * WRAPPER ACTIONS THAT SYNC TO BACKEND
     */

    const startAuctionForPlayer = (playerId) => {
        const player = state.players.find(p => p.id === playerId);
        if (!player) return;
        dispatch({ type: 'START_PLAYER', payload: { playerId, basePrice: player.basePrice } });
    };

    const placeBid = (teamId, customAmount = null) => {
        if (state.auctionStatus !== 'BIDDING') return;
        const amount = customAmount || getNextBidAmount(state.currentBid);
        // ... Validation logic ...
        dispatch({ type: 'PLACE_BID', payload: { teamId, amount } });
    };

    const sellPlayer = async () => {
        if (!state.currentBidder) return;
        const payload = {
            playerId: state.currentPlayerId,
            teamId: state.currentBidder,
            amount: state.currentBid
        };

        dispatch({ type: 'SELL_PLAYER', payload });

        // Sync to backend
        try {
            // We need to send the updated teams/players to the sync endpoint
            // Or use a specialized endpoint. Let's use the bulk sync for reliability now.
            // Since `state` is stale here, we construct the update manually or wait for effect.
            // let's just trigger a sync in an Effect dependent on state.
        } catch (e) { }
    };

    // Auto-Sync Effect
    React.useEffect(() => {
        if (state.teams === TEAMS && state.players === PLAYERS) return; // Don't sync initial mock

        const timer = setTimeout(() => {
            fetch('http://localhost:3001/api/state/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teams: state.teams, players: state.players })
            }).catch(e => console.error("Auto-sync failed", e));
        }, 1000); // 1s debounce

        return () => clearTimeout(timer);
    }, [state.teams, state.players]);


    const passPlayer = () => {
        dispatch({ type: 'UNSOLD_PLAYER' });
    };

    const nextPlayer = () => {
        dispatch({ type: 'RESET_ROUND' });
    };

    const loadPlayers = (newPlayers) => {
        dispatch({ type: 'SET_PLAYERS', payload: newPlayers });
    };

    const selectMyTeam = async (teamId) => {
        // Optimistic update
        dispatch({ type: 'SELECT_MY_TEAM', payload: teamId });

        try {
            await fetch('http://localhost:3001/api/select-team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId })
            });
        } catch (e) {
            console.error("Failed to select team on backend", e);
        }
    };

    return (
        <AuctionContext.Provider value={{
            state,
            dispatch, // Exposed for AdminControls
            isAuthenticated,
            setIsAuthenticated,
            startAuctionForPlayer,
            placeBid,
            sellPlayer,
            passPlayer,
            nextPlayer,
            loadPlayers,
            selectMyTeam
        }}>
            {children}
        </AuctionContext.Provider>
    );
};

export const useAuction = () => useContext(AuctionContext);
