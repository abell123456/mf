import React from 'react';

import mf, {
    connect, router
} from '../../index-router';

const { Router, Route, useRouterHistory } = router;

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));


import App from './components/Container';

// 1. Initialize
const app = mf();

// 2. Model
app.model({
    namespace: 'count',
    state: {
        count: 0
    },

    // 同步
    reducers: {
        add(state, action) {
            return {
                count: state.count + action.payload
            };
        },

        minus(state, action) {
            return {
                count: state.count - 1
            };
        }
    },

    effects: {
        asyncAdd(action, dispatch) {
            return delay(1000).then(() => {
                dispatch({
                    type: 'count/add',
                    payload: action.payload
                });
            });
        }
    }
});

// 3. View
// const App = connect(({ count }) => ({
//     count
// }))(function(props) {
//     return (<div>
//             <h2>{ props.count.count }</h2>
//             <button key="add" onClick={() =>   { props.dispatch({type: 'count/asyncAdd', payload: 2})}}>+</button>
//             <button key="minus" onClick={() => { props.dispatch({type: 'count/minus'})}}>-</button>
//         </div>
//     );
// });

// 4. Router
app.router(({ history }) =>
    <Router history={history}>
        <Route path="/" component={App} />
    </Router>
);

// 5. Start
app.start('#root');
