import React  from 'react';
import Reflux from 'reflux';
import Settings  from './images/settings-512.png';
import Configuration  from './Configuration';
import ConfigurationStore from './ConfigurationStore';
import Timer from './Timer';
import './App.css';


class App extends Reflux.Component {

  constructor() {
    super();
    this.state = {
      isConfigOpen: false,
      name: "Poker Tournament "
    }
    this.settingsClick = this.settingsClick.bind(this);
    this.store = ConfigurationStore;
  }

  settingsClick() {
    this.setState({
      isConfigOpen: true
    })
  }

  render() {
  
    var me = this;
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="h1 text-center col-md-11">
              Poker Timer
            </div>
            <div className="text-right col-md-1">
              <a href="#" ><img height="30" width="30" alt="Settings image" src={Settings} onClick={this.settingsClick}></img></a>
            </div>

            <Configuration isPaneOpen={this.state.isConfigOpen}/>

            <div>{me.state.name}</div>


            <Timer />
          </div>
        </div>   
      </div>
    );
  }
}

export default App;
