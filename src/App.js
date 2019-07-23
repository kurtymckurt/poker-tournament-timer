import React  from 'react';
import Reflux from 'reflux';
import Settings  from './images/settings.svg';
import Configuration  from './Configuration';
import ConfigurationStore from './ConfigurationStore';
import Timer from './Timer';
import './App.css';


class App extends Reflux.Component {

  constructor() {
    super();
    this.state = {
      isConfigOpen: false,
      name: "Poker Tournament",
      current_blind_level: 1,
      initial_player_count: 9,
      buyin: 10,
      addon: 0,
      rebuy: 10
    }
    this.settingsClick = this.settingsClick.bind(this);
    this.store = ConfigurationStore;
  }

  settingsClick() {
    this.setState({
      isConfigOpen: true
    })
  }

  onNextBlind() {
    console.log("next blind");
  }

  render() {
  
    var me = this;
    const {buyin, rebuy, addon} = me.state;
    return (
      <div>
        <div className="container-fluid">
          <div className="row bg-dark text-light">
            <div className="h1 text-center col-md-12">
            {me.state.name}
            </div>
          </div>
          <Configuration isPaneOpen={me.state.isConfigOpen}/>
          <div className="row  bg-dark text-light">
            <div className="col-md-12 h2 text-center">
              ${buyin} Buy-in, {rebuy > 0 && '$' + rebuy + ' to rebuy'}{rebuy === 0 && 'No Rebuys'}, {addon > 0 && '$' + addon + ' to add-on'}{addon === 0 && 'No Add-ons'}
              <a href="#" ><img className="settings-fill-grayscale" height="30" width="30" alt="Settings" src={Settings} onClick={me.settingsClick}></img></a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 h1 text-center">
              <Timer state={me.state} onComplete={me.onNextBlind}/>
            </div>
          </div> 
          
        </div>   
      </div>
    );
  }
}

export default App;
