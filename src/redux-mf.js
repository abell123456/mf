/**
 * redux中间件。
    action: {
        type: 'home/update',
        payload: {}
    }
 */

import co from 'co';

import {
    is
}
from './util';

import {
    isFSA
}
from 'flux-standard-action';

import createDispatch from './createDispatch';

// 常规异步函数执行
const handleNormalAsyncEffect = function(effectHandler, action, dispatch) {
    action = isFSA(action) ? action : {
        payload: action.payload
    };

    const res = effectHandler(action, dispatch);

    if (is.promise(res)) {
        res.then(response => {
            if (is.str(response)) {
                dispatch({
                    type: response
                });
            }

            if (isFSA(response)) {
                dispatch(response);
            }
        });
    }
};

// Generator异步支持
const handleGeneratorEffect = function(effectHandler, action, dispatch) {
    // 自动执行
    co(function*() {
        yield effectHandler(action, dispatch);
    });
};

// handler执行统一入口
const handleEffect = function(action, effectList, state, originDispatch, onEffect) {
    effectList.forEach(effectHandler => {
        const actionType = effectHandler.actionType;
        const names = actionType.split('/').slice(0, -1);
        const dispatch = createDispatch(originDispatch);
        const subState = names.reduce((ret, name) => ret[name], state);

        // 真正的handler执行
        if (is.gen(effectHandler)) {
            if (onEffect.length) {
                // 如果使用Generator，则所有effect要求全部使用Generator
                // 暂时不支持Generator
                // effectHandler = getGeneratorIteratorFunction(effectHandler, onEffect);
            }

            handleGeneratorEffect(effectHandler, action, dispatch, onEffect);
        } else {
            // 先处理插件执行
            if (onEffect.length) {
                effectHandler = getIteratorFunction(effectHandler, onEffect);
            }

            handleNormalAsyncEffect(effectHandler, action, dispatch, onEffect);
        }
    });
};

export default function({
    effects, onEffect = []
}) {
    return function mfMiddleware({
        dispatch,
        getState
    }) {
        return next => action => {
            if (is.str(action)) {
                action = {
                    type: action
                };
            }

            next(action);

            const type = action.type;

            const effectList = effects[type];

            if (effectList && effectList.length) {
                handleEffect(action, effectList, getState(), dispatch, onEffect);
            }
        };
    };
};

function getModel(models, modelNamespace) {
    return models.filter(item => item.namespace === modelNamespace)[0];
}

// Generator迭代函数生成
function getGeneratorIteratorFunction(effectHandler, onEffect) {
    return onEffect.reduce((eh, effect) => {
        return function*(action, dispatch) {
            return yield effect(eh, action, dispatch);
        };
    }, effectHandler);
}

// 普通异步函数的迭代函数生成
function getIteratorFunction(effectHandler, onEffect) {
    return onEffect.reduce((eh, effect) => (action, dispatch) => effect(eh, action, dispatch), effectHandler);
}
