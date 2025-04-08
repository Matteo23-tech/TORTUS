const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./turnos.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err.message);
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

// Crear la tabla 'turnos' si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS turnos (id INTEGER PRIMARY KEY AUTOINCREMENT, turno INTEGER, especialidad TEXT)");
});

module.exports = db;
