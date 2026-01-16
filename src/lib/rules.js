import { BASE_PRICES, CATEGORIES } from '../data/players';

// Validate Bid Increments
export const getNextBidAmount = (currentBid) => {
    if (currentBid < 10000000) { // < 1 Cr
        return currentBid + 1000000; // + 10L
    } else if (currentBid < 50000000) { // 1 Cr - 5 Cr
        return currentBid + 2000000; // + 20L
    } else if (currentBid < 100000000) { // 5 Cr - 10 Cr
        return currentBid + 2500000; // + 25L
    } else { // > 10 Cr
        return currentBid + 5000000; // + 50L
    }
};

export const formatMoney = (amount) => {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(0)} L`;
};

// Team Validation Rules
export const MAX_SQUAD_SIZE = 15;
export const MIN_SQUAD_SIZE = 12;
export const MAX_OVERSEAS = 5;

// Minimum Role Requirements
export const MIN_ROLES = {
    [CATEGORIES.BATSMAN]: 4,
    [CATEGORIES.BOWLER]: 3,
    [CATEGORIES.ALL_ROUNDER]: 1,
    [CATEGORIES.WICKET_KEEPER]: 1,
};

export const validateBid = (team, amount) => {
    if (team.budget < amount) {
        return { valid: false, message: 'Insufficient budget!' };
    }
    if (team.squad.length >= MAX_SQUAD_SIZE) {
        return { valid: false, message: 'Squad is full (Max 15)!' };
    }
    return { valid: true };
};

export const checkSquadRequirements = (squad) => {
    const counts = {
        [CATEGORIES.BATSMAN]: 0,
        [CATEGORIES.BOWLER]: 0,
        [CATEGORIES.ALL_ROUNDER]: 0,
        [CATEGORIES.WICKET_KEEPER]: 0,
        total: squad.length,
        overseas: 0,
    };

    squad.forEach(player => {
        if (counts[player.category] !== undefined) {
            counts[player.category]++;
        }
        if (player.country === 'Overseas') {
            counts.overseas++;
        }
    });

    const issues = [];
    if (counts.total < MIN_SQUAD_SIZE) issues.push(`Need at least ${MIN_SQUAD_SIZE} players`);
    if (counts[CATEGORIES.BATSMAN] < MIN_ROLES[CATEGORIES.BATSMAN]) issues.push(`Need ${MIN_ROLES[CATEGORIES.BATSMAN]} Batsmen`);
    if (counts[CATEGORIES.BOWLER] < MIN_ROLES[CATEGORIES.BOWLER]) issues.push(`Need ${MIN_ROLES[CATEGORIES.BOWLER]} Bowlers`);
    if (counts[CATEGORIES.ALL_ROUNDER] < MIN_ROLES[CATEGORIES.ALL_ROUNDER]) issues.push(`Need ${MIN_ROLES[CATEGORIES.ALL_ROUNDER]} All-Rounder`);
    if (counts[CATEGORIES.WICKET_KEEPER] < MIN_ROLES[CATEGORIES.WICKET_KEEPER]) issues.push(`Need ${MIN_ROLES[CATEGORIES.WICKET_KEEPER]} Wicket-Keeper`);
    if (counts.overseas > MAX_OVERSEAS) issues.push(`Max ${MAX_OVERSEAS} Overseas players allowed`);

    return { isValid: issues.length === 0, issues, counts };
};
