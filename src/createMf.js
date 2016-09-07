import React from 'react';

import {
    model,
    router,
    start
} from './helpers';

export default function createMf(createOpts) {
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
                start.call(this, container, hooks, createOpts);
            }
        };

        return app;
    };
}
