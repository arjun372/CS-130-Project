import React from 'react';
import ReactDOM from 'react-dom';

import DBManager from '../dbManager.js';

import User from '../User.js';
import Chore from '../Chore.js';
import Apartment from '../Apartment.js';

import RaisedButton from 'material-ui/RaisedButton';
import {FormsyText, FormsyDate} from 'formsy-material-ui/lib';
import Formsy from 'formsy-react';

/**
 * Represents a Chore Form.
 *
 * @class React.Component.ChoreForm
 * @extends React.Component
 */
export default class ChoreForm extends React.Component {
    /**
     * Constructs a Chore Form.
     *
     * @method constructor
     * @constructor
     * @param {Object} props - Properties passed by parent. See propTypes
     */
    constructor(props) {
        super(props);

        this.errorMessages = {
            wordsError: "Please only use letters",
            numericError: "Please provide a number"
        };

        this.enableSubmit = this.enableSubmit.bind(this);
        this.disableSubmit = this.disableSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
        this.loopAddChores = this.loopAddChores.bind(this);
        this.addChore = this.addChore.bind(this);

        this.choreIterator = 0;
    }


    /**
     * Enables form submission.
     *
     * @method enableSubmit
     */
    enableSubmit() {
        this.setState({
            canSubmit: true
        });
    }

    /**
     * Disables form submission.
     *
     * @method disableSubmit
     */
    disableSubmit() {
        this.setState({
            canSubmit: false
        });
    }

    /**
     * Validates data submitted through the form.
     *
     * @method validateData
     * @param {Obj} data - The form data
     * @return {boolean} - Whether form is valid or not
     */
    validateData(data) {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (yesterday >= data.choreFirstDueDate) {
            console.log('Cannot assign chores due in the past');
            return false;
        }
        var repeatFrequency = parseInt(data.choreRepeatFreqency);
        if (repeatFrequency < 1 || repeatFrequency > 365) {
            console.log('Repeat frequency must be between 1 and 365, inclusive');
            return false;
        }
        var numberOccurrences = parseInt(data.choreNumberOccurrences);
        if (numberOccurrences < 1 || numberOccurrences > 100) {
            console.log('Number of occurrences must be between 1 and 100, inclusive');
            return false;
        }
        return true;
    }

    /**
     * Loops through chores and adds them to database.
     * Uses callbacks to avoid using stale caches.
     *
     * @method loopAddChores
     * @param {Array[Chore]} chores - Chores to be added
     */
    loopAddChores(chores) {
        this.addChore(chores[this.choreIterator], function() {
            this.choreIterator += 1;

            if (this.choreIterator < chores.length) {
                this.loopAddChores(chores);
            }
        }.bind(this));
    }

    /**
     * Adds a chore to the database and calls the callback
     * function after successfully adding it.
     *
     * @method addChore
     * @param {Chore} newChore - The chore to be added
     * @param {function} callback - The callback function
     */
    addChore(newChore, callback) {
        var manager = new DBManager();
        manager.addChore(newChore, callback);
    }

    /**
     * Handles when Chore Form is submitted by pushing the
     * desired Chore(s) to the database.
     *
     * @method handleSubmit
     * @param {Object} data - Chore data to be added to database
     */
    handleSubmit(data) {
        this.choreIterator = 0;

        if (this.validateData(data)) {
            console.log("submitting chore");
            console.log(data);

            var name = data.choreName;
            var assignee = data.choreAssignee;
            var firstDueDate = data.choreFirstDueDate;
            var numberOccurrences = parseInt(data.choreNumberOccurrences);
            var repeatFrequency = parseInt(data.choreRepeatFrequency);
            var details = data.choreDetails;

            var manager = new DBManager();
            var aptID = manager.getApartment().then(function (apt) {
                return apt.getAptID();
            });
            var UID = manager.getUser().then(function (user) {
                return user.getUserID()
            });
            Promise.all([UID, aptID]).then(values => {
                var newChores = [];
                do {
                    var assignedDueDate = new Date();
                    assignedDueDate.setDate(firstDueDate.getDate() + (newChores.length * repeatFrequency));
                    newChores.push(new Chore(values[0], values[1], name, assignedDueDate, details, assignee));
                    console.log('evaluating chore for:',values[0], values[1]);
                } while (newChores.length < numberOccurrences);
                this.loopAddChores(newChores);
            });
        }
    }

    /**
     * Handles invalid form submission.
     *
     * @method handleInvalidSubmit
     * @param {Object} data - The invalid data submitted
     */
    handleInvalidSubmit(data) {
        console.error("Received invalid submit: ", data);
    }

    /**
     * Renders a Chore Form.
     *
     * @method render
     */
    render() {
        return (
            <div>
                <Formsy.Form ref="addChores"
                    onValid={this.enableSubmit}
                    onInvalid={this.disableSubmit}
                    onValidSubmit={this.handleSubmit}
                    onInvalidSubmit={this.handleInvalidSubmit} >
                    Chore Name: <FormsyText
                        name="choreName"
                        validations="isWords"
                        validationError={this.errorMessages.wordsError}
                        required={true} />
                    <br />
                    Assignee: <FormsyText
                        name="choreAssignee"
                        validations="isWords"
                        validationError={this.errorMessages.wordsError}
                        required={true} />
                    <br />
                    First Due Date: <FormsyDate
                        name="choreFirstDueDate"
                        required={true} />
                    <br />
                    Number of Occurrences: <FormsyText
                        name="choreNumberOccurrences"
                        validations="isNumeric"
                        validationError={this.errorMessages.numericError}
                        required={true} />
                    <br />
                    Repeat Frequency (in Days): <FormsyText
                        name="choreRepeatFrequency"
                        validations="isNumeric"
                        validationError={this.errorMessages.numericError}
                        required={true} />
                    <br />
                    Additional Details: <FormsyText
                        multiline={true}
                        rows={3}
                        cols={50}
                        name="choreDetails" />
                    <br />
                    <RaisedButton fullWidth={false}
                        type="submit"
                        label="Send chores"
                        primary={false}
                        secondary={true} />
                </Formsy.Form>
            </div>
        );
    }
}
