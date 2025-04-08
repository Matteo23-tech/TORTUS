const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: '*' }));
// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./turnos.db', (err) => {
  if (err) console.error('❌ Error al conectar con la BD:', err.message);
  else console.log('✅ Conectado a SQLite.');
});

// Crear la tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    turno TEXT NOT NULL,
    especialidad TEXT NOT NULL,
    llamado INTEGER DEFAULT 0
  )
`);

// Obtener todos los turnos
app.get('/turnos', (req, res) => {
  db.all("SELECT * FROM turnos ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los turnos' });
    res.json(rows);
  });
});

// Agregar un nuevo turno
app.post('/turnos', (req, res) => {
  const { turno, especialidad } = req.body;
  if (!turno || !especialidad) return res.status(400).json({ error: 'Faltan datos' });

  db.run("INSERT INTO turnos (turno, especialidad) VALUES (?, ?)", [turno, especialidad], function (err) {
    if (err) return res.status(500).json({ error: 'Error al agregar el turno' });
    res.json({ message: '✅ Turno agregado', id: this.lastID });
  });
});

// Llamar un turno desde Secretaría
app.post('/turno-actual', (req, res) => {
  const { turno, especialidad } = req.body;
  if (!turno || !especialidad) return res.status(400).json({ error: 'Faltan datos' });

  db.serialize(() => {
    db.run("UPDATE turnos SET llamado = 0", [], (err) => {
      if (err) return res.status(500).json({ error: 'Error al resetear llamados' });
    });

    db.run("UPDATE turnos SET llamado = 1 WHERE turno = ? AND especialidad = ?", [turno, especialidad], function (err) {
      if (err) return res.status(500).json({ error: 'Error al llamar el turno' });
      res.json({ message: '✅ Turno llamado', turno, especialidad });
    });
  });
});

// Obtener el turno actualmente llamado
app.get('/turno-actual', (req, res) => {
  db.get("SELECT * FROM turnos WHERE llamado = 1", (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el turno actual' });
    res.json(row || { turno: null });
  });
});

// Eliminar un turno cuando es atendido
app.delete('/turnos/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM turnos WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar el turno' });
    res.json({ message: '✅ Turno eliminado' });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
