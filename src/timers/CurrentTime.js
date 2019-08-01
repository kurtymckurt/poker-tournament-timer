import React from 'react';
import Moment from 'react-moment';

export default class CurrentTime extends React.Component {

    render() {
      
        return (
            <div className="text-center">
                Current Time <br/> <Moment interval={500} format="hh:mm:ss A"></Moment>
            </div>
        )
    }
}
