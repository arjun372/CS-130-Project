import React from 'react';
import ReactDOM from 'react-dom';
import DBManager from '../dbManager.js';
import User from '../User.js';
import Payment from '../Payment.js';

import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import {FormsyText, FormsyRadio,FormsyRadioGroup,FormsySelect,FormsyDate} from 'formsy-material-ui/lib';

import Formsy from 'formsy-react';

/*import FloatingCard from './primitives/FloatingCard.js';
import { CardActions, CardTitle, CardText} from 'material-ui/Card';*/

/**
 * Represents a PaymentForm.
 *
 * @class React.Component.PaymentForm
 * @extends React.Component
 */
export default class PaymentForm extends React.Component {
    /**
     * Constructs a Payment Form.
     *
     * @method constructor
     * @constructor
     */
    constructor() {
        super();

       	this.addPayment = this.addPayment.bind(this);
    };


    addPayment(e){
        var manager = new DBManager();
        manager.signIn("bob@gmail.com","password").then(function(){
            var payment = new Payment(e.paymentAmount,e.loaner,e.loanee, new Date(), null, e.dueDate, e.paymentDescription,e.paymentCategory,e.recurringPeriod);
            manager.addPayment(payment);
            console.log("added payment");
        }.bind(this));

       
        /*var regex  = /^\d+(?:\.\d{0,2})$/;
        console.log(regex.test(amount));
        var n = +amount;
        console.log(isNaN(n));
        console.log(parseFloat(amount));*/

        /*var today = new Date().toJSON().slice(0,10);
        console.log(today);

        if (isNaN(amount)){
            console.log("invalid amount entered");
        }

        //check that due date is not before today's date 
        else if (dueDate == "" || today <= dueDate){
            //add payment
            var db = new DBManager();
            var p = new Payment(amount,loaner,loanee,today,null,dueDate,description,category,recurring);
            console.log("payment added!");
        //IS DB OR USER IN CHARGE OF KEEPING TRACK OF PAYMENTS?
        }
        else{
            console.log("Can't set due date in past");           
        }
        //reset form
        this._description.value="";
        this._category.value="";
        this._loaner.value="";
        this._loanee.value="";
        this._amount.value="";
        this._dueDate.value="";
        this._recurring.value="";
        e.preventDefault();*/
    }

    GetTenants(){
        console.log("hello");
        var manager = new DBManager();
        manager.signIn("bob@gmail.com","password").then(function(){
            console.log("in");
            manager.getApartment().then(function (apt){
                console.log("what");
                var tenants = apt.getTenantIDs();
                console.log(tenants);
                //If this actually worked, then would render form here and generate loaners/loanee dropdown here?
                //have a separate function so that when get to loaner/loanee renders dropdown options using for loop?
            })
        });
    }

    /**
     * Renders a Balance between two users.
     *
     * @method render
     */
    render() {
        return (
            <div>
            <Formsy.Form ref="addPayment" onValidSubmit={this.addPayment} >
                <h3> Payment Description</h3>
                <FormsyText required={true}  name="paymentDescription" floatingLabelText={'Enter description'} multiLine={true} rows={2}/>

                <h3> Payment Category</h3>
                <FormsyRadioGroup name="paymentCategory" defaultSelected="groceries">
                  <FormsyRadio
                    value="groceries"
                    label="Groceries"
                  />
                  <FormsyRadio
                    value="meals"
                    label="Meals"
                  />
                  <FormsyRadio
                    value="rent"
                    label="Rent or Utilities"
                  />
                  <FormsyRadio
                    value="misc"
                    label="Misc"
                  />
                </FormsyRadioGroup>

                <h3> Loaner</h3>
                <FormsySelect
                  name="loaner"
                  required
                  floatingLabelText="Select Loaner"
                >
                  <MenuItem value={'roommate1Loaner'} primaryText="Roommate 1" />
                  <MenuItem value={'roommate2Loaner'} primaryText="Roommate 2" />
                  <MenuItem value={'roommate3Loaner'} primaryText="Roommate 3" />
                  <MenuItem value={'roommate4Loaner'} primaryText="Roommate 4" />
                </FormsySelect>


                <h3> Loanee</h3>
                <FormsySelect
                  name="loanee"
                  required
                  floatingLabelText="Select Loaner"
                >
                  <MenuItem value={'roommate1Loanee'} primaryText="Roommate 1" />
                  <MenuItem value={'roommate2Loanee'} primaryText="Roommate 2" />
                  <MenuItem value={'roommate3Loanee'} primaryText="Roommate 3" />
                  <MenuItem value={'roommate4Loanee'} primaryText="Roommate 4" />
                </FormsySelect>

                <h3>Amount</h3>
                <FormsyText required={true}  name="paymentAmount" floatingLabelText={'Enter amount'}/>

                <h3>Due date </h3>
                <FormsyDate
                  name="dueDate"
                  required
                  floatingLabelText="Due Date"
                />

                <h3>Recurring Period </h3>
                <FormsySelect
                  name="recurringPeriod"
                  required
                  floatingLabelText="Select recurring period"
                >
                  <MenuItem value={'once'} primaryText="Once" />
                  <MenuItem value={'weekly'} primaryText="Weekly" />
                  <MenuItem value={'biweekly'} primaryText="Biweekly" />
                  <MenuItem value={'monthly'} primaryText="Monthly" />
                </FormsySelect>

                <RaisedButton fullWidth={false} type="submit" label="Add Payment" primary={false} secondary={true} />
            </Formsy.Form>

            <button onClick={this.GetTenants.bind(this)}>Test Getting Apartment Mates</button>
            </div>
        );
    }
}


/*
Things to change/check:
- put restriction of choosing due date after present time
*/



