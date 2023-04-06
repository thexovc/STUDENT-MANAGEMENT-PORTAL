const path = require('path');

const Db = require(path.join(__dirname, 'Db', 'connection'));

const { app } = require(path.join(__dirname, 'app'));

Db();

const PORT = process.env.PORT || 5000;

app.listen(`${PORT}`);
