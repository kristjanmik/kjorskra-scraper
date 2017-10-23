const express = require('express');
const kjorskra = require('./kjorskra');

const PORT = process.env.PORT || 3400;

const app = express();

//CORS support for cross domains
app.use((req, res, next) => {
  const allowedHeaders = [
    'X-Requested-With',
    'Accept',
    'Origin',
    'Referer',
    'User-Agent',
    'Content-Type',
    'Authorization',
    'X-Mindflash-SessionID'
  ];

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));

  if (req.method !== 'OPTIONS') {
    return next();
  }

  return res.sendStatus(200);
});

app.get('/leita/:kennitala', async (req, res, next) => {
  kjorskra(req.params.kennitala).then(d => res.json(d), next);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
