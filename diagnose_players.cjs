const fs = require('fs');
const path = require('path');

// Mock Constants
const CATEGORIES = {
    BATSMAN: 'Batsman',
    BOWLER: 'Bowler',
    ALL_ROUNDER: 'All-Rounder',
    WICKET_KEEPER: 'Wicket-Keeper',
};

try {
    const dbPath = path.join('server', 'store.json');
    if (!fs.existsSync(dbPath)) {
        console.error("store.json not found");
        process.exit(1);
    }
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const players = db.players;

    console.log(`Total Players in DB: ${players.length}`);

    const grouped = {};
    const unmapped = [];
    const validKeys = [
        'Indian Batters', 'Overseas Batters',
        'Indian Bowlers', 'Overseas Bowlers',
        'Indian All-Rounders', 'Overseas All-Rounders'
    ];

    players.forEach(player => {
        const isIndian = player.country === 'India';
        let key = '';

        // Exact logic from PlayerPool.jsx
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

        if (key && validKeys.includes(key)) {
            if (!grouped[key]) grouped[key] = 0;
            grouped[key]++;
        } else {
            unmapped.push({
                name: player.name,
                category: player.category,
                country: player.country,
                originalRole: player.originalRole
            });
        }
    });

    console.log("\n--- Group Counts ---");
    Object.keys(grouped).forEach(k => console.log(`${k}: ${grouped[k]}`));

    const mappedCount = Object.values(grouped).reduce((a, b) => a + b, 0);
    console.log(`\nTotal Mapped: ${mappedCount}`);

    console.log("\n--- Unmapped Players ---");
    console.log(`Count: ${unmapped.length}`);
    if (unmapped.length > 0) {
        console.table(unmapped);
    }

} catch (e) {
    console.error(e);
}
