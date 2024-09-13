const express = require('express');
const mysql = require('mysql2');
const variables = require('dotenv').config(); // Cargar las variables de entorno
const cors = require('cors'); // Importar cors
const app = express();
const port = 3000;


// Habilitar CORS para que cualquier origen pueda acceder
app.use(cors());



// Conexión a la base de datos MySQL
// Crear un pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Límite de conexiones concurrentes
    queueLimit: 0        // No limitar la cola de conexiones
});



// Ruta: /proyectos/all
app.get('/proyectos/all', (req, res) => {
    const query = 'SELECT * FROM proyecto';
    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta: '+err);
        } else {
            res.json(results);
        }
    });
});

// Ruta: /proyectos/byName?name=NombreProyecto
app.get('/proyectos/byName', (req, res) => {
    let { name } = req.query;
    name = "%"+name+"%";
    const query = 'SELECT * FROM proyecto WHERE titulo like ?';
    pool.query(query, [name], (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta');
            console.log(err);
        } else {
            res.json(results);
        }
    });
});

// Ruta: /proyectos/procesos
app.get('/proyectos/proceso', (req, res) => {
    const { estado } = req.query;
    const query = 'SELECT * FROM proyecto WHERE estado = "EN_PROCESO"';
    pool.query(query, [estado], (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta');
        } else {
            res.json(results);
        }
    });
});

// Ruta: /proyectos/finalizados
app.get('/proyectos/finalizados', (req, res) => {
    const { estado } = req.query;
    const query = 'SELECT * FROM proyecto WHERE estado = "FINALIZADOS"';
    pool.query(query, [estado], (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta');
        } else {
            res.json(results);
        }
    });
});

// Ruta: /proyectos/sinempezar
app.get('/proyectos/sinempezar', (req, res) => {
    const { estado } = req.query;
    const query = 'SELECT * FROM proyecto WHERE estado = "SIN_EMPEZAR"';
    pool.query(query, [estado], (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta');
        } else {
            res.json(results);
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
