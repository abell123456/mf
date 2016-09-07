'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createMf;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMf(createOpts) {
    return function mf() {
        var hooks = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var app = {
            // properties
            _models: [],
            _router: null,
            _store: null,
            _history: null,
            model: _helpers.model,
            router: _helpers.router,
            start: function start(container) {
                _helpers.start.call(this, container, hooks, createOpts);
            }
        };

        return app;
    };
}