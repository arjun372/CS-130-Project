import React from 'react';
import ReactDOM from 'react-dom';
import Balance from './Balance.js';

/**
 * Represents the Payments page.
 *
 * @class React.Component.PaymentsComponent
 * @extends React.Component
 */
export default class PaymentComponent extends React.Component{
    /**
     * Constructs the Payments page.
     *
     * @method constructor
     * @constructor
     */
    constructor() {
        super();
    };

    /**
     * Renders the Payments page
     *
     * @render
     */
    render(){
        return (
            <div>
                <h1> Payments </h1>
                <Balance />
            </div>
	   );
    }
}
