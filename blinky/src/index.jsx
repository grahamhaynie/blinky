import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import BoxForm from './components/blinkyBox.jsx'



class BlinkApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(        
            <div class="main">
                <BoxForm />
            </div>
        );
    }
}

ReactDOM.render(<BlinkApp />, document.getElementById("root"));