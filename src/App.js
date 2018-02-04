import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {AccordionExclusive} from "./Accordion";
import {Game} from "./TicTacToe";
import AccordionExampleStyled from "./Accordion";

/**
 * Randomly generate a number. Then this will change the input text.
 * @type {number}
 */
const math = Math.random() * 100

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                {
                    math > 50 ?
                        <p className="App-intro">
                            To get started, edit <code>src/App.js</code> and save to reload.
                        </p>
                        :
                        <p className="App-intro">
                            You won't start from anywhere, you'll have to lean the code yourself. Goodluck.
                        </p>
                }

                <AccordionExclusive/>

                <AccordionExampleStyled/>

                <Game/>

                <div id="world"></div>


            </div>
        );
    }
}

export default App;
