import React from 'react';
import moment from 'moment';
import ControlActions from '../control/ControlActions';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            end_time: moment(),
            current_minutes: props.timeInMinutes,
            current_seconds: 0,
            start: false
        }
        
        this.onComplete = props.onComplete;
        this.start = this.start.bind(this);
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
        this.setNextTime = this.setNextTime.bind(this);
        this.internal_clock = setInterval(this.tick, 500);
    }

    tick() {

        if(!this.state.start || this.state.paused) {
          
            if(!this.state.current_minutes) {
                this.setState({
                    current_minutes: this.props.timeInMinutes
                });
           }
           return null;
        }
        var dateNow = moment();
        var dateExpected = this.state.end_time;
        var diff = dateExpected.diff(dateNow, 'seconds');

        if(diff <= 0) {
            this.onComplete();
            this.setNextTime();
        }

        var minutes = Math.floor(diff / 60);
        var seconds = diff % 60;
        this.setState({
            end_time: this.state.end_time,
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    setNextTime() {
        this.setState({
            end_time: moment().add(this.props.timeInMinutes, 'm'),
            current_minutes: this.props.timeInMinutes
        });
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render

        this.setState({
            timeInMinutes: nextProps.timeInMinutes,
            start: nextProps.start
        });
        
        if(nextProps.restart) {
            this.setState({
                end_time: moment().add(nextProps.timeInMinutes, 'm'),
                current_minutes: nextProps.timeInMinutes
            });
            ControlActions.resetRestartState();
        }
    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    start() {
        this.setState({
            end_time: moment().add(this.props.blind_time,'m')
        });
        this.internal_clock = setInterval(this.tick, 500);
    }

    render() {

        const {current_minutes, current_seconds, timeInMinutes} = this.state;
        
        var minuteTime;
        if(!current_minutes) {
            minuteTime = timeInMinutes;
        } else {
            minuteTime = current_minutes;
        }

        return (
            <div className="text-clock">
                    {minuteTime}:{current_seconds < 10  && '0' + current_seconds }{current_seconds >= 10  && current_seconds}             
            </div>
        )
    }
}
