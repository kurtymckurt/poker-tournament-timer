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
        this.start = this.start.bind(this);
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
    }

    tick() {

        if(!this.state.start) {
            return null;
        }
        var dateNow = moment();
        var dateExpected = this.state.end_time;
        var diff = dateExpected.diff(dateNow, 'seconds');

        if(diff <= 0) {
            this.onPause();
        }

        var minutes = Math.floor(diff / 60);
        var seconds = diff % 60;
        this.setState({
            end_time: this.state.end_time,
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.time !== undefined && this.state.minutes_until_break !== nextProps.time){
            this.setState({
                minutes_until_break: nextProps.time,
            });
        }
        if(nextProps.start !== this.state.start) {
            this.setState({
                end_time: moment().add(this.state.minutes_until_break, 'm'),
                start: nextProps.start
            })
            this.internal_clock = setInterval(this.tick, 500);
        }

    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    start() {
        this.setState({
            end_time: moment().add(this.state.minutes_until_break,'m')
        });
        this.internal_clock = setInterval(this.tick, 500);
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
