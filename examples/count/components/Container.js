import React, {Component} from 'react';

import { connect } from '../../../index';

import Count from './Count';


const selector = (state, ownProps) => {
    return state;
};

@connect(selector)
export default class Container extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const props = this.props;

        return (
            <div>
                <h2>
                    {
                        props.count.count
                    }
                </h2>
                <Count
                    dispatch = {this.props.dispatch}
                />
            </div>
        );
    }
}
