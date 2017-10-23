const cheerio = require('cheerio');
const request = require('request');
const bluebird = require('bluebird');
const requestAsync = bluebird.promisify(request);
const fields = ['kennitala','nafn','logheimili','kjordaemi','sveitafelag','kjorstadur','kjordeild'];

module.exports = async function(kt) {
  let res,$;
  let form = {};

  // Ensure hyphen is in the right place
  kt = String(kt).replace(/-/,'').trim();
  kt = kt.slice(0,6)+'-'+kt.slice(6);

  
  res = await requestAsync({
    url: 'https://kjorskra.skra.is/kjorskra/',
    method: 'GET',
    gzip: true
  });
  $ = cheerio.load(res.body);
  $('form input').each( (i,v) => {
    form[$(v).attr('name')] = $(v).attr('value');
  });

  form.txtKennitala_Raw = kt;
  form.txtKennitala = kt;
  form.ASPxGridView1$DXKVInput = kt.replace(/-/,'');

  res = await requestAsync({
    url: 'https://kjorskra.skra.is/kjorskra/',
    method: 'POST',
    gzip: true,
    form
  });

  $ = cheerio.load(res.body);

  const response = $('#ASPxGridView1_DXDataRow0 td')
    .map( (i,v) => $(v).text())
    .toArray()
    .reduce( (p,d,i) => {
      p[fields[i]] = d.trim();
      return p;
    },{
      success: true
    });

  if (!response.kennitala)
    return {
      success: false,
      message: 'Kennitala not found'
    };
  else
    return response;
};

if (!module.parent) {
  if (!process.argv[2])
    console.log('CLI usage: node kjorskra [kennitala]');
  else
    module.exports(process.argv[2]).then(console.log,console.log);
}

