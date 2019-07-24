import React  from 'react';
import Reflux from 'reflux';
import Settings  from './images/settings.svg';
import ControlImg from './images/control.svg';
import Configuration  from './Configuration';
import Control from './Control';
import ConfigurationStore from './ConfigurationStore';
import TimerStore from './TimerStore';
import Timer from './Timer';
import ElapsedTimer from './ElapsedTimer';
import CurrentTime from './CurrentTime';
import update from 'react-addons-update';
import './App.css';


class App extends Reflux.Component {

  constructor() {
    super();
    this.state = {
      isConfigOpen: false,
      isControlOpen: false,
      name: "Poker Tournament",
      current_blind_level: 0,
      entry_player_count: 9,
      current_player_count: 9,
      starting_chips: 20000,
      buyin: 10,
      addon: 0,
      rebuy: 10,
      rebuy_count: 0, 
      max_rebuys: 1,
      rebuys_through_level: 6,
      blinds: [{"small_blind":25,"big_blind":50,"ante":10},{"small_blind":50,"big_blind":100,"ante":0},{"small_blind":100,"big_blind":200,"ante":0},{"small_blind":200,"big_blind":300,"ante":0},{"small_blind":300,"big_blind":600,"ante":0}]
    }

    this.settingsClick = this.settingsClick.bind(this);
    this.controlClick = this.controlClick.bind(this);
    this.onNextBlind = this.onNextBlind.bind(this);
    this.stores = [ConfigurationStore, TimerStore];
  }

  settingsClick() {
    this.setState({
      isConfigOpen: true
    })
  }

  controlClick() {
    this.setState({
      isControlOpen: true
    })
  }

  onNextBlind() {
    console.log("next blind");
    const nextBlindLevel = this.state.current_blind_level + 1
    this.setState(
      update(this.state, { current_blind_level : { $set: nextBlindLevel }})
    );
  }

  render() {
  
    var me = this;
    const {buyin, rebuy, addon, 
      current_blind_level, blinds, entry_player_count, current_player_count,
      rebuy_count, rebuys_through_level, max_rebuys, starting_chips} = me.state;

    const chip_count = starting_chips * entry_player_count;
    const avg_chip_count = chip_count / current_player_count;
    const total_pot = (buyin * entry_player_count) + (rebuy * rebuy_count);
    const current_blind_info = blinds[current_blind_level];
    const next_blind_info = blinds[current_blind_level + 1];
    return (
      <div>
        <div className="container-fluid">
          <div className="row bg-dark text-light">
            <div className="h1 text-center col-md-12">
            {me.state.name}
            </div>
          </div>
          <Configuration isPaneOpen={me.state.isConfigOpen}/>
          <Control isPaneOpen={me.state.isControlOpen} />
          <div className="row  bg-dark text-light">
            <div className="col-md-12 h4 text-center">
              <img className="settings-fill-grayscale" height="30" width="30" alt="Control" src={ControlImg} onClick={me.controlClick}></img>
              ${buyin} Buy-in, {rebuy > 0 && '$' + rebuy + ' to rebuy (Through Round ' + rebuys_through_level + ' Max ' + max_rebuys + ' per player)'}{rebuy === 0 && 'No Rebuys'}, {addon > 0 && '$' + addon + ' to add-on'}{addon === 0 && 'No add-ons'}
              <img className="settings-fill-grayscale" height="30" width="30" alt="Settings" src={Settings} onClick={me.settingsClick}></img>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Round <br/>{current_blind_level + 1}</div>
            <div className="col-md-8 h1">
              <Timer start={me.state.timerStarted} state={me.state} onComplete={me.onNextBlind} />
            </div>
            <div className="col-md-2"><CurrentTime></CurrentTime></div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Entries <br/> {entry_player_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2">Elapsed Time <br/> <ElapsedTimer start={me.state.timerStarted} /></div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Players In <br/>{current_player_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2">Next Break <br/></div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Rebuys <br/>{rebuy_count}</div>
            <div className="col-md-8 h3">Blinds <br/> {current_blind_info.small_blind} / {current_blind_info.big_blind}<br/>
            {current_blind_info.ante > 0 && 'Ante: $' + current_blind_info.ante}            
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Chip Count <br/>${chip_count}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Avg Stack <br/>${avg_chip_count}</div>
            <div className="col-md-8">Next Round: <br/> Blinds: {next_blind_info.small_blind} / {next_blind_info.big_blind} <br/> {current_blind_info.ante > 0 && 'Ante: $' + current_blind_info.ante}</div>
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center">
            <div className="col-md-2">Total Pot <br/>${total_pot}</div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center">
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
