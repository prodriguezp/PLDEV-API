const express = require('express');
const mysql = require('mysql2');
const variables = require('dotenv').config(); // Cargar las variables de entorno

const app = express();
const port = 3000;

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.message);
    } else {
        console.log('Conectado a la base de datos MySQL.');
    }
});

// Ruta: /proyectos/all
app.get('/proyectos/all', (req, res) => {
    const query = 'SELECT * FROM proyecto';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta');
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
    connection.query(query, [name], (err, results) => {
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
    connection.query(query, [estado], (err, results) => {
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
    connection.query(query, [estado], (err, results) => {
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
    connection.query(query, [estado], (err, results) => {
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
