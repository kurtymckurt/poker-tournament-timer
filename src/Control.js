import React  from 'react';
import Modal from 'react-modal';
import SlidingPane  from 'react-sliding-pane';
import TimerActions from './TimerActions';
import 'react-sliding-pane/dist/react-sliding-pane.css';

export default class Configuration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isControlPaneOpen: false,
            closeWindowHandler: undefined
        }
        this.closePane = this.closePane.bind(this);
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

    start() {
        TimerActions.start();
    }

    render() {
        var me = this;
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
                    <div className="col-md-12 text-right">
                        <button onClick={this.start}>Start</button>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                
            </div>
        </SlidingPane>
        );
    }
}