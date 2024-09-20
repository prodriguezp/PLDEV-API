const express = require('express');
const mysql = require('mysql2');
const variables = require('dotenv').config(); // Cargar las variables de entorno
const cors = require('cors'); // Importar cors
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

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
    const query = 'SELECT * FROM proyecto WHERE LOWER(titulo) like LOWER(?)';
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

// Ruta: /inicio/json
app.get('/inicio/json', (req, res) => {
    const jsonPath = path.join(__dirname, 'inicio-datos.json'); // Reemplaza con el nombre de tu archivo JSON

    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo JSON');
            console.log(err);
        } else {
            try {
                const jsonData = JSON.parse(data); // Convierte el contenido en un objeto JSON
                res.json(jsonData); // Envía el JSON como respuesta
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo JSON');
                console.log(parseError);
            }
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
