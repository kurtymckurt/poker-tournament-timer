import Reflux from 'reflux';
import TimerActions from './TimerActions';

export default class TimerStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.listenables = TimerActions;
    }

    onStart()
    {
        this.trigger({ timerStarted: true });
    }
}