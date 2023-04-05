const path = require('path');

const Db = require(path.join(__dirname, 'Db', 'connection'));

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');

const app = express();

Db();

app.use(express.json()).use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.listen(`${PORT}`);
