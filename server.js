const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Aggiungi questa riga
const db = require('./database');

const app = express();
const PORT = 3000;

// Configura il middleware CORS
app.use(cors()); // Aggiungi questa riga

app.use(bodyParser.json());

// Le rotte API rimangono le stesse
app.post('/reservations', (req, res) => {
  const { name, date, time, partySize } = req.body;
  db.run('INSERT INTO reservations (name, date, time, partySize) VALUES (?, ?, ?, ?)',
    [name, date, time, partySize], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    });
});

app.get('/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ reservations: rows });
  });
});

app.put('/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { name, date, time, partySize } = req.body;
  db.run('UPDATE reservations SET name = ?, date = ?, time = ?, partySize = ? WHERE id = ?',
    [name, date, time, partySize, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changedRows: this.changes });
    });
});

app.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM reservations WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deletedRows: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
