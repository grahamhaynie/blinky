import React from 'react';
import '../css/box.css'


function getDate(){
    let newDate = new Date()
    let hours = newDate.getHours();
    let mins = newDate.getMinutes();
    let secs = newDate.getSeconds();

    return `${hours<10?`0${hours}`:`${hours}`}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`
}

export default class BoxForm extends React.Component {
    constructor(props){
        super(props);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            text: getDate() + ' > ',
            keyArray: [],
            selectTrigger: false,
            selected: "",
            index: 0,
        };
    }

    handleTextChange(e) {
        if(this.state.keyArray['Enter'] === 1){
            var command = this.state.text.slice(this.state.text.lastIndexOf('>') + 1);
            console.log('command: ' + command);

            var newText = e.target.value + getDate() + ' > ';
            this.setState({
                text: newText,
                index: 0,
            });
        }else if(this.state.keyArray['Backspace'] === 1){
            // disable highlight select and delete, and deletion of anything before prompt
            if(this.state.selected === "" && this.state.index - 1 >= 0){
                this.setState({
                    text: e.target.value,
                    index: this.state.index - 1,
                });
            }
        }else {
            this.setState({
                text: e.target.value,
                index: this.state.index + 1,
            });
        }

        // TODO - make so user click goes to end, don't allow to click anywhere and enter text

    }

    handleSelect(e){
        this.setState({selected: e.target.value.substring(e.target.selectionStart, e.target.selectionEnd)});
    }

    // TODO - make one liner
    handleKeyDown(e){
        var keys = this.state.keyArray;
        keys[e.key] = 1;
        this.setState({keyArray: keys});
    }

    handleKeyUp(e){
        var keys = this.state.keyArray;
        keys[e.key] = 0;
        this.setState({keyArray: keys});
    }

    render(){
        return(
            <div className="box">
                <textarea 

                    // TODO disable highlight 


                    autoFocus={true}
                    unselectable="on"
                    value={this.state.text} 
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKeyDown} 
                    onKeyUp={this.handleKeyUp}
                    onSelect={this.handleSelect}
                />
            </div>
        );
    }
}