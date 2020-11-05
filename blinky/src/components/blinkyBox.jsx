import React from 'react';
import '../css/box.css'

export default class BoxForm extends React.Component {
    constructor(props){
        super(props);

        this.handleTextChange = this.handleTextChange.bind(this);

        this.state = {
            text: 'type here...',
        };
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    render(){
        return(
            <div>
                <textarea value={this.state.text} onChange={this.handleTextChange} />
            </div>
        );
    }
}