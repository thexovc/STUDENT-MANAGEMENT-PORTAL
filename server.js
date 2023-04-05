const path = require('path');

const { db } = require(path.join(__dirname, '.', 'Db', 'connection.js'));

const express = require('express');

const app = express();

app.use(express.json()).use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 4000;

app.listen(`${PORT}`);
