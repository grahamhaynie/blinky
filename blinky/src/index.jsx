import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import ButtonAppBar from './components/buttonBar.jsx'

import BoxForm from './components/blinkyBox.jsx'


class BlinkApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(        
            <div className="main">
                <ButtonAppBar />
                
                <BoxForm />
            </div>
        );
    }
}

ReactDOM.render(<BlinkApp />, document.getElementById("root"));