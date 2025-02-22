import React from 'react';
import moment from 'moment';

//This will time how long until break
export default class BreakTimer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            end_time: moment(),
            minutes_until_break: 15,
            current_minutes: 0,
            current_seconds: 0,
            start: false
        }
        
        this.onComplete = props.onComplete;
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
        this.internal_clock = setInterval(this.tick, 100);
    }

    tick() {

        if(!this.state.start) {
            return null;
        }
        const dateNow = moment();
        const dateExpected = this.state.end_time;
        const diff = dateExpected.diff(dateNow, 'seconds');

        if(diff <= 0) {
            this.onPause();
        }

        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        this.setState({
            end_time: this.state.end_time,
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        this.setState({
            end_time: moment(nextProps.base_time).add(nextProps.time, 'm'),
            start: nextProps.start
        });
    }

    componentWillUnmount(){
        clearInterval(this.internal_clock);
    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    render() {
        const {current_minutes, current_seconds} = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                {current_minutes < 10  && '0' + current_minutes }{current_minutes >= 10  && current_minutes}:{current_seconds < 10  && '0' + current_seconds }{current_seconds >= 10  && current_seconds}
                </div>
            </div>
        )
    }
}
