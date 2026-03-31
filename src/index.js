require('dotenv').config();

if (!process.env.GITHUB_TOKEN) {
  console.error('ERROR: GITHUB_TOKEN is required');
  process.exit(1);
}

const app = require('./app');
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`Aura running on :${PORT}`));
