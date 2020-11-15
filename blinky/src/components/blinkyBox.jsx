import React from 'react';
import '../css/box.css'


function getPrompt(){
    let newDate = new Date()
    let hours = newDate.getHours();
    let mins = newDate.getMinutes();
    let secs = newDate.getSeconds();

    return `${hours<10?`0${hours}`:`${hours}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`} > `
}

export default class BoxForm extends React.Component {
    constructor(props){
        super(props);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.boxRef = React.createRef();

        let prompt = getPrompt();
        this.state = {
            text: prompt,
            keyArray: [],
            selectTrigger: false,
            selected: "",
            lineIndex: 0,
            index: prompt.length,
        };
    }

    handleTextChange(e) {
        if(this.state.keyArray['Enter'] === 1){ 
            var command = this.state.text.slice(this.state.text.lastIndexOf('>') + 1);
            console.log('command: ' + command);

            var prompt = getPrompt();
            var newText = e.target.value + prompt;
            this.setState({
                text: newText,
                lineIndex: 0,
                index: this.state.index + prompt.length + 1,
            });
        }else if(this.state.keyArray['Backspace'] === 1){ 
            // disable highlight select and delete, and deletion of anything before prompt
            if(this.state.selected === "" && this.state.lineIndex - 1 >= 0){
                this.setState({
                    text: e.target.value,
                    lineIndex: this.state.lineIndex - 1,
                    index: this.state.index - 1,
                });
            }
        }
        else {
            this.setState({
                text: e.target.value,
                lineIndex: this.state.lineIndex + 1,
                index: this.state.index + 1,
            });
        }

    }

    handleSelect(e){
        this.setState({selected: e.target.value.substring(e.target.selectionStart, e.target.selectionEnd)});
    }

    handleKeyDown(e){

        // disable up and down keys for now
        if(e.key === 'ArrowUp' || e.key == 'ArrowDown'){
            e.preventDefault();
            // TODO - add scroll through commands
        }else if(e.key === 'ArrowLeft'){

            // TODO make so can't scroll left past prompt
            
            console.error("TODO");

        }

        // TODO - make one liner
        var keys = this.state.keyArray;
        keys[e.key] = 1;
        this.setState({keyArray: keys});
    }

    handleKeyUp(e){
        var keys = this.state.keyArray;
        keys[e.key] = 0;
        this.setState({keyArray: keys});
    }

    handleClick(e){
        this.boxRef.current.selectionStart = this.boxRef.current.selectionEnd = this.state.index;

        // TODO - make less janky

    }


    // TODO - var vs let
    // TODO  - make so user can't highlight ?

    render(){
        return(
            <div className="box">
                <textarea 
                    autoFocus={true}
                    ref={this.boxRef}
                    unselectable="on"
                    value={this.state.text} 
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKeyDown} 
                    onKeyUp={this.handleKeyUp}
                    onSelect={this.handleSelect}
                    onClick={this.handleClick}
                />
            </div>
        );
    }
}