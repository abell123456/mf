import React from 'react';
import {
    Provider
} from 'react-redux';
import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
} from 'redux';

import SEP from '../sep';

import mfMiddleware from '../redux-mf';

import {
    render,
    checkModel,
    apply,
    runSubscriptions,
    createRootReducer,
    getFinalEffects,
    injectModel
} from '../helpers';

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
        setupHistory
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
            if (typeof err === 'string') {
                err = new Error(err);
            }

            onError(err);
        }
    };

    const devtools = window.devToolsExtension || (() => noop => noop);


    // 创建_effects
    this._effects = getFinalEffects(this._models);

    // 中间件数组
    const enhancers = [
        devtools()
    ];

    // 创建全局唯一store
    const store = this._store = createStore(
        createRootReducer(this._models, combineReducers, initialReducer),
        initialState,
        compose(applyMiddleware(mfMiddleware({
            SEP,
            effects: this._effects
        })), ...enhancers)
    );

    // 执行订阅监听
    for (const model of this._models) {
        if (model.subscriptions) {
            runSubscriptions(model.subscriptions, model, this);
        }
    }

    // setup history
    if (setupHistory) {
        setupHistory.call(this, history);
    }

    // If has container, render; else, return react component
    if (container) {
        render(container, store, this, this._router, getProvider);
        apply(hooks, 'onHmr')(render.bind(this, container, store, this, getProvider));
    } else {
        return getProvider(store, this, this._router);
    }
}

////////////////////////////////////
// Helpers

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


const helpers = {
    model,
    router,
    start
};

Object.assign(exports, helpers);
