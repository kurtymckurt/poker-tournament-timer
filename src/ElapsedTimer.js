import React from 'react';
import Reflux from 'reflux';
import TimerStore from './TimerStore';

export default class ElapsedTimer extends Reflux.Component {

    constructor(props) {
        super(props);

        this.state = {
            current_hours: 0,
            current_minutes:0,
            current_seconds: 0,
            timerStarted: false
        }

        this.onComplete = props.onComplete;
        this.onStart = this.onStart.bind(this);
        this.tick = this.tick.bind(this);
        this.store = TimerStore;
    }

    componentDidMount() {
        this.onStart();
    }

    tick() {
        var new_hours = 0;
        var new_minutes = 0;
        var new_seconds = 0;
        const {current_hours, current_seconds, current_minutes, timerStarted} = this.state;
        
        if(!timerStarted) {
            return;
        }

        if(current_seconds >= 60) {
            new_minutes = current_minutes + 1;
            new_seconds = 0;
            new_hours = current_hours;
        } else {
            new_seconds = current_seconds + 1;
            new_minutes = current_minutes;
            new_hours = current_hours;
        }

        if(current_minutes >= 60) {
            new_hours = current_hours + 1;
            new_minutes = 0
            new_seconds = current_seconds;
        }

        this.setState({
            current_hours: new_hours,
            current_minutes: new_minutes,
            current_seconds: new_seconds
        });
        
    }

    onStart() {
        this.internal_clock = setInterval(this.tick, 1000);
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
