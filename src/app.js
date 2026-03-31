const express = require('express');
const auraRouter = require('./routes/aura');

const app = express();

app.use((req, res, next) => {
  const start = Date.now();
  console.log(`--> ${req.method} ${req.url}`, {
    query: req.query,
    headers: { authorization: req.headers['authorization'] ? '[present]' : '[absent]' },
  });

  res.on('finish', () => {
    console.log(`<-- ${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`);
  });

  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/aura', auraRouter);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
