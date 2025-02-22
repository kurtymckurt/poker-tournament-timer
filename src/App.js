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
import Places from './components/Places';
import Sound from 'react-sound';
import BuzzerSound from './sounds/blind_buzzer.mp3';
import ControlActions from './control/ControlActions';
import moment from 'moment';


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
      blind_time: 15,
      break_time: 5,
      levels_between_break: 3,
      buyin: 10,
      addon: 0,
      addon_count: 0,
      rebuy: 10,
      rebuy_count: 0, 
      max_rebuys: 1,
      rebuys_through_level: 6,
      timerStarted: false,
      locale: 'en',
      currency: 'USD',
      blinds: [{"small_blind":25,"big_blind":50,"ante":10},{"small_blind":50,"big_blind":100,"ante":0},{"small_blind":100,"big_blind":200,"ante":0},{"small_blind":200,"big_blind":300,"ante":0},{"small_blind":300,"big_blind":600,"ante":0}],
      places : [
        { "place": undefined, "percentage" :60 },
        { "place": "2", "percentage" :30 },
        { "place": "3-4",  "percentage" :5 }
      ]
    }

    this.settingsClick = this.settingsClick.bind(this)
    this.controlClick = this.controlClick.bind(this)
    this.onNextBlind = this.onNextBlind.bind(this)
    this.controlClose = this.controlClose.bind(this)
    this.settingsClose = this.settingsClose.bind(this)
    this.finishedPlayingSound = this.finishedPlayingSound.bind(this)
    this.getNumberInLocale = this.getNumberInLocale.bind(this)
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
    const {current_blind_level, break_time, blind_time, blinds} = this.state;
    const nextBlindLevel = current_blind_level + 1;
    const isItBreakTime = blinds[nextBlindLevel].break;
    const blindOrBreakTime = isItBreakTime ? break_time : blind_time;

    this.setState({
      current_blind_level: nextBlindLevel,
      playSound: Sound.status.PLAYING
    });

    ControlActions.start(blindOrBreakTime)
  }

  levelUntilBreak(current_blind_level, blinds) {
    let count = 1;
    if(current_blind_level + 1 < blinds.length) {
      for(let i = current_blind_level+1; i < blinds.length; i++) {
        if(blinds[i].break){
          return count;
        }
        count = count + 1;
      }
    }
    return count;
  }

  getNumberInLocale(number) {
    return this.getNumberInLocale(number, false)
  }

  getNumberInLocale(number,  isCurrency) {
    const {locale, currency} = this.state;
    if(currency === undefined || !isCurrency) {
      return number.toLocaleString(locale);
    } else {
      return number.toLocaleString(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0})
    }
  }

  getEffectiveLevel(current_blind_level, blinds) {
    let level = 1;
    for(let i = 0; i < current_blind_level; i++) {
      if(!blinds[i].break) {
        level += 1;
      }
    }
    return level;
  }

  render() {
  
    const me = this;
    const {buyin, rebuy, addon, 
      current_blind_level, blinds, blind_time, break_time, entry_player_count, current_player_count,
      rebuy_count, rebuys_through_level, max_rebuys, starting_chips, addon_count,
      timerStarted, places, restart, base_time, locale, currency, pauseTimer} = me.state;

    const chip_count = starting_chips * entry_player_count;
    const avg_chip_count = Math.floor(chip_count / current_player_count);
    const total_pot = (buyin * entry_player_count) + (rebuy * rebuy_count) + (addon * addon_count);
    const current_blind_info = blinds[current_blind_level];
    const next_blind_info = blinds[current_blind_level + 1];
    const isItBreakTime = current_blind_info.break;

    const isNextRoundBreakTime = next_blind_info.break;

    const blindOrBreakTime = isItBreakTime ? break_time : blind_time;

    const levels_until_break = this.levelUntilBreak(current_blind_level, blinds);
    const time_until_break = levels_until_break * blind_time;

    const allowAddOn = addon > 0;
    const allowRebuy = rebuy > 0 || rebuys_through_level >= current_blind_level;

    const nextBigBlind = this.getNumberInLocale(next_blind_info.big_blind);
    const nextSmallBlind = this.getNumberInLocale(next_blind_info.small_blind);
    const nextAnte = this.getNumberInLocale(next_blind_info.ante);

    const currentBigBlind = this.getNumberInLocale(current_blind_info.big_blind);
    const currentSmallBlind = this.getNumberInLocale(current_blind_info.small_blind);
    const currentAnte = this.getNumberInLocale(current_blind_info.ante);
    const end_time = moment(base_time).add(blindOrBreakTime, 'm');
    const currentLevel = this.getEffectiveLevel(current_blind_level, blinds);

    return (
      <div>
        {/* Header section */}
        <div className="container-fluid text-light">
          <div className="row core-color">
            <div className="h1 text-center col-md-12">
            {me.state.name}
            </div>
          </div>
          <div className="row core-color text-light">
            <div className="col-md-12 h4 text-center">
              <img className="settings-fill-grayscale" height="30" width="30" title="Action options" alt="Control" src={ControlImg} onClick={me.controlClick}></img>
              ${buyin} Buy-in, {rebuy > 0 && '$' + rebuy + ' to rebuy (Through Round ' + rebuys_through_level + ' Max ' + max_rebuys + ' per player)'}{rebuy === 0 && 'No Rebuys'}, {addon > 0 && '$' + addon + ' to add-on'}{addon === 0 && 'No add-ons'}
              <img className="settings-fill-grayscale" height="30" width="30" title="Configuration options" alt="Settings" src={Settings} onClick={me.settingsClick}></img>
            </div>
          </div>
        </div>
        <div className="container-fluid text-light top-border bottom-border">
          <div className="row side-bar-color text-center">
            <div className="col-md-2 flex">
              {/* left section */}
              <div className="row bottom-border">
                <div className="col-md-12">Round <br/>{currentLevel}</div>
              </div>
              <div className="row bottom-border">
                <div className="col-md-12">Entries <br/>{this.getNumberInLocale(entry_player_count) }</div>
              </div>
              <div className="row bottom-border">
                <div className="col-md-12">Players In <br/>{this.getNumberInLocale(current_player_count)}</div>
              </div>
              <div className="row bottom-border">
                <div className="col-md-12">Rebuys <br/>{this.getNumberInLocale(rebuy_count)}</div>
              </div>
              <div className="row bottom-border">
                <div className="col-md-12">Add Ons <br/>{this.getNumberInLocale(addon_count)}</div>
              </div>
              <div className="row bottom-border">
                <div className="col-md-12">Chip Count <br/>{this.getNumberInLocale(chip_count)}</div>
              </div>
              <div className="row bottom-border">
              <div className="col-md-12">Avg Stack <br/>{this.getNumberInLocale(avg_chip_count)}</div>
              </div>
              <div className="row">
              <div className="col-md-12">Total Pot <br/>{this.getNumberInLocale(total_pot, true)}</div>
              </div>
            </div>
            <div className="col-md-8 core-color left-right-border text-center">
              {/* center section */}
              <div className="row bottom-border">
                <div className="col-md-12">
                  <Timer start={timerStarted} restart={restart} pause={pauseTimer} end_time={end_time} onComplete={me.onNextBlind} />
                </div>
              </div>
              <div className="row bottom-border">
                {isItBreakTime && 
                  <div className="col-md-12 text-next-blind">BREAK</div>
                }
                {!isItBreakTime && 
                  <div className="col-md-12 text-next-blind">Blinds: <br/> {currentSmallBlind} / {currentBigBlind}<br/>
                {current_blind_info.ante > 0 && 'Ante: ' + currentAnte}
                </div>
                }
              </div>
              <div className="row">
                {!isNextRoundBreakTime && 
                  <div className="col-md-12">Next Round: <br/>Blinds: {nextSmallBlind} / {nextBigBlind} <br/> {next_blind_info.ante > 0 && 'Ante: ' + nextAnte}</div>
                } 
                {isNextRoundBreakTime && 
                  <div className="col-md-12">Next Round: <br/>BREAK</div>
                }
              </div>
            </div>
            <div className="col-md-2 side-bar-color text-center">
              {/* right section */}
              <div className="row bottom-border">
                <div className="col"><CurrentTime/></div>
              </div>
              <div className="row bottom-border">
                <div className="col">Elapsed Time <br/> <ElapsedTimer base_time={base_time} start={timerStarted} /></div>
              </div>
              <div className="row bottom-border">
                <div className="col">Next Break <br/><BreakTimer base_time={base_time} time={time_until_break} start={timerStarted}></BreakTimer></div>
              </div>
              <div className="row">
              <div className="col"><Places total_pot={total_pot} places={places} locale={locale} currency={currency}/></div>
              </div>

          </div>       
        </div>
        <Sound url={BuzzerSound} playStatus={me.state.playSound} onFinishedPlaying={this.finishedPlayingSound}></Sound>
        <Configuration handler={me.settingsClose} isPaneOpen={me.state.isConfigOpen} />
        <Control 
          handler={me.controlClose} 
          isPaneOpen={me.state.isControlOpen}
          current_player_count={current_player_count}
          entry_player_count={entry_player_count}
          started={timerStarted}
          paused={pauseTimer}
          rebuy_count={rebuy_count}
          addon_count={addon_count}
          allowRebuy={allowRebuy}
          allowAddOn={allowAddOn}
          places={places}
          />
      </div>
    </div>
    );
  }
}

export default App;
