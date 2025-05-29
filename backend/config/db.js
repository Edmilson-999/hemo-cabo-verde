const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conexão com o banco
const db = new sqlite3.Database(
  path.resolve(__dirname, 'database.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error('Erro de conexão:', err.message);
    else console.log('Conectado ao SQLite!');
  }
);

// Criar tabelas (se não existirem)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;