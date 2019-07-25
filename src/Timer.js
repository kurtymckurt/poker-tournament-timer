import React from 'react';
import moment from 'moment';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            end_time: moment(),
            blind_time: 15,
            current_minutes: 15,
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
            this.onComplete();
        }

        var minutes = Math.floor(diff / 60);
        var seconds = diff % 60;
        this.setState({
            end_time: this.state.end_time,
            blind_time: this.state.blind_time,
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    componentDidMount() {
    
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.blind_time !== undefined && this.state.original_minutes !== nextProps.blind_time){
            this.setState({
                blind_time: nextProps.blind_time,
            });
        }
        if(nextProps.start !== this.state.start) {
            this.setState({
                end_time: moment().add(this.state.blind_time, 'm'),
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
            end_time: moment().add(this.state.blind_time,'m')
        });
        this.internal_clock = setInterval(this.tick, 500);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 display-1 text-clock">
                    {this.state.current_minutes}:{this.state.current_seconds < 10  && '0' + this.state.current_seconds }{this.state.current_seconds >= 10  && this.state.current_seconds}
                </div>
               
            </div>
        )
    }
}
