import React  from 'react';
import Reflux from 'reflux';
import Settings  from './images/settings.svg';
import Configuration  from './Configuration';
import ConfigurationStore from './ConfigurationStore';
import Timer from './Timer';
import ElapsedTimer from './ElapsedTimer';
import update from 'react-addons-update';
import './App.css';


class App extends Reflux.Component {

  constructor() {
    super();
    this.state = {
      isConfigOpen: false,
      name: "Poker Tournament",
      current_blind_level: 1,
      entry_player_count: 9,
      current_player_count: 9,
      starting_chips: 20000,
      buyin: 10,
      addon: 0,
      rebuy: 10,
      rebuy_count: 0,
      curTime : new Date()
    }

    this._elaspedTimer = React.createRef();
    this.settingsClick = this.settingsClick.bind(this);
    this.store = ConfigurationStore;
    this.updateTime = this.updateTime.bind(this);
    setInterval(this.updateTime, 1000)
  }

  updateTime(){
    this.setState(
      update(this.state, {curTime: { $set: new Date }})
    );
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
    const {buyin, rebuy, addon, 
      current_blind_level, entry_player_count, current_player_count,
      rebuy_count, starting_chips, curTime } = me.state;

    const chip_count = starting_chips * entry_player_count;
    const avg_chip_count = chip_count / current_player_count;
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
          <div className="row ">
            <div className="col-md-2">Round {current_blind_level}</div>
            <div className="col-md-8 h1 text-center">
              <Timer state={me.state} onComplete={me.onNextBlind} />
            </div>
            <div className="col-md-2">Current Time {curTime.getHours() + ":" + curTime.getMinutes() + ":" + curTime.getSeconds()}</div>
          </div>
          <div className="row ">
            <div className="col-md-2">Entries {entry_player_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2">Elapsed Time: <ElapsedTimer/></div>
          </div>
          <div className="row ">
            <div className="col-md-2">Players In {current_player_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row ">
            <div className="col-md-2">Rebuys {rebuy_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row ">
            <div className="col-md-2">Chip Count ${chip_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row ">
            <div className="col-md-2">Avg Stack ${avg_chip_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row ">
            <div className="col-md-2">Total Pot $</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row ">
            <div className="col-md-2"></div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
        </div>   
      </div>
    );
  }
}

export default App;
