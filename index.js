const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const backendPort = 3000;
const frontendPort = 4200;

const db = new sqlite3.Database('database.db');

db.run('CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, avatar TEXT)');
db.run('CREATE TABLE IF NOT EXISTS things (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, perPerson FLOAT, unitID FLOAT, weight FLOAT)');
db.run('CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY AUTOINCREMENT, tourData TEXT, tourParticipants TEXT, tourThings TEXT, tourCars TEXT)');

app.use(express.json());

app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + frontendPort);
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
next();
});

// PARTICIPANTS

app.post('/api/participants', (req, res) => {
    const {name, avatar} = req.body;

    db.run('INSERT INTO participants (name, avatar) VALUES (?, ?)', [name, avatar], (err) => {
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
    const { name, avatar } = req.body;

    db.run('UPDATE participants SET name = ?, avatar = ? WHERE id = ?',
    [name, avatar, userId],
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
    const {name, category, perPerson, unitID, weight} = req.body;
    db.run('INSERT INTO things (name, category, perPerson, unitID, weight) VALUES (?, ?, ?, ?, ?)', [name, category, perPerson, unitID, weight], (err) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ message: 'Thing added successfully' });
    });
});

app.put('/api/things/:id', (req, res) => {
    const thingID = req.params.id;
    const { name, category, perPerson, unitID, weight } = req.body;

    db.run(
    'UPDATE things SET name = ?, category = ?, perPerson = ?, unitID = ?, weight = ? WHERE id = ?',
    [name, category, perPerson, unitID, weight, thingID],
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
const { tourData, tourParticipants, tourThings, tourCars } = req.body;

    db.run('INSERT INTO tours (tourData, tourParticipants, tourThings, tourCars) VALUES (?, ?, ?, ?)', [tourData, tourParticipants, tourThings, tourCars], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tour added successfully' });
    });
});

app.get('/api/tour/:id', (req, res) => {
const tourId = req.params.id;
db.get('SELECT * FROM tours WHERE id = ?', [tourId], (err, row) => {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    }
    if (!row) {
    res.status(404).json({ error: 'Tour not found' });
    return;
    }
    res.json({ tour: row });
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

app.put('/api/tour/:id', (req, res) => {
    const tourID = req.params.id;
    const { tourData, tourParticipants, tourThings, tourCars } = req.body;
    console.log(req.body)

    db.run(
        'UPDATE tours SET tourData = ?, tourParticipants = ?, tourThings = ?, tourCars = ? WHERE id = ?',
        [tourData, tourParticipants, tourThings, tourCars, tourID],
        function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tour updated successfully' });
        }
    );
});

app.put('/api/tour/:id/cars', (req, res) => {
    const tourID = req.params.id;
    const { tourCars } = req.body;
    console.log(req.body)

    db.run(
        'UPDATE tours SET tourCars = ? WHERE id = ?',
        [tourCars, tourID],
        function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tour Cars updated successfully' });
        }
    );
});

app.put('/api/tour/:id/data', (req, res) => {
    const tourID = req.params.id;
    const { tourData } = req.body;
    console.log(req.body)

    db.run(
        'UPDATE tours SET tourData = ? WHERE id = ?',
        [tourData, tourID],
        function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tour Data updated successfully' });
        }
    );
});

app.put('/api/tour/:id/participants', (req, res) => {
    const tourID = req.params.id;
    const { tourParticipants } = req.body;
    console.log(req.params.id)
    console.log(req.body)

    db.run(
        'UPDATE tours SET tourParticipants = ? WHERE id = ?',
        [tourParticipants, tourID],
        function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tour Participants updated successfully' });
        }
    );
});

app.put('/api/tour/:id/things', (req, res) => {
    const tourID = req.params.id;
    const { tourThings } = req.body;
    console.log(req.params.id)
    console.log(req.body)

    db.run(
        'UPDATE tours SET tourThings = ? WHERE id = ?',
        [tourThings, tourID],
        function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Tour Things updated successfully' });
        }
    );
});

app.delete('/api/tours/:id', (req, res) => {
const userId = req.params.id;

db.run('DELETE FROM tours WHERE id = ?', userId, function(err) {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    }

    res.json({ message: 'Tour deleted successfully' });
});
});


app.listen(backendPort, () => {
    console.log(`Server is running on port ${backendPort}`);
});
