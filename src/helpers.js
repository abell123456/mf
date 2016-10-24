import React from 'react';
import {is} from './util';

import SEP from './sep';

import {handleActions} from 'redux-actions';

function render(container, store, app, ContainerComponent, getProvider) {
    const ReactDOM = require('react-dom');

    ReactDOM.render(React.createElement(getProvider(store, app, ContainerComponent)), container);
}

function checkModel(m) {
    const model = {
        ...m
    };

    const {
        namespace,
        reducers,
        effects
    } = model;

    function applyNamespace(type) {
        function getNamespacedReducers(reducers) {
            return Object.keys(reducers).reduce((memo, key) => {
                memo[prefixType(key, namespace)] = reducers[key];
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

function runSubscriptions(subs, model, app) {
    for (const key in subs) {
        const sub = subs[key];

        sub({
            dispatch: createDispach(app._store.dispatch, model),
            history: app._history
        });
    }
}

function createDispach(dispatch, model) {
    return action => {
        if (is.str(action)) {
            action = {
                type: action
            };
        }

        const {
            type
        } = action;

        return dispatch({
            ...action,
            type: prefixType(type, model)
        });
    };
}

function prefixType(type, model) {
    const namespace = is.str(model) ? model : model.namespace;

    const prefixedType = type.indexOf(SEP) < 0 ? `${namespace}${SEP}${type}` : type;

    return prefixedType;
}

function getFinalReducers(m) {
    const {
        reducers,
        state,
        namespace
    } = m;

    if (!is.func(reducers.setValues)) {
        reducers.setValues = (state, action = {}) => {
            const newValues = action.payload || {};

            return {
                ...state, ...newValues
            };
        }
    }

    const formattedReducers = Object.keys(reducers).reduce((ret, key) => {
        // key: reducers属性名
        let actionType = prefixType(key, namespace);

        ret[actionType] = reducers[key];

        return ret;
    }, {});

    return handleActions(formattedReducers, state);
}

// 创建reducers
function createRootReducer(modules, combineReducers, initRootReducer) {
    const lastReducers = modules.reduce((reducers, m) => {
        let finalReducer = getFinalReducers(m);

        m.finalReducer = finalReducer;

        const {
            namespace: name
        } = m;

        reducers[name] = finalReducer;

        return reducers;
    }, initRootReducer ? {...initRootReducer} : {});

    return function rootReducer(state, action = {}) {
        return combineReducers(lastReducers)(state, action);
    };
}


/**
  获取最终的effects的格式为：
  {
    'home/fetch': [
        () => {},
        () => {},
        () => {},
    ]
  }
*/
function getFinalEffects(modules) {
    return modules.reduce((ret, item) => {
        let moduleName = item.namespace;
        let effects = item.effects || {};

        Object.keys(effects).forEach(key => {
            let actionType = prefixType(key, moduleName);

            const effectHandler = effects[key];
            effectHandler.actionType = actionType;

            if (!is.arr(ret[actionType])) {
                ret[actionType] = [];
            }

            ret[actionType].push(effectHandler);
        });

        return ret;
    }, {});
}


// app start之后动态插入model
function injectModel(combineReducers, m) {
    m = checkModel(m);
    const store = this._store;
    const appModules = this._models;

    // reducers
    store.replaceReducer(createRootReducer(appModules, combineReducers));

    // effects
    if (m.effects) {
        this._effects = getFinalEffects(appModules);
    }

    // subscriptions
    if (m.subscriptions) {
        runSubscriptions(m.subscriptions, m, this);
    }
}

Object.assign(exports, {
    render,
    checkModel,
    apply,
    runSubscriptions,
    createRootReducer,
    getFinalEffects,
    injectModel
});
