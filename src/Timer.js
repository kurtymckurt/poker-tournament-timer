import React from 'react';
import TimerActions from './TimerActions';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            original_minutes: 15,
            current_minutes: 15,
            current_seconds: 0
        }
        
        this.onComplete = props.onComplete;
        this.start = this.start.bind(this);
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
    }

    tick() {
        var new_minutes = 0;
        var new_seconds = 0;
        if(this.state.current_seconds <= 0) {
            new_minutes = this.state.current_minutes - 1;
            new_seconds = 59;
        } else {
            new_seconds = this.state.current_seconds - 1;
            new_minutes = this.state.current_minutes;
        }

        if(new_minutes <= 0 && new_seconds <= 0) {
            this.onComplete();
        } else {
            this.setState({
                original_minutes: this.state.original_minutes,
                current_minutes: new_minutes,
                current_seconds: new_seconds
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.state.blind_time !== undefined && this.state.original_minutes !== nextProps.state.blind_time){
            this.onPause();
            this.setState({
                original_minutes: nextProps.state.blind_time,
                current_minutes: nextProps.state.blind_time,
                current_seconds: 0
            });
            this.onStart = nextProps.onStart;
        }
    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    start() {
        this.internal_clock = setInterval(this.tick, 1000);
        TimerActions.start();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.state.current_minutes}:{this.state.current_seconds < 10  && '0' + this.state.current_seconds } {this.state.current_seconds >= 10  && this.state.current_seconds}
                </div>
                <div className="col-md-12">
                    <button onClick={this.start}>Start</button>
                </div>
            </div>
        )
    }
}
