import React  from 'react';
import  SlidingPane  from 'react-sliding-pane';

export default class Configuration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpen: false
        }
    }

    render() {
        return (
        <SlidingPane
                closeIcon={<div>Some div containing custom close icon.</div>}
                isOpen={ this.state.isPaneOpen }
                title='Hey, it is optional pane title.  I can be React component too.'
                from='left'
                width='200px'
                onRequestClose={ () => this.setState({ isPaneOpen: false }) }>
                <div>And I am pane content on left.</div>
            </SlidingPane>
        );
    }
}