import React from 'react';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import FloatingCard from '../../primitives/FloatingCard.js';

import Chore from '../../../Chore.js';
import ToggleButton from '../../ToggleButton.js';

const style = {
  text: {
    textAlign:'justify',
    paddingLeft:'16px',
  },

  card: {
    width:256,
    height:384,
    textAlign:'center',
    borderRadius: '6px',
  },
}

export default class ChoreCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var chore = this.props.chore;
        if (chore) {
            return (
                <FloatingCard style={style.card}>
                    <CardTitle title="Chore"></CardTitle>
                    <CardText style={style.text}>
                        <ToggleButton
                            onCompletion={this.props.onCompletion}
                            onUncompletion={this.props.onUncompletion}
                            getDefaultToggle={this.props.getDefaultToggle}
                            toggledObject={chore}
                            label="Completed? "
                        />
                        <p>Assignment: {chore.getAssignment()}</p>
                        <p>Deadline: {chore.getDeadline()}</p>
                        <p>Category: {chore.getCategory()}</p>
                        <p>Details: {chore.getCategory()}</p>
                    </CardText>
                </FloatingCard>
            );
        }
        else {
            return null;
        }
    }
};

ChoreCard.propTypes = {
    chore: React.PropTypes.object.isRequired,
    key: React.PropTypes.string.isRequired,
    onCompletion: React.PropTypes.func.isRequired,
    onUncompletion: React.PropTypes.func.isRequired,
    getDefaultToggle: React.PropTypes.func.isRequired
};
