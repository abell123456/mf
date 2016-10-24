import React, {Component} from 'react';

export default class Count extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const props = this.props;

        return (
            <div>
                <div>
                    <span>同步操作：</span>
                    <button key="add" onClick={() => { props.add(1) }}>+</button>
                    <button style={{
                        marginLeft: '10px'
                    }} key="minus" onClick={() => { props.minus(1)}}>-</button>
                </div>
                <div style={{
                    marginTop: '10px'
                }}>
                    <span>异步操作：</span>
                    <button key="addSync" onClick={() =>   { props.asyncAdd(1)}}>async add</button>
                    <button style={{
                        marginLeft: '10px'
                    }} key="minusSync" onClick={() =>   { props.asyncMinus(1)}}>async minus</button>
                </div>

                <div style={{
                    marginTop: '10px'
                }}>
                    <span>基于Generator的异步操作：</span>
                    <button key="addg" onClick={() =>   { props.asyncAddG(1)}}>async add with Generator</button>
                    <button style={{
                        marginLeft: '10px'
                    }} key="minusG" onClick={() => { props.minusG(1)}}>async minus with Generator</button>
                </div>
            </div>
        );
    }
}
