import React  from 'react';
import Modal from 'react-modal';
import SlidingPane  from 'react-sliding-pane';
import ControlActions from './ControlActions';
import 'react-sliding-pane/dist/react-sliding-pane.css';

export default class Control extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isControlPaneOpen: false,
            closeWindowHandler: undefined,
        }
        this.closePane = this.closePane.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
        this.knockOutPlayer = this.knockOutPlayer.bind(this);
        this.addAddOn = this.addAddOn.bind(this);
        this.startOrPauseGame = this.startOrPauseGame.bind(this);
        this.rebuyPlayer = this.rebuyPlayer.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.isPaneOpen !== this.state.isControlPaneOpen) {
            this.setState({
                isControlPaneOpen: nextProps.isPaneOpen,
                closeWindowHandler: nextProps.handler
            })
        }
    }

    closePane() {
        this.state.closeWindowHandler();
        this.setState({ isControlPaneOpen: false });
    }

    updateJson(event) {
        this.updateRawJson(event.target.value);
    }

    addPlayer(){
        ControlActions.addPlayer(this.props.current_player_count, this.props.entry_player_count);
    }

    knockOutPlayer(){
        ControlActions.removePlayer(this.props.current_player_count);
    }

    rebuyPlayer(){
        ControlActions.rebuyPlayer(this.props.rebuy_count);
    }

    addAddOn(){
        ControlActions.addAddOn(this.props.addon_count);
    }

    startOrPauseGame() {
        ControlActions.start();
    }

    render() {
        const me = this;
        const {current_player_count, entry_player_count, rebuy_count, started, addon_count, allowRebuy,
            allowAddOn} = me.props;

        const startOrPause = !started ? (<button onClick={this.startOrPauseGame}>Start Tournament</button>)
            : (<button onClick={this.startOrPauseGame}>Pause Tournament</button>)

        return (
            <SlidingPane
            className='some-custom-class'
            overlayClassName='some-custom-overlay-class'
            isOpen={ me.state.isControlPaneOpen }
            from='left'
            title='Controls'
            subtitle='Add/Remove players, Start the game, etc...'
            onRequestClose={me.closePane}>
            <div className="container-fluid"> 
                <div className="row">
                    <div className="col-md-12 text-center">
                        Controls
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        Current Players: {current_player_count} <br/>
                        Total Entries: {entry_player_count} <br/>
                        Rebuys: {rebuy_count} <br/>
                        Addons: {addon_count}
                    </div>
                </div>

                <div className="row text-center">
                    <div className="col-md-3">
                        {startOrPause}
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-md-3">
                        <button onClick={this.addPlayer}>Add Player</button>
                    </div>
                    <div className="col-md-3">
                        <button onClick={this.knockOutPlayer}>Remove Player</button>
                    </div>
                    <div className="col-md-3">
                        <button onClick={this.rebuyPlayer} disabled={!allowRebuy}>Rebuy Player</button>
                    </div>
                    <div className="col-md-3">
                        <button onClick={this.addAddOn} disabled={!allowAddOn}>Add Add On</button>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                
            </div>
        </SlidingPane>
        );
    }
}