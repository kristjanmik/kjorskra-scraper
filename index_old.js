const express = require('express');
const app = express();
const { exec } = require('child_process');

(async () => {
  app.get('/leita/:kennitala', async (req, res, next) => {
    console.log(`${new Date()} Doing lookup`);
    try {
      const { kennitala } = req.params;

      const data = await getData(kennitala);

      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  const getData = async kennitala => {
    console.log('getData', `node scrape.js ${kennitala}`);
    const rawData = await new Promise((resolve, reject) => {
      exec(`node scrape.js ${kennitala}`, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout);
      });
    });

    const data = JSON.parse(rawData);
    return {
      kennitala: data[0],
      nafn: data[1],
      logheimili: data[2],
      kjordaemi: data[3],
      sveitafelag: data[4],
      kjorstadur: data[5],
      kjordeild: data[6]
    };
  };

  app.listen(3400, () => {
    console.log('Listening on port 3400');
  });
})();
