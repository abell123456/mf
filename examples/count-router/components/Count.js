import React, {Component} from 'react';

export default class Count extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const props = this.props;

        return (
            <div>
                <button key="add" onClick={() =>   { props.dispatch({type: 'count/asyncAdd', payload: 2})}}>+</button>
                <button key="minus" onClick={() => { props.dispatch({type: 'count/minus'})}}>-</button>
            </div>
        );
    }
}
