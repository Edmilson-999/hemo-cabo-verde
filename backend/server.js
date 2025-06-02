require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Configuração do banco de dados SQLite
const db = new sqlite3.Database(
    path.resolve(__dirname, './database.db'),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('Erro ao conectar ao SQLite:', err.message);
        } else {
            console.log('Conectado ao banco SQLite com sucesso!');
            initializeDatabase(db);
        }
    }
);

// Função para inicializar o banco de dados
function initializeDatabase(db) {
    db.serialize(() => {
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
    });
}

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disponibiliza a conexão com o banco para toda a aplicação
app.set('db', db);

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));

// Configuração para produção
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
    });
}

// Middleware de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Erro interno no servidor',
        error: err.message 
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
});