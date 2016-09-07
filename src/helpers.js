import React from 'react';
import {
    Provider
} from 'react-redux';
import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers,
    bindActionCreators
} from 'redux';

import {
    handleActions
} from 'redux-actions';

import ReduxThunk from 'redux-thunk';

const SEP = '/';

function model(m) {
    this._models.push(checkModel(m));
}

function router(router) {
    this._router = router;
}

function start(container, hooks, createOpts) {
    const {
        initialReducer,
        defaultHistory,
        routerMiddleware,
        setupHistory,
    } = createOpts;

    const history = hooks.history || defaultHistory;
    const initialState = hooks.initialState || {};
    delete hooks.history;
    delete hooks.initialState;

    // support selector
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    // error wrapper
    const onError = apply(hooks, 'onError', function(err) {
        throw new Error(err.stack || err);
    });

    const onErrorWrapper = (err) => {
        if (err) {
            if (typeof err === 'string') err = new Error(err);
            onError(err);
        }
    };

    let reducers = {...initialReducer};

    for (const m of this._models) {
        reducers[m.namespace] = getReducer(m.reducers, m.effects, m.state);
    }

    let middlewares = [
        ReduxThunk
    ];

    // react-router-redux.routerMiddleware
    if (routerMiddleware) {
        middlewares = [routerMiddleware(history), ...middlewares];
    }

    const devtools = window.devToolsExtension || (() => noop => noop);

    // 中间件数组
    const enhancers = [
        applyMiddleware(...middlewares),
        devtools()
    ];

    const store = this._store = createStore(
        combineReducers(reducers),
        initialState,
        compose(...enhancers)
    );

    const dispatch = store.dispatch.bind(dispatch);

    const models = this._models;
    store.dispatch = function(...args) {
        const type = args[0].type;
        const modelName = type.split(SEP)[0];
        const reducerName = type.split(SEP)[1];

        const model = getModel(models, modelName);

        if(model) {
            const reducers = model.reducers;
            const effects = model.effects;

            if(reducerName in reducers || !effects[type]) {
                dispatch(...args);
            } else {
                effects[type]({
                    payload: args[0].payload
                }, dispatch);
            }
        } else {
            dispatch(...args);
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
    return models.filter(item => {
        return item.namespace === modelNamespace;
    })[0];
}

function getProvider(store, app, router) {
    return () => (
        <Provider store={store}>
            {router({
                app,
                history: app._history
            })}
        </Provider>
    );
}

function render(container, store, app, router) {
    const ReactDOM = require('react-dom');
    ReactDOM.render(React.createElement(getProvider(store, app, router)), container);
}

function checkModel(m) {
    const model = {...m};

    const {
        namespace,
        reducers,
        effects
    } = model;

    function applyNamespace(type) {
        function getNamespacedReducers(reducers) {
            return Object.keys(reducers).reduce((memo, key) => {
                memo[`${namespace}${SEP}${key}`] = reducers[key];
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
        return reducers[1](handleActions(reducers[0], state));
    } else {
        return handleActions(Object.assign({}, reducers || {}, getMiddlewareReducer(effects, state)), state);
    }
}

function getMiddlewareReducer(asyncReducers, state) {
    const obj = {};

    Object.keys(asyncReducers).forEach(key => {
        const func = asyncReducers[key];

        obj[key] = function(state, action) {
            return func({payload: state}, state);
        };
    });

    return obj;
}

function apply(hooks, key, defaultHandler) {
    hooks = hooks || {};

    const fns = hooks[key] || [];

    return (...args) => {
        if (fns.length) {
            for (const fn of fns) {
                fn.apply(null, args);
            }
        } else if (defaultHandler) {
            defaultHandler.apply(null, args);
        }
    };
}

const helpers = {
    model,
    router,
    start
};

Object.assign(exports, helpers);
