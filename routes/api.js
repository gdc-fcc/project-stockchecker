'use strict';

const proxy_url = sym => `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${sym}/quote`

async function get_stocks(stocks, res) {
  const results = [];
  for (const stock of stocks) {
    results.push(await fetch(proxy_url(stock)).then(y => y.json()))
  }
  res.json(results)
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res) {
      let stock = req.query.stock;
      const like = req.query.like;
      if (!stock) {
        res.status(400).json('stock required')
      }
      if (typeof stock == "string") {
        stock = [stock]
      }
      if (!stock.every(x => /^[a-zA-Z]{2,8}$/.test(x))) {
        res.status(400).json('nope')
      }
      get_stocks(stock, res)
    });

};
