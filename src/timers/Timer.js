import React from 'react';
import moment from 'moment';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            current_minutes: 0,
            current_seconds: 0,
            start: false
        };
        
        this.onComplete = props.onComplete;
        this.onPause = this.onPause.bind(this);
        this.tick = this.tick.bind(this);
        this.internal_clock = setInterval(this.tick, 100);
    }

    tick() {
        if(!this.state.start) {
           return null;
        }
        const diff = this.getTimeDiff(this.state.end_time);

        if(this.state.pause) {
            this.setState({
                end_time: this.state.end_time.add(diff, 'seconds')
            });
            return null;
        }

        if(diff <= 0) {
            this.onComplete();
            this.setState({
                start: false
            })
        }

        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        this.setState({
            current_minutes: minutes,
            current_seconds: seconds
        });
    }

    getTimeDiff(end_time) {
        let dateNow = moment();
        let diff = end_time.diff(dateNow, 'seconds');
        return diff;
    }

    onPause() {
        clearInterval(this.internal_clock);
    }

    updateTimer(end_time) {
        const timeDiff = this.getTimeDiff(end_time) + 1;
        const minutes = Math.floor(timeDiff / 60);
        const seconds = timeDiff % 60;
        this.setState({
            current_minutes: minutes,
            current_seconds: seconds,
            end_time: end_time
        });
    }

    componentDidMount() {
        this.updateTimer(this.props.end_time)
    }

    componentWillReceiveProps(nextProps) {
        //It hasn't started so we can fix the display
        if(!nextProps.pause) {
            this.updateTimer(nextProps.end_time);
        }else {
            this.setState({
                end_time: nextProps.end_time
            });
        }
        this.setState({
            start: nextProps.start,
            pause: nextProps.pause
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
