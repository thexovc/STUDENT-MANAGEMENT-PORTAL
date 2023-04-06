const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');

const app = express();

app.use(express.json()).use(express.urlencoded({ extended: false }));
