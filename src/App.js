import  React  from 'react';
import  settings  from './images/settings-512.png';
import Configuration  from './Configuration';
import './App.css';


class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isConfigOpen: false
    }
    this.settingsClick = this.settingsClick.bind(this);
  }

  settingsClick() {
    this.setState({
      isConfigOpen: true
    })
  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="h1 text-center col-md-11">
              Poker Timer
            </div>
            <div className="text-right col-md-1">
              <a href="#" ><img height="30" width="30" src={settings} onClick={this.settingsClick}></img></a>
            </div>

            <Configuration isPaneOpen={this.state.isConfigOpen}/>

          </div>
        </div>   
      </div>
    );
  }
}

export default App;
