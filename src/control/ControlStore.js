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
        var state = {
            entry_player_count: entryCount + 1,
            current_player_count: playerCount + 1
        }
        this.trigger(state);
    }

    onRemovePlayer(playerCount)
    {
        var state = {
            current_player_count: playerCount - 1
        }
        this.trigger(state);
    }

    onRebuyPlayer(rebuy_count)
    {
        var state = {
            rebuy_count: rebuy_count + 1
        }
        this.trigger(state);
    }

    onAddAddOn(addon_count) {
        var state = {
            addon_count: addon_count + 1
        }
        this.trigger(state);
    }

    onStart() {
        var state = {
            timerStarted: true,
            base_time: moment()
        }
        this.trigger(state);
    }



    onResetRestartState() {
        var state =  {
            restart: false
        }
        this.trigger(state);
    }
}