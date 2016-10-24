/**
  mf插件机制，用于为mf开发插件，比如：mf-loading，用于自动的设置Loading State。

  机制：插件开发为一个功能性函数即可，该函数的参数可配置：
    @param namespace  指定需要修改的命名空间对应的model

  该函数返回一个对象，该对象包含hooks里的key：
    @key extraReducers   Object      改变state的reducers
    @key onEffect        Function    会被传递进当前执行effect进去，onEffect可以控制effect的执行时机
*/


class Plugin {
    constructor() {
        this.hooks = {
            extraReducers: [], // 用于增添额外的reducer
            onEffect: [] // 用于包裹effect来增添特定行为
        };
    }

    use(plugin) {
        const hooks = this.hooks;

        for (const key in plugin) {
            hooks[key].push(plugin[key]);
        }
    }

    apply(key, defaultHandler) {
        const hooks = this.hooks;

        const fns = hooks[key];

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

    get(key) {
        const hooks = this.hooks;

        if (key === 'extraReducers') {
            let ret = {};

            for (const reducerObj of hooks[key]) {
                ret = {
                    ...ret, ...reducerObj
                };
            }

            return ret;
        } else if (key === 'onReducer') {
            return function(reducer) {
                for (const reducerEnhancer of hooks[key]) {
                    reducer = reducerEnhancer(reducer);
                }

                return reducer;
            }
        } else {
            return hooks[key];
        }
    }
}

export default Plugin;
