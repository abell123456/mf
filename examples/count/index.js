import React from 'react';

import mf from '../../index';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));


import App from './components/Container';
import createLoading from '../../pluginss/mf-loading';

// 1. Initialize
const app = mf();

app.use(createLoading());

// 2. Model
app.model({
    namespace: 'count',
    state: {
        count: 0
    },

    subscriptions: {
        setup({dispatch}) {
            dispatch({
                type: 'count/add',
                payload: 1
            });
        }
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
                count: state.count - (action.payload || 1)
            };
        }
    },

    effects: {
        asyncAdd(action, dispatch) {
            return delay(2000).then(() => {
                dispatch({
                    type: 'count/add',
                    payload: action.payload
                });
            });
        },

        asyncMinus(action, dispatch) {
            return delay(2000).then(() => {
                dispatch({
                    type: 'count/minus',
                    payload: action.payload
                });
            });
        },

        * asyncAddG (action, dispatch) {
            yield delay(1000);

            dispatch({
                type: 'count/add',
                payload: action.payload
            });
        },

        * minusG (action, dispatch) {
            yield delay(1000);

            dispatch('count/minus');
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
// app.router(({ history }) =>
//     <Router history={history}>
//         <Route path="/" component={App} />
//     </Router>
// );

app.useCC(App);

// 5. Start
app.start('#root');
