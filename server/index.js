const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { store, initDb } = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for bulk sync

// Initialize Database
initDb();

// --- Auth Routes ---

// Login (Initial App Load)
app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    const storedHash = store.getSettings().password;

    if (bcrypt.compareSync(password, storedHash)) {
        res.json({ success: true, token: 'session_valid' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Password' });
    }
});

// Verify Action
app.post('/api/auth/verify', (req, res) => {
    const { password } = req.body;
    const storedHash = store.getSettings().password;

    if (bcrypt.compareSync(password, storedHash)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// --- State Routes ---

app.get('/api/state', (req, res) => {
    try {
        const teams = store.getTeams();
        const players = store.getPlayers();
        const status = store.getSettings().status;
        const myTeamId = store.getSettings().myTeamId;

        res.json({
            teams,
            players,
            status,
            myTeamId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch state' });
    }
});

// Sync Full State
app.post('/api/state/sync', (req, res) => {
    const { teams, players } = req.body;
    try {
        store.syncState(teams, players);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sync failed' });
    }
});

app.post('/api/select-team', (req, res) => {
    const { teamId } = req.body;
    try {
        store.updateSetting('myTeamId', teamId);
        res.json({ success: true, myTeamId: teamId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update selection' });
    }
});

// --- Admin control Routes ---

app.post('/api/admin/status', (req, res) => {
    const { status } = req.body;
    store.updateSetting('status', status);
    res.json({ success: true, status });
});

app.post('/api/admin/reset', (req, res) => {
    store.reset();
    res.json({ success: true, message: 'Auction Reset' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
