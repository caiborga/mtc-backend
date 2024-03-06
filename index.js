const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('database.db');

db.run('CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, arrival TEXT, departure TEXT, burdens JSON)');
db.run('CREATE TABLE IF NOT EXISTS things (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, perPerson FLOAT, unit TEXT, weight FLOAT)');
db.run('CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start TEXT, end TEXT, participants JSON)');

app.use(express.json());

// PARTICIPANST

app.post('/api/participants', (req, res) => {
    const {name, arrival, departure, things} = req.body;
    db.run('INSERT INTO participants (name, arrival, departure, burdens) VALUES (?, ?, ?, ?)', [name, arrival, departure, JSON.stringify(things)], (err) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ message: 'Participant added successfully' });
    });
});

app.get('/api/participants', (req, res) => {
    db.all('SELECT * FROM participants', (err, rows) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ participants: rows });
    });
});

app.put('/api/participants/:id', (req, res) => {
    const userId = req.params.id;
    const { name, arrival, departure, burdens } = req.body;
  
    db.run(
      'UPDATE participants SET name = ?, arrival = ?, departure = ?, burdens = ? WHERE id = ?',
      [name, arrival, departure, JSON.stringify(burdens), userId],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
  
        res.json({ message: 'User updated successfully' });
      }
    );
});

app.delete('/api/participants/:id', (req, res) => {
    const userId = req.params.id;
  
    db.run('DELETE FROM participants WHERE id = ?', userId, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({ message: 'User deleted successfully' });
    });
});

// THINGS

app.get('/api/things', (req, res) => {
    db.all('SELECT * FROM things', (err, rows) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ things: rows });
    });
});

app.post('/api/things', (req, res) => {
    const {name, category, perPerson, unit, weight} = req.body;
    db.run('INSERT INTO things (name, category, perPerson, unit, weight) VALUES (?, ?, ?, ?, ?)', [name, category, perPerson, unit, weight], (err) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ message: 'Thing added successfully' });
    });
});

app.put('/api/things/:id', (req, res) => {
    const userId = req.params.id;
    const { name, arrival, departure, burdens } = req.body;
  
    db.run(
      'UPDATE things SET name = ?, category = ?, perPerson = ?, unit = ? WHERE id = ?',
      [name, arrival, departure, JSON.stringify(burdens), userId],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
  
        res.json({ message: 'Thing updated successfully' });
      }
    );
});

app.delete('/api/things/:id', (req, res) => {
    const userId = req.params.id;
  
    db.run('DELETE FROM things WHERE id = ?', userId, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({ message: 'Thing deleted successfully' });
    });
});

// TOURS

app.post('/api/tours', (req, res) => {
    const { name, start, end, participants } = req.body;
    db.run('INSERT INTO tours (name, start, end, participants) VALUES (?, ?, ?, ?)', [name, start, end, JSON.stringify(participants)], (err) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ message: 'Tour added successfully' });
    });
});

app.get('/api/tours', (req, res) => {
    db.all('SELECT * FROM tours', (err, rows) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ tours: rows });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
