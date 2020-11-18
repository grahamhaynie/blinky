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
        this.onMouseDown = this.onMouseDown.bind(this);
        this.boxRef = React.createRef();

        let prompt = getPrompt();
        this.state = {
            text: prompt,
            keyArray: [],
            changeTrigger: false,
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
                changeTrigger: false,
                index: newText.length,
            });
        }else if(this.state.keyArray['Backspace'] === 1){ 
            
            // disable highlight select and delete, and deletion of anything before prompt
            if(this.state.lineIndex - 1 >= 0){
                this.setState({
                    text: e.target.value,
                    lineIndex: this.state.lineIndex - 1,
                    changeTrigger: false,
                    index: this.state.index - 1,
                });
            }
        }

        else if(this.state.changeTrigger){
            this.setState({
                text: e.target.value,
                lineIndex: this.state.lineIndex + 1,
                changeTrigger: false,
                index: this.state.index + 1,
            });
        }

        var keys = this.state.keyArray;
        Object.keys(keys).map((key) => {keys[key] = 0;});
        this.setState({keyArray: keys});

    }

    handleKeyDown(e){

        // TODO - make one liner
        var keys = this.state.keyArray;
        keys[e.key] = 1;
        this.setState({keyArray: keys});


        // disable up and down keys for now
        if(e.key === 'ArrowUp' || e.key == 'ArrowDown'){
            e.preventDefault();
            // TODO - add scroll through commands
            
        }else if(e.key === 'ArrowLeft'){

            if (this.state.lineIndex - 1 > 0){
                this.setState({
                    lineIndex: this.state.lineIndex - 1,
                    index: this.state.index - 1,
                });
            }else{
                this.boxRef.current.selectionStart = e.target.selectionStart + 1;
            }
            //console.log(this.boxRef.current.textLength); 
        }else if(e.key === 'ArrowRight'){
            if(this.state.index + 1< this.boxRef.current.textLength){
                this.setState({
                    lineIndex: this.state.lineIndex + 1,
                    index: this.state.index + 1,
                });
            }
            
        }else{
            this.setState({
                changeTrigger: true,
                index: this.state.index + 1,
            });
        }

    }

    handleKeyUp(e){
        var keys = this.state.keyArray;
        keys[e.key] = 0;
        this.setState({keyArray: keys});
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


    // TODO - left vs right arrow keys - make so not all fucky k
    // bug: type char, backspace, then can move left 
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