const fs = require('fs');
const path = require('path');

const CATEGORIES = {
    BATSMAN: 'Batsman',
    BOWLER: 'Bowler',
    ALL_ROUNDER: 'All-Rounder',
    WICKET_KEEPER: 'Wicket-Keeper',
};

// 1. Indian Batters
const INDIAN_BATTERS = [
    "Ramandeep Singh", "Riyan Parag", "Sai Sudharsan", "Shikhar Dhawan", "SuryaKumar Yadav",
    "Dhruv Jurel", "Devonutt Padikkal", "Shreyas Iyer", "KL Rahul", "MS Dhoni",
    "Ruturaj Gaikwad", "Rishabh Pant", "Karun nair", "Yashasvi Jaiswal", "Abhishek Sharma",
    "Dinesh Karthik(wk)", "Sanju Samson", "Nitish Rana", "Sarfaraz Khan", "Mayank Aggarwal",
    "Ajinkya Rahane", "Ishan Kishan", "Rinku Singh", "Tilak Varma", "Virat Kohli",
    "Rajat Patidar", "Manish Pandey", "Suryakumar Yadav", "Rohit Sharma",
    "Jitesh Sharma", "Wriddhiman Saha", "Devdutt Padikkal", "shubman gill"
    // Removed Venkatesh Iyer from here as he is in All-Rounders now to avoid duplicates if desired, 
    // but safe to keep if user wants him in both. I'll remove him to be cleaner.
];

// 2. Indian Bowlers
const INDIAN_BOWLERS = [
    "Ishant Sharma", "Mohsin Khan", "Sai Kishore", "Jasprit Bumrah", "Avesh Khan",
    "Mohammed Shami", "Harshal Patel", "Tushar Deshpande", "Arshdeep Singh", "Varun Chakravarthy",
    "Ravi Bishnoi", "Harpreet Brar", "Umesh Yadav", "Deepak Chahar", "Bhuvneshwar Kumar",
    "Mayank Markande", "Piyush Chawla", "Harshit Rana", "T Natarajan", "Mohammed Siraj",
    "Mohit Sharma", "Sandeep Sharma", "Aakash Deep", "Prasidh Krishna", "Yuzvendra Chahal",
    "Rahul Chahar", "Khaleel Ahmed", "Kuldeep Yadav", "Amit Mishra"
];

// 3. Indian All-Rounders (New)
const INDIAN_ALL_ROUNDERS = [
    "Venkatesh Iyer", "Ravindra Jadeja", "Rahul Tewatia", "vijay shankar", "Krunal Pandya",
    "Hardik Pandya", "Axar Patel", "Washington Sundar", "nitish reddy", "Shardul Thakur",
    "Deepak Hooda", "ravi ashwin", "Shivam Dube", "shahbaz ahmed"
];

let finalPlayers = [];
let idCounter = 1;

// Helper to add players
const addPlayers = (names, category, country) => {
    names.forEach(name => {
        finalPlayers.push({
            id: idCounter++,
            name: name.trim(),
            category: category,
            country: country,
            basePrice: 20000000,
            isUncapped: false,
            status: 'Available',
            rating: 80 + Math.floor(Math.random() * 15),
            soldTo: null,
            soldPrice: 0
        });
    });
};

// Add All Categories
addPlayers(INDIAN_BATTERS, CATEGORIES.BATSMAN, 'India');
addPlayers(INDIAN_BOWLERS, CATEGORIES.BOWLER, 'India');
addPlayers(INDIAN_ALL_ROUNDERS, CATEGORIES.ALL_ROUNDER, 'India');

console.log(`Generated ${finalPlayers.length} total players.`);
console.log(`- Indian Batters: ${INDIAN_BATTERS.length}`);
console.log(`- Indian Bowlers: ${INDIAN_BOWLERS.length}`);
console.log(`- Indian All-Rounders: ${INDIAN_ALL_ROUNDERS.length}`);

// Write to src/data/players.json
const outputPath = path.join(__dirname, '../src/data/players.json');
fs.writeFileSync(outputPath, JSON.stringify(finalPlayers, null, 2));
console.log(`Saved to ${outputPath}`);
