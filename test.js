const kjorskra = require('./kjorskra');

(async () => {
  const kennitala = 2804932879;

  const scrape = async index => {
    console.log(`${index} starting`);
    const result = await kjorskra(kennitala);
    console.log(`${index} done, success: ${result.success}`);
  };

  for (var i = 0; i < 10; i++) {
    scrape(i);
  }

  setTimeout(() => {
    for (var i = 10; i < 15; i++) {
      scrape(i);
    }
  }, 1000);
})();
