import React from 'react';
import Plugin from '../plugin';

import {
    model,
    useCC,
    start
} from './helpers';

export default function createMf(createOpts) {
    // 返回一个函数，用于创建App
    return function mf(hooks = {}) {

        const plugin = new Plugin();

        const app = {
            // properties
            _models: [],
            _store: null,
            model,
            useCC,
            use: plugin.use.bind(plugin),
            start(container) {
                return start.call(this, container, hooks, createOpts, plugin);
            }
        };

        return app;
    };
}
