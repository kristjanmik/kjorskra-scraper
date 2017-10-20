const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

(async () => {
  app.get('/leita/:kennitala', async (req, res, next) => {
    try {
      const { kennitala } = req.params;

      const data = await getData(kennitala);

      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const getData = async kennitala => {
    console.log('what is browser', browser);
    let page = await browser.newPage();

    await page.goto('https://kjorskra.skra.is/kjorskra/', {
      waitUntil: 'networkidle'
    });
    await page.focus('#txtKennitala_I');
    await page.type('#txtKennitala_I', (kennitala || '').toString(), {
      delay: 0
    });
    await page.click('#btnLeit_CD');
    await page.waitFor('#ASPxGridView1_DXDataRow0', { timeout: 5000 });

    const cells = await page.$$('#ASPxGridView1_DXDataRow0 td');

    const data = await Promise.all(
      [...cells].map(async rowElement => {
        const items = await page.evaluate(async el => {
          const tds = el.querySelectorAll('td');
          console.log('el', el.textContent.trim());
          return el.textContent.trim();
        }, rowElement);

        return items;
      })
    );

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
