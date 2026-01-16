const fs = require('fs');
const path = require('path');
const CATEGORIES = {
    BATSMAN: 'Batsman',
    BOWLER: 'Bowler',
    ALL_ROUNDER: 'All-Rounder',
    WICKET_KEEPER: 'Wicket-Keeper',
};

// Mock parsing logic
const parseLine = (row, headers) => {
    const values = row.split(',');
    const data = {};
    headers.forEach((h, i) => data[h] = values[i]?.trim());

    let role = data.role;
    if (data.is_wicketkeeper === 'Yes') role = 'Wicket Keeper';

    let standardCategory = 'Batsman';
    if (role.toLowerCase().includes('batter')) standardCategory = 'Batsman';
    else if (role.toLowerCase().includes('bowler')) standardCategory = 'Bowler';
    else if (role.toLowerCase().includes('all') && role.toLowerCase().includes('rounder')) standardCategory = 'All-Rounder';
    else if (role.toLowerCase().includes('keeper')) standardCategory = 'Wicket-Keeper';

    return {
        name: data.player,
        category: standardCategory,
        country: data.nationality === 'Indian' ? 'India' : 'Overseas',
        isUncapped: data.is_uncapped === 'Yes',
        originalRole: data.role,
        isWicketKeeperColumn: data.is_wicketkeeper
    };
};

// Read actual file or simulate
try {
    const csvContent = fs.readFileSync('final_batters_wicketkeepers.csv', 'utf-8');
    const rows = csvContent.trim().split('\n');
    const headers = rows[0].split(',').map(h => h.trim());

    console.log("Headers:", headers);

    const buttlerRow = rows.find(r => r.startsWith('Jos Buttler'));
    console.log("Raw Row:", buttlerRow);

    if (buttlerRow) {
        const parsed = parseLine(buttlerRow, headers);
        console.log("Parsed Object:", parsed);

        // Frontend logic check
        let displayCategory = '';
        if (parsed.category === CATEGORIES.BATSMAN || parsed.category === CATEGORIES.WICKET_KEEPER) {
            displayCategory = 'Batters';
        }

        const isIndian = parsed.country === 'India';
        const key = `${isIndian ? 'Indian' : 'Overseas'} ${displayCategory}`;
        console.log("Frontend Key:", key);
        console.log("Expected Frontend Key:", "Overseas Batters");
    }
} catch (e) {
    console.error(e);
}
