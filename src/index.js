require('dotenv').config();

console.log('Starting up...', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '[set]' : '[missing]',
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER ? '[set]' : '[missing]',
  BASIC_AUTH_PASS: process.env.BASIC_AUTH_PASS ? '[set]' : '[missing]',
});

if (!process.env.GITHUB_TOKEN) {
  console.error('ERROR: GITHUB_TOKEN is required');
  process.exit(1);
}

const app = require('./app');
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`Aura running on :${PORT}`));
