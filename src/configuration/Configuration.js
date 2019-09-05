import React  from 'react';
import Modal from 'react-modal';
import Form from "react-jsonschema-form";
import SlidingPane  from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import ConfigurationActions from './ConfigurationActions';
import ImportImg from '../images/import.png';
import SaveImg from '../images/save.svg';
import { FilePicker } from 'react-file-picker';
import { save } from 'save-file';

export default class Configuration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpen: false,
            config: "",
            configObject: {},
            closeWindowHandler: undefined
        }
        this.closePane = this.closePane.bind(this);
        this.updateConfiguration = this.updateConfiguration.bind(this);
        this.updateJson = this.updateJson.bind(this);
        this.readTextFile = this.readTextFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSaveFile = this.onSaveFile.bind(this);

        this.schema = {
            title: "Configuration Settings",
            type: "object",
            required: ["name"],
            properties: {
              name: {type: "string", title: "Name", default: "Poker Tournament"},
              entry_player_count: {type: "number", title: "Initial Player Count", default: 9},
              starting_chips: {type: "number", title: "Chips Amount", default: 9000},
              blind_time: {type: "number", title: "Blind Level Time", default: 15},
              break_time: {type: "number", title: "Break Level Time", default: 5},
              buyin: {type: "number", title: "Buyin Amount", default: 10},
              rebuy: {type: "number", title: "Rebuy Amount", default: 10},
              rebuys_through_level: {type: "number", title: "Rebuy Allowed Until Level", default: 6},
              max_rebuys: {type:"number", title: "Max Rebuys", default: 1},
              addon: {type: "number", title: "Addon Amount", default: 0},
              locale: {type: "string", title: "Locale", default: "en"},
              currency: {type: "string", title: "Currency", default: "USD"},
              blinds: {type: "array", title: "Blind Levels", items: {
                 title : "Level",
                 type: "object", 
                  properties: {
                    small_blind: {type: "number", title: "Small Blind", default: 0},
                    big_blind: {type: "number", title: "Big Blind", default: 0},
                    ante: {type: "number", title: "Ante", default: 0},
                    break: {type: "boolean", title: "Break", default: false} 
                  }     
              }},
              places: {type: "array", title: "Places", items:{
                  title: "Place",
                  type: "object",
                  properties: {
                    place: {type: "string", title: "Place"},
                    percentage: {type: "number", title: "Percentage"}
                  }
              }}
            }
          };

        this.uiSchema = {
            "blinds": {
                "ui:options": {
                    orderable: true,
                    addable: true,
                    removable: true
                },
            },
            "blinds.items.propreties.small_blind": {
                "ui:emptyValue:": 0
            },
            "blinds.items.propreties.big_blind": {
                "ui:emptyValue:": 0
            },
            "blinds.items.propreties.ante_blind": {
                "ui:emptyValue:": 0
            }
        };
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.isPaneOpen !== this.state.isPaneOpen) {
            this.setState({
                closeWindowHandler: nextProps.handler,
                isPaneOpen: nextProps.isPaneOpen
            })
        }
    }

    closePane() {
        this.state.closeWindowHandler();
        this.setState({ isPaneOpen: false});
    }

    updateJson(event) {
        this.updateRawJson(event.target.value);
    }

    updateRawJson(rawJson) {

        let jsonObject = JSON.parse(rawJson);
        jsonObject.current_player_count = jsonObject.entry_player_count;
        let newRawJson = JSON.stringify(jsonObject);
        this.setState({
            isPaneOpen: this.state.isPaneOpen,
            config: newRawJson,
            configObject: jsonObject
        })
        ConfigurationActions.configChange(newRawJson);
    }

    updateJsonObject(object) {
        object.current_player_count = object.entry_player_count;

        const rawJson = JSON.stringify(object);
        this.setState({
            isPaneOpen: this.state.isPaneOpen,
            config: rawJson,
            configObject: object
        });
        ConfigurationActions.configChange(rawJson);
    }

    updateConfiguration() {
        ConfigurationActions.configChange(this.state.config);
    }  

    readTextFile (file) {
        let me = this;
        let reader = new FileReader()
        reader.onload = function (event) {
            me.updateRawJson(event.target.result);
        }
        reader.readAsText(file);
    }

    log(type) {
        console.log(type);
    }

    onSubmit(response) {
        this.updateJsonObject(response.formData);
    }

    async onSaveFile() {
        await save(this.state.config, this.state.configObject.name.replace(" ", "_") + '.json');
    }

    render() {
        let me = this;
        return (
            <SlidingPane
            className='some-custom-class'
            overlayClassName='some-custom-overlay-class'
            isOpen={ me.state.isPaneOpen }
            title='Configuration'
            subtitle=''
            onRequestClose={me.closePane}>
            <div className="container-fluid"> 
                <div className="row">
                    <div className="col-md-12 text-center">
                        Configuration import/export
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 text-right">
                    <FilePicker
                        extensions={['json']}
                        onChange={me.readTextFile}
                        onError={errMsg => ( console.log(errMsg) )}>  
                        <img src={ImportImg} alt="import" height="30" width="30"></img>
                    </FilePicker>
                    </div>
                    <div className="col-md-8">
                        <form>
                            <textarea className="form-control text-full-width" value={me.state.config} onChange={me.updateJson} />
                        </form>
                    </div>
                    <div className="col-md-2">
                        <img src={SaveImg} alt="import" height="30" width="30" onClick={me.onSaveFile}></img>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <Form schema={me.schema}
                     uiSchema={me.uiSchema}
                     formData={me.state.configObject}
                     onChange={me.log}
                     onSubmit={me.onSubmit}
                     onError={me.log} />
            </div>
        </SlidingPane>
        );
    }
}