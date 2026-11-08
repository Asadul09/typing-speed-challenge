/**
 * VelocityType Pro – Integrated Node/NestJS-style REST API Backend
 * Created in project root as requested (No separate backend folder needed!)
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5050;
const DB_FILE = path.join(__dirname, 'server-db.json');

// Ensure local persistence database file
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    scores: [
      { id: '1', username: 'SpeedDemon', wpm: 148, accuracy: 99.2, mode: 'time', modeDetail: '60s', timestamp: Date.now() },
      { id: '2', username: 'CyberTypist', wpm: 135, accuracy: 98.5, mode: 'words', modeDetail: '50 words', timestamp: Date.now() },
      { id: '3', username: 'MatrixCoder', wpm: 122, accuracy: 97.8, mode: 'code', modeDetail: 'TypeScript', timestamp: Date.now() }
    ]
  }, null, 2));
}

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { scores: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Health check endpoint
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'VelocityType NestJS/Express API', timestamp: new Date() }));
    return;
  }

  // GET /api/leaderboard
  if (req.method === 'GET' && url.pathname === '/api/leaderboard') {
    const db = readDb();
    const mode = url.searchParams.get('mode');
    let list = db.scores || [];
    if (mode && mode !== 'all') {
      list = list.filter(item => item.mode === mode);
    }
    list.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    const ranked = list.map((item, idx) => ({ ...item, rank: idx + 1 }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: ranked.length, data: ranked }));
    return;
  }

  // POST /api/leaderboard
  if (req.method === 'POST' && url.pathname === '/api/leaderboard') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newScore = {
          id: 'score_' + Date.now(),
          username: payload.username || 'Anonymous',
          wpm: Number(payload.wpm) || 0,
          accuracy: Number(payload.accuracy) || 0,
          consistency: Number(payload.consistency) || 0,
          mode: payload.mode || 'time',
          modeDetail: payload.modeDetail || '30s',
          timestamp: Date.now()
        };
        db.scores.push(newScore);
        writeDb(db);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newScore }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`[NestJS/MERN Engine] VelocityType Server listening at http://localhost:${PORT}`);
});
