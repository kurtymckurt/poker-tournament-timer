import React  from 'react';
import Reflux from 'reflux';
import Settings  from './images/settings.svg';
import ControlImg from './images/control.svg';
import Configuration  from './configuration/Configuration';
import ConfigurationStore from './configuration/ConfigurationStore';
import ControlStore from './control/ControlStore';
import Control from './control/Control';
import Timer from './timers/Timer';
import ElapsedTimer from './timers/ElapsedTimer';
import CurrentTime from './timers/CurrentTime';
import './App.css';
import BreakTimer from './timers/BreakTimer';
import Sound from 'react-sound';
import BuzzerSound from './sounds/blind_buzzer.mp3';


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
      break_time: 5,
      levels_between_break: 3,
      buyin: 10,
      addon: 0,
      rebuy: 10,
      rebuy_count: 0, 
      max_rebuys: 1,
      rebuys_through_level: 6,
      timerStarted: false,
      blinds: [{"small_blind":25,"big_blind":50,"ante":10},{"small_blind":50,"big_blind":100,"ante":0},{"small_blind":100,"big_blind":200,"ante":0},{"small_blind":200,"big_blind":300,"ante":0},{"small_blind":300,"big_blind":600,"ante":0}]
    }

    this.settingsClick = this.settingsClick.bind(this);
    this.controlClick = this.controlClick.bind(this);
    this.onNextBlind = this.onNextBlind.bind(this);
    this.controlClose = this.controlClose.bind(this);
    this.settingsClose = this.settingsClose.bind(this);
    this.finishedPlayingSound = this.finishedPlayingSound.bind(this);
    this.stores = [ConfigurationStore, ControlStore];
  }

  settingsClick() {
    this.setState({
      isConfigOpen: true
    })
  }

  settingsClose() {
    this.setState({
      isConfigOpen: false
    })
  }

  controlClick() {
    this.setState({
      isControlOpen: true
    })
  }

  controlClose() {
    this.setState({
      isControlOpen: false
    })
  }

  finishedPlayingSound() {
    this.setState({
      playSound: Sound.status.STOPPED
    });
  }

  onNextBlind() {
    this.setState({
      playSound: Sound.status.PLAYING
    });
    console.log("next blind");
    const nextBlindLevel = this.state.current_blind_level + 1;
    this.setState({
      current_blind_level: nextBlindLevel,
    });
  }

  levelUntilBreak(current_blind_level, blinds) {
    var count = 1;
    if(current_blind_level + 1 < blinds.length) {
      for(var i = current_blind_level+1; i < blinds.length; i++) {
        if(blinds[i].break){
          return count;
        }
        count = count + 1;
      }
    }
    return count;
  }

  render() {
  
    var me = this;
    const {buyin, rebuy, addon, 
      current_blind_level, blinds, blind_time, break_time, entry_player_count, current_player_count,
      rebuy_count, rebuys_through_level, max_rebuys, starting_chips,
      timerStarted} = me.state;

    const chip_count = starting_chips * entry_player_count;
    const avg_chip_count = Math.floor(chip_count / current_player_count);
    const total_pot = (buyin * entry_player_count) + (rebuy * rebuy_count);
    const current_blind_info = blinds[current_blind_level];
    const next_blind_info = blinds[current_blind_level + 1];
    const isItBreakTime = current_blind_info.break;
    var blindOrBreakTime = isItBreakTime ? break_time : blind_time;

    var levels_until_break = this.levelUntilBreak(current_blind_level, blinds);
    var time_until_break = levels_until_break * blind_time;

    return (
      <div>
        <div className="container-fluid text-light">
          <div className="row core-color">
            <div className="h1 text-center col-md-12">
            {me.state.name}
            </div>
          </div>
          <Sound url={BuzzerSound} playStatus={me.state.playSound} onFinishedPlaying={this.finishedPlayingSound}></Sound>
          <Configuration handler={me.settingsClose} isPaneOpen={me.state.isConfigOpen}/>
          <Control 
            handler={me.controlClose} 
            isPaneOpen={me.state.isControlOpen}
            current_player_count={current_player_count}
            entry_player_count={entry_player_count}
            started={timerStarted}
          />
          <div className="row core-color text-light">
            <div className="col-md-12 h4 text-center">
              <img className="settings-fill-grayscale" height="30" width="30" title="Action options" alt="Control" src={ControlImg} onClick={me.controlClick}></img>
              ${buyin} Buy-in, {rebuy > 0 && '$' + rebuy + ' to rebuy (Through Round ' + rebuys_through_level + ' Max ' + max_rebuys + ' per player)'}{rebuy === 0 && 'No Rebuys'}, {addon > 0 && '$' + addon + ' to add-on'}{addon === 0 && 'No add-ons'}
              <img className="settings-fill-grayscale" height="30" width="30" title="Configuration options" alt="Settings" src={Settings} onClick={me.settingsClick}></img>
            </div>
          </div>
          <div className="row text-center side-bar-color top-border">
            <div className="col-md-2 align-self-center bottom-border">Round <br/>{current_blind_level + 1}</div>
            
            <div className="col-md-8 align-self-center core-color left-right-border">
              <Timer start={timerStarted} blind_time={blindOrBreakTime} onComplete={me.onNextBlind} />
            </div>
            <div className="col-md-2 align-self-center bottom-border"><CurrentTime></CurrentTime></div>
          </div>
          <div className="row text-center side-bar-color">
            <div className="col-md-2 align-self-center bottom-border ">Entries <br/> {entry_player_count}</div>
            <div className="col-md-8 core-color left-right-border"></div>
            <div className="col-md-2 align-self-center bottom-border">Elapsed Time <br/> <ElapsedTimer start={timerStarted} /></div>
          </div>
          <div className="row text-center side-bar-color">
            <div className="col-md-2 align-self-center bottom-border">Players In <br/>{current_player_count}</div>
            <div className="col-md-8 core-color left-right-border"></div>
            <div className="col-md-2 align-self-center bottom-border">Next Break <br/><BreakTimer time={time_until_break} start={timerStarted}></BreakTimer></div>
          </div>
          <div className="row text-center side-bar-color">
            <div className="col-md-2 align-self-center bottom-border">Rebuys <br/>{rebuy_count}</div>

            {isItBreakTime && 
            <div className="col-md-8 text-next-blind core-color all-around-border">BREAK</div>
            }
            {!isItBreakTime && 
            <div className="col-md-8 text-next-blind core-color all-around-border">{current_blind_info.small_blind} / {current_blind_info.big_blind}<br/>
            {current_blind_info.ante > 0 && 'Ante: $' + current_blind_info.ante}            
            </div>
            }
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center side-bar-color">
            <div className="col-md-2 align-self-center bottom-border">Chip Count <br/>${chip_count}</div>
            <div className="col-md-8 core-color left-right-border"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center side-bar-color">
            <div className="col-md-2 align-self-center bottom-border">Avg Stack <br/>${avg_chip_count}</div>
            {!isItBreakTime && 
            <div className="col-md-8 align-self-center core-color left-right-border">Next Round: <br/>Blinds: {next_blind_info.small_blind} / {next_blind_info.big_blind} <br/> {current_blind_info.ante > 0 && 'Ante: $' + current_blind_info.ante}</div>
            } 
            {isItBreakTime && 
            <div className="col-md-8 align-self-center core-color left-right-border">Next Round: <br/>BREAK</div>
            }
            <div className="col-md-2"></div>
          </div>
          <div className="row text-center side-bar-color">
            <div className="col-md-2 align-self-center">Total Pot <br/>${total_pot}</div>
            <div className="col-md-8 core-color left-right-border"></div>
            <div className="col-md-2"></div>
          </div>
        </div>   
      </div>
    );
  }
}

export default App;
