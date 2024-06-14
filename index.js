const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'db', 'mydatabase.db');
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(cors());

// Configurar la tabla de temporizadores
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS timers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    endTime INTEGER
  )`);

  // Insertar datos iniciales
  db.run(`INSERT INTO timers (name, duration) VALUES ('Timer 1', 7200000)`); // 2 horas en milisegundos
  db.run(`INSERT INTO timers (name, duration) VALUES ('Timer 2', 3600000)`); // 1 hora en milisegundos
});

// Ruta para iniciar el temporizador
app.post('/start-timer/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM timers WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    const endTime = Date.now() + row.duration;

    db.run(`UPDATE timers SET endTime = ? WHERE id = ?`, [endTime, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: id,
        name: row.name,
        endTime: endTime
      });
    });
  });
});

// Ruta para obtener el estado del temporizador
app.get('/get-timer/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT endTime FROM timers WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    res.json(row);
  });
});

// Ruta para detener el temporizador
app.post('/stop-timer/:id', (req, res) => {
  const { id } = req.params;

  db.run(`UPDATE timers SET endTime = NULL WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ id });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
