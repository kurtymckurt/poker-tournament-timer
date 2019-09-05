const Reflux = require('reflux');

const ControlActions = Reflux.createActions([
    "addPlayer", "removePlayer", "rebuyPlayer", "start", "pause", "resume", "addAddOn", "resetRestartState", "changePlaces"
]);


export default ControlActions;