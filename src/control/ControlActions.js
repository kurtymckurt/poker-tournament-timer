const Reflux = require('reflux');

const ControlActions = Reflux.createActions([
    "addPlayer", "removePlayer", "rebuyPlayer", "start", "addAddOn", "resetRestartState"
]);


export default ControlActions;