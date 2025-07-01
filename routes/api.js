'use strict';
const db = require('../database.js')

const proxy_url = sym => `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${sym}/quote`

async function get_stocks(stocks, res, like, req) {
  const results = [];
  for (const stock of stocks) {
    results.push(await fetch(proxy_url(stock)).then(y => y.json()))
  }
  let result = results.map(x => ({
    stock: x.symbol,
    price: x.latestPrice,
    rel_likes: 0
  }))
  stocks = result.map(x => x.stock)
  if (like) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    await Promise.all(stocks.map(stock => db.insert(stock, ip)))
  }
  const likes = await Promise.all(stocks.map(stock => db.get(stock)));
  if (result.length == 1) {
    result = result[0]
    result.likes = likes[0];
    delete result.rel_likes;
  } else {
    result[0].rel_likes = likes[0] - likes[1];
    result[1].rel_likes = likes[1] - likes[0];
  }
  res.json({stockData: result})
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
      get_stocks(stock, res, like === "true", req)
    });

};
