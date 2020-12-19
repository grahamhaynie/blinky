import React from 'react';
import '../css/box.css'


function getPrompt(){
    let newDate = new Date()
    let hours = newDate.getHours();
    let mins = newDate.getMinutes();
    let secs = newDate.getSeconds();

    return `${hours<10?`0${hours}`:`${hours}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`} > `
}

function getHistory(props){
    let ret = ""
    for(var i = 0; i < props.history.length; i ++){
        ret = ret + (i + 1) + ' - ' + props.history[i] + (i == props.history.length - 1 ? '' : '\n');
    }
    return ret
}

function parseCommand(props){
    switch(props.command){
        case 'help':
            return [true, 'sample output']
        case 'history':
            return [true, getHistory({history: props.history})]
        default:
            return [false, '']
    }
}

export default class BoxForm extends React.Component {
    constructor(props){
        super(props);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.boxRef = React.createRef();

        let prompt = getPrompt();
        this.state = {
            text: prompt,
            keyArray: [],
            changeTrigger: false,
            selected: "",
            index: prompt.length,
            commands: [],
            commandHistory: 0,
            currentCommand: "",
        };
    }

    handleTextChange(e) {
        if(this.state.keyArray['Backspace'] === 1){ 
            if(this.boxRef.current.value[this.boxRef.current.selectionStart - 1] !== '>'){
                this.setState({
                    text: e.target.value,
                    changeTrigger: false,
                    index: this.state.index - 1,
                });
            }
        }
        else if(this.state.changeTrigger){
            this.setState({
                text: e.target.value,
                changeTrigger: false,
                index: this.state.index + 1,
            });
        }

        var keys = this.state.keyArray;
        Object.keys(keys).map((key) => {return keys[key] = 0;});
        this.setState({keyArray: keys});
    }

    handleKeyDown(e){

        var keys = this.state.keyArray;
        keys[e.key] = 1;
        this.setState({keyArray: keys});

        if(e.key === 'Enter'){
            e.preventDefault();
            var command = (this.state.text.substring(this.state.text.lastIndexOf('>') + 1, this.boxRef.current.value.length)).trim();

            const newCommands = this.state.commands.concat(command);
            
            let p = parseCommand({command: command, history: this.state.commands});
            var newText
            if( p[0] ){
                newText = this.state.text + '\n' + p[1] + '\n' + getPrompt();
            }else{
                newText = this.state.text + '\n' + getPrompt();
            }

            this.setState({
                text: newText,
                changeTrigger: false,
                index: newText.length,
                commands: newCommands,
                commandHistory: newCommands.length, 
            });
        }
        // for now disable ctrl + keys
        else if(e.ctrlKey === true){
            e.preventDefault();
        }
        // allow cycle through commands
        else if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
            e.preventDefault();

            if (e.key === 'ArrowUp'){
                if(this.state.commandHistory - 1 >= 0){
                    // track typed command so can return to when scrolling through history 
                    var cur = this.state.currentCommand;
                    if( this.state.commandHistory - 1 === this.state.commands.length - 1){
                        cur = this.state.text.substring(this.state.text.lastIndexOf('>') + 1, this.boxRef.current.value.length);
                    }
                    
                    const newText = this.state.text.substring(0, this.state.text.lastIndexOf('>') + 1) + ' ' + this.state.commands[this.state.commandHistory - 1];

                    this.setState({
                        commandHistory: this.state.commandHistory - 1,
                        currentCommand: cur,
                        text: newText,
                    });
                }
            }else if(e.key === 'ArrowDown'){
                if(this.state.commandHistory + 1 <= this.state.commands.length - 1){
                    const newText = this.state.text.substring(0, this.state.text.lastIndexOf('>') + 1) + ' ' + this.state.commands[this.state.commandHistory + 1];
                    
                    this.setState({
                        commandHistory: this.state.commandHistory + 1,
                        text: newText,
                    });

                }else if (this.state.commandHistory + 1 === this.state.commands.length){
                    const newText = this.state.text.substring(0, this.state.text.lastIndexOf('>') + 1) + this.state.currentCommand;
                    
                    this.setState({
                        commandHistory: this.state.commands.length,
                        text: newText,
                    });
                }
            }
        }else if(e.key === 'ArrowLeft'){
            if (this.boxRef.current.value[this.boxRef.current.selectionStart - 1] === '>'){
                this.boxRef.current.selectionStart = this.boxRef.current.selectionEnd = e.target.selectionStart + 1;
            }else{
                this.setState({
                    index: this.state.index - 1,
                });
            }
        }else if(e.key === 'ArrowRight'){
            if(this.state.index + 1 < this.boxRef.current.textLength){
                this.setState({
                    index: this.state.index + 1,
                });
            }
            
        }else{
            this.setState({
                changeTrigger: true,
                commandHistory: this.state.commands.length,
            });
        }

    }

    handleKeyUp(e){
        const newKyes = {...this.state.keys, key: 0}
        this.setState({keyArray: newKyes});
    }

    // disable user clicking anywhere or drag selecting
    onMouseDown(e){
        e.preventDefault();
        this.boxRef.current.selectionStart = this.boxRef.current.selectionEnd = this.boxRef.current.textLength;
        this.boxRef.current.focus();
    }

    componentDidMount(){
        this.boxRef.current.selectionStart = getPrompt().length + 1;
    }

    // TODO - var vs let

    render(){
        return(
            <div className="box">
                <textarea 
                    ref={this.boxRef}
                    unselectable="on"
                    value={this.state.text} 
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKeyDown} 
                    onKeyUp={this.handleKeyUp}
                    onMouseDown={this.onMouseDown}
                />
            </div>
        );
    }
}