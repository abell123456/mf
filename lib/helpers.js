'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxActions = require('redux-actions');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SEP = '/';

function model(m) {
    this._models.push(checkModel(m));
}

function router(router) {
    this._router = router;
}

function start(container, hooks, createOpts) {
    var initialReducer = createOpts.initialReducer;
    var defaultHistory = createOpts.defaultHistory;
    var routerMiddleware = createOpts.routerMiddleware;
    var setupHistory = createOpts.setupHistory;


    var history = hooks.history || defaultHistory;
    var initialState = hooks.initialState || {};
    delete hooks.history;
    delete hooks.initialState;

    // support selector
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    // error wrapper
    var onError = apply(hooks, 'onError', function (err) {
        throw new Error(err.stack || err);
    });

    var onErrorWrapper = function onErrorWrapper(err) {
        if (err) {
            if (typeof err === 'string') err = new Error(err);
            onError(err);
        }
    };

    var reducers = _extends({}, initialReducer);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = this._models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var m = _step.value;

            reducers[m.namespace] = getReducer(m.reducers, m.effects, m.state);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var middlewares = [_reduxThunk2.default];

    // react-router-redux.routerMiddleware
    if (routerMiddleware) {
        middlewares = [routerMiddleware(history)].concat(_toConsumableArray(middlewares));
    }

    var devtools = window.devToolsExtension || function () {
        return function (noop) {
            return noop;
        };
    };

    // 中间件数组
    var enhancers = [_redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares)), devtools()];

    var store = this._store = (0, _redux.createStore)((0, _redux.combineReducers)(reducers), initialState, _redux.compose.apply(undefined, enhancers));

    var dispatch = store.dispatch.bind(dispatch);

    var models = this._models;
    store.dispatch = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var type = args[0].type;
        var modelName = type.split(SEP)[0];
        var reducerName = type.split(SEP)[1];

        var model = getModel(models, modelName);

        if (model) {
            var _reducers = model.reducers;
            var effects = model.effects;

            if (reducerName in _reducers || !effects[type]) {
                dispatch.apply(undefined, args);
            } else {
                effects[type]({
                    payload: args[0].payload
                }, dispatch);
            }
        } else {
            dispatch.apply(undefined, args);
        }
    };

    // setup history
    if (setupHistory) {
        setupHistory.call(this, history);
    }

    // If has container, render; else, return react component
    if (container) {
        render(container, store, this, this._router);
        apply(hooks, 'onHmr')(render.bind(this, container, store, this));
    } else {
        return getProvider(store, this, this._router);
    }
}

////////////////////////////////////
// Helpers

function getModel(models, modelNamespace) {
    return models.filter(function (item) {
        return item.namespace === modelNamespace;
    })[0];
}

function getProvider(store, app, router) {
    return function () {
        return _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            router({
                app: app,
                history: app._history
            })
        );
    };
}

function render(container, store, app, router) {
    var ReactDOM = require('react-dom');
    ReactDOM.render(_react2.default.createElement(getProvider(store, app, router)), container);
}

function checkModel(m) {
    var model = _extends({}, m);

    var namespace = model.namespace;
    var reducers = model.reducers;
    var effects = model.effects;


    function applyNamespace(type) {
        function getNamespacedReducers(reducers) {
            return Object.keys(reducers).reduce(function (memo, key) {
                memo['' + namespace + SEP + key] = reducers[key];
                return memo;
            }, {});
        }

        if (model[type]) {
            if (type === 'reducers' && Array.isArray(model[type])) {
                model[type][0] = getNamespacedReducers(model[type][0]);
            } else {
                model[type] = getNamespacedReducers(model[type]);
            }
        }
    }

    applyNamespace('reducers');
    applyNamespace('effects');

    return model;
}

function getReducer(reducers, effects, state) {
    if (Array.isArray(reducers)) {
        return reducers[1]((0, _reduxActions.handleActions)(reducers[0], state));
    } else {
        return (0, _reduxActions.handleActions)(Object.assign({}, reducers || {}, getMiddlewareReducer(effects, state)), state);
    }
}

function getMiddlewareReducer(asyncReducers, state) {
    var obj = {};

    Object.keys(asyncReducers).forEach(function (key) {
        var func = asyncReducers[key];

        obj[key] = function (state, action) {
            return func({ payload: state }, state);
        };
    });

    return obj;
}

function apply(hooks, key, defaultHandler) {
    hooks = hooks || {};

    var fns = hooks[key] || [];

    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        if (fns.length) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = fns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var fn = _step2.value;

                    fn.apply(null, args);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        } else if (defaultHandler) {
            defaultHandler.apply(null, args);
        }
    };
}

var helpers = {
    model: model,
    router: router,
    start: start
};

Object.assign(exports, helpers);