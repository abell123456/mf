// 带有router功能，一般用于单页应用
module.exports = require('./src/as-router');
module.exports.connect = require('react-redux').connect;


module.exports.router = require('react-router');
module.exports.routerRedux = require('react-router-redux');

// 针对移动端的轻量级router
module.exports.rainieRouter = require('react-rainie-router');
