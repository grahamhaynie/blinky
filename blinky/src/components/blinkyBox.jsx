import React from 'react';
import '../css/box.css'

export default class BoxForm extends React.Component {
    constructor(props){
        super(props);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKey = this.handleKey.bind(this);

        this.state = {
            text: '> ',
            trigger: false,
        };
    }

    handleTextChange(e) {
        if(this.state.trigger){
            var newText = e.target.value + '> ';
            this.setState({
                text: newText,
                trigger: false,
            });
        }else{
            this.setState({text: e.target.value});
        }

    }

    handleKey(e){
        // parse key press 
        if(e.key === 'Enter'){
            var command = this.state.text.slice(this.state.text.lastIndexOf('>') + 1);
            console.log('command: ' + command);

            this.setState({trigger: true});
        }

        
        //console.log(e.key);

        // TODO - maybe add key map to make simpler?

        // - handle delete key seperately -> once add map
        //   check if delete pressed & text selected. if so, don't update state.


    }

    render(){

        // note - may need to use react's ref instead 

        return(
            <div class="box">
                <textarea 
                    unselectable="on"
                    value={this.state.text} 
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKey} 
                />
            </div>
        );
    }
}