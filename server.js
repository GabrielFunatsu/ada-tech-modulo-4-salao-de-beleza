const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 8008;


const db = new sqlite3.Database(':memory:'); 

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS agendamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data TEXT, hora TEXT, servico TEXT)');
});

app.use(cors());
app.use(express.json());


app.post('/api/agendamentos', (req, res) => {
  const { nome, data, hora, servico } = req.body;

  db.run('INSERT INTO agendamentos (nome, data, hora, servico) VALUES (?, ?, ?, ?)', [nome, data, hora, servico], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao inserir agendamento.' });
    }

    return res.status(201).json({ message: 'Agendamento criado com sucesso.' });
  });
});


app.get('/api/agendamentos', (req, res) => {
  db.all('SELECT * FROM agendamentos', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao obter agendamentos.' });
    }

    return res.status(200).json(rows);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
