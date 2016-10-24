import React from 'react';

import {
    model,
    router,
    start
} from './helpers';

export default function createMf(createOpts) {
    // 返回一个函数，用于创建App
    return function mf(hooks = {}) {
        const app = {
            // properties
            _models: [],
            _router: null,
            _store: null,
            _history: null,
            model,
            router,
            start(container) {
                return start.call(this, container, hooks, createOpts);
            }
        };

        return app;
    };
}
