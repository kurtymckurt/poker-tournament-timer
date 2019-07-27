var Reflux = require('reflux');

var ControlActions = Reflux.createActions([
    "addPlayer", "removePlayer", "rebuyPlayer", "startOrPauseGame", "addAddOn", "resetRestartState"
]);


export default ControlActions;