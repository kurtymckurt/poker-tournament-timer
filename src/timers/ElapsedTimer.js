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
            started: false
        }

        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
        this.internal_clock = setInterval(this.tick, 100);
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(!this.state.started){
            if(nextProps.start) {
                this.setState({
                    start_time: moment(nextProps.base_time),
                    started: true
                });
                
            }
        }
    }

    componentWillUnmount(){
        clearInterval(this.internal_clock);
    }


    tick() {
        if(!this.state.started) {
            return null
        }
        const dateNow = moment();
        const dateStarted = this.state.start_time;
        const diff = dateNow.diff(dateStarted, 'seconds') + 1;

        const minutes = Math.floor(diff / 60);
        const hours = Math.floor(minutes / 60);
        const seconds = diff % 60;
        this.setState({
            current_hours: hours,
            current_minutes: minutes,
            current_seconds: seconds
        });
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
