const puppeteer = require('puppeteer');

(async () => {
  const kennitala = process.argv[2];

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

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

  console.log(JSON.stringify(data));

  browser.close();
})();
