const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'database.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log(`Conectado ao SQLite em ${DB_PATH}`);
    initializeDatabase(db);
  }
});

function initializeDatabase(db) {
  db.serialize(() => {
    // CORREÇÃO: 'PRAGMA' em vez de 'PRAMA'
    db.run("PRAGMA foreign_keys = ON");
    
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        _id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        _id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        birthDate TEXT,
        hemophiliaType TEXT NOT NULL,
        severity TEXT,
        contact TEXT,
        address TEXT,
        healthStatus TEXT,
        createdBy TEXT REFERENCES users(_id),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        _id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        patient_id TEXT REFERENCES patients(_id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

module.exports = db;