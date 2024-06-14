const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

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
    endTime INTEGER DEFAULT 0
  )`);

  // Insertar datos iniciales (temporizadores de 2 horas y 1 hora)
  db.run(`INSERT OR IGNORE INTO timers (id, name, duration, endTime) VALUES 
    (1, 'Temporizador 2 horas', 7200000, 0),
    (2, 'Temporizador 1 hora', 3600000, 0)`);
});

// Ruta para iniciar el temporizador por ID
app.post('/start-timer/:id', (req, res) => {
  const { id } = req.params;

  const query = `UPDATE timers SET endTime = ? WHERE id = ?`;
  const durationQuery = `SELECT duration FROM timers WHERE id = ?`;

  db.get(durationQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    const duration = row.duration;
    const endTime = Date.now() + duration;

    db.run(query, [endTime, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, endTime });
    });
  });
});

// Ruta para obtener el estado del temporizador por ID
app.get('/get-timer/:id', (req, res) => {
  const { id } = req.params;

  const query = `SELECT endTime FROM timers WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row || { endTime: 0 }); // Si no hay resultados, retorna endTime = 0
  });
});

// Ruta para detener el temporizador por ID
app.post('/stop-timer/:id', (req, res) => {
  const { id } = req.params;

  const query = `UPDATE timers SET endTime = 0 WHERE id = ?`;
  db.run(query, [id], function(err) {
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
