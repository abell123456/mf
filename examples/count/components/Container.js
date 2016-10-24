import React, {Component} from 'react';

import { connect } from '../../../index';

import Count from './Count';


const selector = (state, ownProps) => {
    return state;
};

@connect(selector, {
    asyncAdd: arg => ({
        type: 'count/asyncAdd',
        payload: arg
    }),

    asyncMinus: arg => ({
        type: 'count/asyncMinus',
        payload: arg
    }),

    asyncAddG: arg => ({
        type: 'count/asyncAddG',
        payload: arg
    }),

    minusG: arg => ({
        type: 'count/minusG',
        payload: arg
    }),

    add: arg => ({
        type: 'count/add',
        payload: arg
    }),

    minus: arg => ({
        type: 'count/minus',
        payload: arg
    })
})
export default class Container extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const props = this.props;
        const {loading} = props;

        console.log('loading:', loading);

        return (
            <div>
                <h2>
                    {
                        props.count.count
                    }
                    <span
                        style={{
                            display: loading.global ? 'inline-block' : 'none',
                            marginLeft: '20px',
                            fontSize: '12px'
                        }}
                    >
                        计算中，请稍后......
                    </span>
                </h2>
                <Count
                    asyncAdd={this.props.asyncAdd}
                    asyncMinus={this.props.asyncMinus}
                    asyncAddG={this.props.asyncAddG}
                    minusG={this.props.minusG}
                    add={this.props.add}
                    minus={this.props.minus}
                />
            </div>
        );
    }
}
