import React, { Component }  from 'react';
import Modal from 'react-modal';
import {render} from 'react-dom';
import Form from "react-jsonschema-form";
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
            config: "",
            configObject: {}
        }
        this.closePane = this.closePane.bind(this);
        this.updateConfiguration = this.updateConfiguration.bind(this);
        this.updateJson = this.updateJson.bind(this);
        this.readTextFile = this.readTextFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.schema = {
            title: "Configuration Settings",
            type: "object",
            required: ["name", "blind_levels"],
            properties: {
              name: {type: "string", title: "Name", default: "Poker Tournament"},
              initial_player_count: {type: "number", title: "Initial Player Count", default: 9},
              blind_levels: {type: "number", title: "Blind Level Count", default: 30},
              blind_time: {type: "number", title: "Blind Level Time", default: 15},
              break_time: {type: "number", title: "Break Level Time", default: 5},
              levels_between_break: {type: "number", title: "Levels Between Break", default: 3},
              buyin: {type: "number", title: "Buyin Amount", default: 10},
              rebuy: {type: "number", title: "Rebuy Amount", default: 10},
              addon: {type: "number", title: "Addon Amount", default: 0},
              blinds: {type: "array", title: "Blind Levels", items: {
                 title : "Level",
                 type: "object", 
                  properties: {
                    small_blind: {type: "number", title: "Small Blind"},
                    big_blind: {type: "number", title: "Big Blind"},
                    ante: {type: "number", title: "Ante"}     
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
                }
            }
        };
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

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
        this.updateRawJson(event.target.value);
    }

    updateRawJson(rawJson) {
        console.log(rawJson);
        this.setState({
            isPaneOpen: this.state.isPaneOpen,
            config: rawJson,
            configObject: JSON.parse(rawJson)
        })
        ConfigurationActions.configChange(rawJson);
    }

    updateJsonObject(object) {
        const rawJson = JSON.stringify(object);
        console.log(object);
        this.setState({
            isPaneOpen: this.state.isPaneOpen,
            config: rawJson,
            configObject: object
        });
        ConfigurationActions.configChange(rawJson);
    }

    updateConfiguration() {
        ConfigurationActions.configChange(this.state.config);
        // this.closePane();
    }  

    readTextFile (file) {
        var me = this;
        console.log(file);
        var reader = new FileReader()
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

    render() {
        var me = this;
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
                        <img src={ImportImg} height="30" width="30"></img>
                    </FilePicker>
                    </div>
                    <div className="col-md-10">
                        <form>
                            <textarea className="form-control text-full-width" value={me.state.config} onChange={me.updateJson} />
                        </form>
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