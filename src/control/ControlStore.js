import Reflux from 'reflux';
import ControlActions from './ControlActions';
import moment from 'moment';

export default class ControlStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.listenables = ControlActions;
    }

    onAddPlayer(playerCount, entryCount)
    {
        let state = {
            entry_player_count: entryCount + 1,
            current_player_count: playerCount + 1
        }
        this.trigger(state);
    }

    onRemovePlayer(playerCount)
    {
        let state = {
            current_player_count: playerCount - 1
        }
        this.trigger(state);
    }

    onRebuyPlayer(rebuy_count)
    {
        let state = {
            rebuy_count: rebuy_count + 1
        }
        this.trigger(state);
    }

    onAddAddOn(addon_count) {
        let state = {
            addon_count: addon_count + 1
        }
        this.trigger(state);
    }

    onStart() {
        let state = {
            timerStarted: true,
            base_time: moment()
        }
        this.trigger(state);
    }

    onResetRestartState() {
        let state =  {
            restart: false
        }
        this.trigger(state);
    }
}