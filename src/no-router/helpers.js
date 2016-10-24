// 注：该文件不可以进行格式化

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

function useCC(containerComponent) {
    this._containerComponent = containerComponent;
}

// createOpts 暂时没有什么配置
function start(container, hooks, createOpts, plugin) {
    // 开发者设置的初始state
    const initialState = hooks.initialState || {};

    delete hooks.initialState;

    plugin.use(hooks);


    // 如果设置了容器元素，且是字符串格式，则获取真正的容器DOM元素
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    // 支持开发者工具
    const devtools = window.devToolsExtension || (() => noop => noop);

    // 中间件数组
    const enhancers = [
        devtools()
    ];

    // 创建_reducers
    const extraReducers = plugin.get('extraReducers'); // 将插件中的reducers应用进来
    this._reducers = createRootReducer(this._models, combineReducers, extraReducers);

    // 创建_effects
    this._effects = getFinalEffects(this._models);


    // 创建全局唯一store
    const store = this._store = createStore(
        this._reducers,
        initialState,
        compose(applyMiddleware(mfMiddleware({
            effects: this._effects,
            onEffect: plugin.get('onEffect')
        })), ...enhancers)
    );

    // 执行订阅监听
    for (const model of this._models) {
        if (model.subscriptions) {
            runSubscriptions(model.subscriptions, model, this);
        }
    }

    // start()执行后改写model方法
    this.model = injectModel.bind(this, combineReducers);

    // If has container, render; else, return react component
    if (container) {
        render(container, store, this, this._containerComponent, getProvider);
        apply(hooks, 'onHmr')(render.bind(this, container, store, this, this._containerComponent, getProvider));
    } else {
        return getProvider(store, this, this._containerComponent);
    }
}

////////////////////////////////////
// Helpers

function getProvider(store, app, ContainerComponent) {
    return () => (
        <Provider store={store}>
            <ContainerComponent />
        </Provider>
    );
}

const helpers = {
    model,
    useCC,
    start
};

Object.assign(exports, helpers);
