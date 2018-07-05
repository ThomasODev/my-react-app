import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.css'
import {AccordionExclusive} from "./Accordion";
import {Game} from "./TicTacToe";
import AccordionExampleStyled from "./Accordion";
import {MultipleCheckboxField} from "./MultipleCheckboxField";
import {Button, DatePicker} from "antd";
import PersonList from "./Axios";

/**
 * Randomly generate a number. Then this will change the input text.
 * @type {number}
 */
const math = Math.floor(Math.random() * 10000)

const makeName = (number) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < number; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

    class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>

                <MultipleCheckboxField/>

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

                <PersonList/>

                <AccordionExampleStyled/>

                <Game/>

                <DatePicker/>

                <div id="world"></div>


            </div>
        );
    }
}

export default App;
