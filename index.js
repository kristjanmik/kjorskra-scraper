const express = require('express');
const kjorskra = require('./kjorskra');

const PORT = process.env.PORT || 3400;

express()
  .get('/leita/:kennitala', async (req, res, next) => {
    kjorskra(req.params.kennitala).then(d => res.json(d),next);
  })
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });