const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'school.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const seedSql = fs.readFileSync(seedPath, 'utf8');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.exec(schemaSql, (schemaErr) => {
    if (schemaErr) {
      console.error('Error al crear el esquema:', schemaErr.message);
      process.exit(1);
    }

    db.exec(seedSql, (seedErr) => {
      if (seedErr) {
        console.error('Error al insertar datos iniciales:', seedErr.message);
        process.exit(1);
      }

      console.log(`Base de datos inicializada en: ${dbPath}`);
      db.close();
    });
  });
});
