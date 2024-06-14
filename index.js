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

// Configurar la tabla de contadores
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS counters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0
  )`);

  // Insertar datos iniciales
  db.run(`INSERT INTO counters (name, count) VALUES ('My Counter', 0)`);
});

// Ruta para obtener todos los contadores
app.get('/counters', (req, res) => {
  db.all(`SELECT * FROM counters`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ruta para incrementar el contador por ID
app.post('/increment/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM counters WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    db.run(`UPDATE counters SET count = count + 1 WHERE id = ?`, [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: id,
        name: row.name,
        count: row.count + 1
      });
    });
  });
});

// Ruta para reiniciar el contador por ID
app.post('/reset/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM counters WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    db.run(`UPDATE counters SET count = 0 WHERE id = ?`, [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: id,
        name: row.name,
        count: 0
      });
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
