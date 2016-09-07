'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

var _createMf = require('./createMf');

var _createMf2 = _interopRequireDefault(_createMf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createMf2.default)({
    mobile: false,
    initialReducer: {
        routing: _reactRouterRedux.routerReducer
    },
    defaultHistory: _reactRouter.hashHistory,
    routerMiddleware: _reactRouterRedux.routerMiddleware,

    setupHistory: function setupHistory(history) {
        var h = this._history = (0, _reactRouterRedux.syncHistoryWithStore)(history, this._store);
        var listen = h.listen;
        var routes = this._router({
            history: h
        });

        h.listen = function (callback) {
            listen.call(h, function (location) {
                (0, _reactRouter.match)({
                    location: location,
                    routes: routes
                }, function (error, _, renderProps) {
                    if (error) {
                        throw new Error(error);
                    }

                    // renderProps is undefined if redirect
                    callback(location, renderProps || {});
                });
            });
        };
    }
}); /**
        see: https://github.com/dvajs/dva/tree/master
    */