import Reflux from 'reflux';
import ControlActions from './ControlActions';

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

    onRebuyPlayer(entryCount)
    {
        var state = {
            entry_player_count: entryCount + 1
        }
        this.trigger(state);
    }

    onStartOrPauseGame(timerStarted) {
        var state = {
            timerStarted: !timerStarted
        }
        this.trigger(state);
    }
}