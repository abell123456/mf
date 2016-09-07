/**
    see: https://github.com/dvajs/dva/tree/master
*/

import {
    hashHistory,
    match
} from 'react-router';

import {
    routerMiddleware,
    syncHistoryWithStore,
    routerReducer as routing
} from 'react-router-redux';

import createMf from './createMf';

export default createMf({
    mobile: false,
    initialReducer: {
        routing
    },
    defaultHistory: hashHistory,
    routerMiddleware: routerMiddleware,

    setupHistory(history) {
        const h = this._history = syncHistoryWithStore(history, this._store);
        const listen = h.listen;
        const routes = this._router({
            history: h
        });

        h.listen = callback => {
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
        };
    }
});
