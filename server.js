require('dotenv').config({ path: 'C:/Users/User/Documents/GitHub/Usicode/.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexão com banco
const db = new sqlite3.Database('leads.db');

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  telefone TEXT,
  email TEXT,
  empresa TEXT,
  setor TEXT
)`);

// Rotas
app.get('/leads', (req, res) => {
  db.all('SELECT * FROM leads', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/leads', (req, res) => {
  const { nome, telefone, email, empresa, setor } = req.body;
  db.run(
    'INSERT INTO leads (nome, telefone, email, empresa, setor) VALUES (?, ?, ?, ?, ?)',
    [nome, telefone, email, empresa, setor],
    function (err) {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/leads/:id', (req, res) => {
  const { nome, telefone, email, empresa, setor } = req.body;
  db.run(
    'UPDATE leads SET nome = ?, telefone = ?, email = ?, empresa = ?, setor = ? WHERE id = ?',
    [nome, telefone, email, empresa, setor, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.sendStatus(204);
    }
  );
});

app.delete('/leads/:id', (req, res) => {
  db.run('DELETE FROM leads WHERE id = ?', req.params.id, function (err) {
    if (err) return res.status(500).json(err);
    res.sendStatus(204);
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));