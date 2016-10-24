// 该入口文件给应用做一些默认设置

import {
    hashHistory,
    match
} from 'react-router';

import {
    routerMiddleware,
    syncHistoryWithStore,
    routerReducer as routing
} from 'react-router-redux';

import createMf from './create-mf';

export default createMf({
    initialReducer: {
        routing
    },
    defaultHistory: hashHistory,
    routerMiddleware,

    setupHistory(history) {
        const h = this._history = syncHistoryWithStore(history, this._store);
        const listen = h.listen;
        const routes = this._router({
            history: h
        });

        // 这里是监听router变化
        /**h.listen = callback => {
            listen.call(h, location => {
                match({
                    location,
                    routes
                }, (error, _, renderProps) => {
                    if (error) {
                        throw new Error(error);
                    }

                    // renderProps is undefined if redirect
                    callback(location, renderProps || {});
                });
            });
        };*/
    }
});
