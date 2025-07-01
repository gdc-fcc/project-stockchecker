const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Viewing one stock: GET request to /api/stock-prices/', done => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=goog&like=false')
            .end((_err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "stockData")
                assert.equal(res.body.stockData.stock, "GOOG")
                assert.property(res.body.stockData, "likes")
                done()
            })
    })
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', done => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=goog&like=true')
            .end((_err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "stockData")
                assert.equal(res.body.stockData.stock, "GOOG")
                assert.property(res.body.stockData, "likes")
                done()
            })
    })
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=goog&like=true')
            .end((_err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "stockData")
                assert.equal(res.body.stockData.stock, "GOOG")
                assert.property(res.body.stockData, "likes")
                done()
            })
    })
    test('Viewing two stocks: GET request to /api/stock-prices/', done => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=goog&stock=msft&like=false')
            .end((_err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "stockData")
                assert.typeOf(res.body.stockData, "array")
                assert.equal(res.body.stockData.length, 2)
                assert.equal(res.body.stockData[0].stock, "GOOG")
                assert.property(res.body.stockData[1], "rel_likes")
                done()

            })
    })
    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', done => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=goog&stock=msft&like=true')
            .end((_err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, "stockData")
                assert.typeOf(res.body.stockData, "array")
                assert.equal(res.body.stockData.length, 2)
                assert.equal(res.body.stockData[0].stock, "GOOG")
                assert.property(res.body.stockData[1], "rel_likes")
                done()
            })
    })
});
