require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors({
    origin: [process.env.URL_APP, 'http://127.0.0.1:4200']
}));

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio público
app.use(express.static('public'));

// Configure Middleware
app.use(express.urlencoded({ extended: true }));

// Rutas Corporative Page
app.use('/api/reviews', require('./routes/corpo-page/reviews'));
app.use('/api/contact', require('./routes/corpo-page/contact'));

// Rutas Backoffice
app.use('/api/login', require('./routes/backoffice/auth'));
app.use('/api/usuarios', require('./routes/backoffice/usuarios'));

// cualquier otra ruta
/* app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
}) */



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});

