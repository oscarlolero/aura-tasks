const express = require('express');
const auraRouter = require('./routes/aura');

const app = express();

app.use('/aura', auraRouter);

module.exports = app;
