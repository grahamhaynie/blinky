import React from 'react';
import '../css/box.css'


function getPrompt(){
    let newDate = new Date()
    let hours = newDate.getHours();
    let mins = newDate.getMinutes();
    let secs = newDate.getSeconds();

    return `${hours<10?`0${hours}`:`${hours}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`} > `
}



function parseCommand(props){
    let trimmed = props.command.trim();
    console.log('trimmed: ' + trimmed);

    switch(trimmed){
        case 'help':
            return [true, 'sample output']
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
            var command = this.state.text.substring(this.state.text.lastIndexOf('>') + 1, this.boxRef.current.value.length);

            const newCommands = this.state.commands.concat(command);
            
            // TODO - display based on command
            let p = parseCommand({command: command});
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
                currentCommand: "",
            });
        }
        // for now disable ctrl + keys
        // also disable up and down keys for now
        else if(e.ctrlKey === true || e.key === 'ArrowUp' || e.key === 'ArrowDown'){
            e.preventDefault();

            if (e.key === 'ArrowUp'){

                if(this.state.commandHistory - 1 >= 0){
                    //console.log(this.state.commands[this.state.commandHistory - 1]);
                    this.setState({
                        commandHistory: this.state.commandHistory - 1
                    });
                }else{
                    //console.log(this.state.commands[this.state.commandHistory]);
                }
            }else if(e.key === 'ArrowDown'){
                
                if(this.state.commandHistory + 1 <= this.state.commands.length - 1){
                    //console.log(this.state.commands[this.state.commandHistory + 1]);
                    this.setState({commandHistory: this.state.commandHistory + 1});
                }else if(this.state.commandHistory + 1 == this.state.commands.length){
                    //console.log("current");
                    this.setState({commandHistory: this.state.commands.length - 1});
                }else{
                   // console.log(this.state.commands[this.state.commandHistory]);
                }
            }

            // TODO - add scroll through commands
            
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