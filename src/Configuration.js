import React  from 'react';
// import Modal from 'react-modal';
import SlidingPane  from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import ConfigurationActions from './ConfigurationActions';
import ImportImg from './images/import.png'
import { FilePicker } from 'react-file-picker'

export default class Configuration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpen: false,
            config: ""
        }
        this.closePane = this.closePane.bind(this);
        this.updateConfiguration = this.updateConfiguration.bind(this);
        this.updateJson = this.updateJson.bind(this);
        this.readTextFile = this.readTextFile.bind(this);
    }

    // componentDidMount() {
    //     Modal.setAppElement(this.el);
    // }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.isOpen !== this.state.isPaneOpen) {
            this.setState({
                isPaneOpen: nextProps.isPaneOpen
            })
        }
    }

    closePane() {
        this.setState({ isPaneOpen: false });
    }

    updateJson(event) {
        this.setState({
            isPaneOpen: this.state.isPaneOpen,
            config: event.target.value
        })
    }

    updateConfiguration() {
        ConfigurationActions.configChange(this.state.config);
        this.closePane();
    }

    readTextFile(fileObject) {    
        readTextFile = file => {
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = () => {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status == 0) {
                        var allText = rawFile.responseText;
                        this.setState({
                            text: allText
                        });
                    }
                }
            };
            rawFile.send(null);
        };
    }

    render() {
        var me = this;
        return (
            <SlidingPane
            className='some-custom-class'
            overlayClassName='some-custom-overlay-class'
            isOpen={ me.state.isPaneOpen }
            title='Configuration'
            subtitle=''
            onRequestClose={this.closePane}>
            <div className="container-fluid"> 
                <div className="row">
                    <div className="col-md-2">
                    <FilePicker
                        extensions={['json']}
                        onChange={FileObject => ( this.readTextFile(FileObject) )}
                        onError={errMsg => ( console.log(errMsg) )}>  
                        <img src={ImportImg} height="30" width="30"></img>
                    </FilePicker>
                    </div>
                    <div className="col-md-10">
                        <form>
                            <textarea className="form-control text-full-width" onChange={me.updateJson} />
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button name="button" onClick={me.updateConfiguration}>apply</button>
                    </div>
                </div>
                {me.state.config}
            </div>
        </SlidingPane>
        );
    }
}