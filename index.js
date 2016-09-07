module.exports = require('./lib');
module.exports.connect = require('react-redux').connect;

const router = require('./router');

module.exports.router = router;
module.exports.routerRedux = router.routerRedux;

// 针对移动端的轻量级router
module.exports.rainieRouter = require('react-rainie-router');
