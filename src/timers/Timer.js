import React from 'react';
import moment from 'moment';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            end_time: moment(),
            current_minutes: 0,
            current_seconds: 0,
            start: false
        }
        
        this.onComplete = props.onComplete;
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
        this.internal_clock = setInterval(this.tick, 1000);
    }

    tick() {

        if(!this.state.start) {
           return null;
        }
        var diff = this.getTimeDiff();

        if(diff <= 0) {
            this.onComplete();
            this.setState({
                start: false
            })
        }

        var minutes = Math.floor(diff / 60);
        var seconds = diff % 60;
        this.setState({
            end_time: this.state.end_time,
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    getTimeDiff() {
        var dateNow = moment();
        var dateExpected = this.state.end_time === undefined ? moment() : this.state.end_time;
        var diff = dateExpected.diff(dateNow, 'seconds');
        return diff;
    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    componentWillReceiveProps(nextProps) {
        //It hasn't started so we can fix the display 
        const timeDiff = this.getTimeDiff();
        const minutes = Math.floor(timeDiff / 60);
        this.setState({
            end_time: nextProps.end_time,
            current_minutes: minutes,
            start: nextProps.start
        });
    }

    render() {

        const {current_minutes, current_seconds} = this.state;
        

        return (
            <div className="text-clock">
                     {current_minutes < 10  && '0' + current_minutes }{current_minutes >= 10  && current_minutes}:{current_seconds < 10  && '0' + current_seconds }{current_seconds >= 10  && current_seconds}             
            </div>
        )
    }
}
