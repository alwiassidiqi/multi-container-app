require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
app.use(express.json());

const logDir = './logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logStream = fs.createWriteStream(`${logDir}/backend.log`, { flags: 'a' });

app.use((req, res, next) => {
  logStream.write(`[${new Date().toISOString()}] ${req.method} ${req.url}\n`);
  next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'testdb'
});

function connectWithRetry() {
  db.connect(err => {
    if (err) {
      console.error('Database connection failed: retrying in 5s...', err);
      setTimeout(connectWithRetry, 5000); // FIX: lowercase and remove extra ()
    } else {
      console.log('Connected to MySQL');
    }
  });
}

connectWithRetry();

app.get('/api/message', (req, res) => {
  res.json({ message: "Halo dari backend Node.js" });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO users (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, name });
  });
});

app.listen(5000, () => {
  console.log('Backend is running on port 5000');
});
