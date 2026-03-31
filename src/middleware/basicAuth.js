module.exports = (req, res, next) => {
  const header = req.headers['authorization'] || '';
  const base64 = header.replace('Basic ', '');
  const decoded = Buffer.from(base64, 'base64').toString();
  const [user, pass] = decoded.split(':');

  if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Aura"');
  res.status(401).send('Unauthorized');
};
