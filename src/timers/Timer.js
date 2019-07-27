import React from 'react';
import moment from 'moment';
import ControlActions from '../control/ControlActions';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            end_time: moment(),
            current_minutes: props.levelTimes[props.currentLevel],
            current_seconds: 0,
            start: false
        }
        
        this.onComplete = props.onComplete;
        this.start = this.start.bind(this);
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
        this.setNextTime = this.setNextTime.bind(this);
    }

    tick() {

        if(!this.state.start) {
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
            end_time: moment().add(this.props.levelTimes[this.props.currentLevel], 'm'),
            current_minutes: this.props.levelTimes[this.props.currentLevel]
        });
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.start !== this.state.start || nextProps.restart) {
            this.setState({
                end_time: moment().add(this.nextProps.levelTimes[this.nextProps.currentLevel], 'm'),
                start: nextProps.start
            }) 
            if(nextProps.restart) {
                ControlActions.resetRestartState();
            }
            this.internal_clock = setInterval(this.tick, 500);
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
        return (
            <div className="text-clock">
                    {this.state.current_minutes}:{this.state.current_seconds < 10  && '0' + this.state.current_seconds }{this.state.current_seconds >= 10  && this.state.current_seconds}             
            </div>
        )
    }
}
