import React from 'react';
import Reflux from 'reflux';
import moment from 'moment';

export default class ElapsedTimer extends Reflux.Component {

    constructor(props) {
        super(props);

        this.state = {
            start_time: moment(),
            current_hours: 0,
            current_minutes: 0,
            current_seconds: 0,
            timerStarted: false
        }

        this.onComplete = props.onComplete;
        this.onStart = this.onStart.bind(this);
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.start !== undefined && this.state.start !== nextProps.start){

            if(nextProps.start) {
                this.onStart();
            } else {
                this.onPause();
            }
        }
    }

    tick() {
        var dateNow = moment();
        var dateStarted = this.state.start_time;
        var diff = dateNow.diff(dateStarted, 'seconds');

        var minutes = Math.floor(diff / 60);
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        var seconds = diff % 60;
        this.setState({
            start_time: this.state.start_time,
            current_hours: hours,
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    onStart() {
        this.setState({
            start_time: moment()
        });
        this.internal_clock = setInterval(this.tick, 500);
    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    render() {
        const {current_hours, current_minutes, current_seconds} = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                {current_hours < 10  && '0' + current_hours }{current_hours >= 10  && current_hours}:{current_minutes < 10  && '0' + current_minutes }{current_minutes >= 10  && current_minutes}:{current_seconds < 10  && '0' + current_seconds }{current_seconds >= 10  && current_seconds}
                </div>
            </div>
        )
    }
}
