const express = require('express');
const auraRouter = require('./routes/aura');

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/aura', auraRouter);

module.exports = app;
