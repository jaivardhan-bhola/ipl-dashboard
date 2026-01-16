const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'store.json');

// Initial Data Structure
const initialData = {
    settings: {
        // Default password: admin123
        password: bcrypt.hashSync('admin123', 10),
        status: 'PAUSED',
        myTeamId: null, // Stores the user's selected team
    },
    teams: [],
    players: []
};

// Data Cache
let db = initialData;

// Load Data from File
function initDb() {
    if (!fs.existsSync(dbPath)) {
        console.log("Creating new DB with seed data...");
        if (seedPlayers.length > 0) {
            db.players = JSON.parse(JSON.stringify(seedPlayers));
        }
        saveDb();
    } else {
        try {
            const raw = fs.readFileSync(dbPath, 'utf-8');
            db = JSON.parse(raw);
        } catch (e) {
            console.error("Failed to read DB, resetting:", e);
            saveDb();
        }
    }
}

// Save Data to File
function saveDb() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (e) {
        console.error("Failed to save DB:", e);
    }
}

// Data Access Object
// Use seed data if available
// Data Access Object
// Use seed data from CSVs
let seedPlayers = [];
try {
    const csv = require('fs');

    const parseCSV = (filePath, categoryOverride = null) => {
        const absolutePath = path.join(__dirname, '..', filePath);
        if (!fs.existsSync(absolutePath)) {
            console.warn(`CSV not found: ${absolutePath}`);
            return [];
        }

        const fileContent = fs.readFileSync(absolutePath, 'utf-8');
        const rows = fileContent.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim());

        return rows.slice(1).map((row, index) => {
            // Handle commas inside quotes if necessary, but assuming simple CSV for now
            // Better: use a simple regex or split if data is clean
            const values = row.split(','); // rudimentary split
            const data = {};
            headers.forEach((h, i) => data[h] = values[i]?.trim());

            // Map to internal structure
            // CSV Headers: player,role,nationality,is_wicketkeeper,is_uncapped,auction_set,batting_score/bowling_score/etc

            let role = data.role;
            if (data.is_wicketkeeper === 'Yes') role = 'Wicket Keeper';
            // Normalize Role to match CATEGORIES constants if possible, or keep as string
            // "Batter", "Bowler", "All-Rounder", "Wicketkeeper"

            // Map csv role to standard categories
            let standardCategory = 'Batsman'; // Default
            if (role.toLowerCase().includes('batter')) standardCategory = 'Batsman';
            else if (role.toLowerCase().includes('bowler')) standardCategory = 'Bowler';
            else if (role.toLowerCase().includes('all') && role.toLowerCase().includes('rounder')) standardCategory = 'All-Rounder';
            else if (role.toLowerCase().includes('keeper')) standardCategory = 'Wicket-Keeper';

            return {
                id: data.player + '_' + index + '_' + Math.random().toString(36).substr(2, 5), // Generate unique ID
                name: data.player,
                category: standardCategory,
                country: data.nationality === 'Indian' ? 'India' : 'Overseas',
                basePrice: 20000000, // Default base price
                isUncapped: data.is_uncapped === 'Yes',
                status: 'Available',
                rating: 85, // Default or calculate from score
                soldTo: null,
                soldPrice: 0,
                // Original Data preserved for reference
                originalRole: role,
                auctionSet: data.auction_set,
                stats: {
                    battingScore: parseFloat(data.batting_score || 0),
                    bowlingScore: parseFloat(data.bowling_score || 0),
                    allrounderScore: parseFloat(data.allrounder_score || 0)
                }
            };
        });
    };

    const batters = parseCSV('final_batters_wicketkeepers.csv');
    const bowlers = parseCSV('final_bowlers.csv');
    const allrounders = parseCSV('final_allrounders.csv');

    seedPlayers = [...batters, ...bowlers, ...allrounders];
    console.log(`Loaded ${seedPlayers.length} players from CSVs.`);

} catch (e) {
    console.error("Failed to load CSV seed data:", e);
    // Fallback to empty or keep existing logic if needed, but for now just warn
    seedPlayers = [];
}

const store = {
    getSettings: () => db.settings,
    updateSetting: (key, value) => {
        db.settings[key] = value;
        saveDb();
    },

    getTeams: () => db.teams,
    setTeams: (teams) => {
        db.teams = teams;
        saveDb();
    },

    getPlayers: () => db.players,
    setPlayers: (players) => {
        db.players = players;
        saveDb();
    },

    // Bulk Sync
    syncState: (teams, players) => {
        if (teams) db.teams = teams;
        if (players) db.players = players;
        saveDb();
    },

    reset: () => {
        db.teams = []; // Teams can be empty or reset to initial default
        db.players = JSON.parse(JSON.stringify(seedPlayers)); // Reset to initial seed
        db.settings.status = 'PAUSED';
        db.settings.myTeamId = null;
        saveDb();
    }
};

module.exports = { store, initDb };
