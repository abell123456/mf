import {
    is
}
from './util';

const SHOW = '@@MF_LOADING/SHOW';
const HIDE = '@@MF_LOADING/HIDE';
const NAMESPACE = 'loading';

function createLoading(opts = {}) {
    const namespace = opts.namespace || NAMESPACE;

    let initialState = {
        global: false,
        models: {},
    };

    if (opts.effects) {
        initialState.effects = {};
    }

    const extraReducers = {
        [namespace](state = initialState, {
            type, payload
        }) {

            const {
                namespace
            } = payload || {};

            let ret;

            switch (type) {
                case SHOW:
                    ret = {
                        ...state,
                        global: true,
                            models: {
                                ...state.models, [namespace]: true
                            },
                    };

                    break;
                case HIDE:
                    const models = {
                        ...state.models, [namespace]: false
                    };

                    const global = Object.keys(models).some(namespace => {
                        return models[namespace];
                    });

                    ret = {
                        ...state,
                        global,
                        models,
                    };

                    break;

                default:
                    ret = state;
            }

            return ret;
        },
    };

    function onEffect(effect, action, dispatch) {
        const {
            actionType: namespace
        } = effect;

        dispatch({
            type: SHOW,
            payload: {
                ...action,
                namespace
            }
        });

        console.info('effect执行之前的hook...');

        let res = effect(action, dispatch);

        if (is.promise(res)) {
            res.then(() => {
                console.info('effect执行之后的hook...');

                dispatch({
                    type: HIDE,
                    payload: {
                        ...action,
                        namespace
                    }
                });
            });
        }

        // 这样能保证后续每一个插件函数获取的都是res
        return res;
    }

    return {
        extraReducers,
        onEffect
    };
}

export default createLoading;
