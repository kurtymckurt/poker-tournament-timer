import Reflux from 'reflux';
import ConfigurationActions from './ConfigurationActions';

export default class ConfigurationStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.listenables = ConfigurationActions;
    }

    onConfigChange(config)
    {
        const jsonConfig = JSON.parse(config);
        this.trigger(jsonConfig);
    }
}