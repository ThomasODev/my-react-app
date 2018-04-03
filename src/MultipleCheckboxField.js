import React from 'react';
import {Checkbox} from "semantic-ui-react";

export class MultipleCheckboxField extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isOneChecked: true,
            isTwoChecked: true,
        }
    }

    isChecked() {

        return (
            this.setState()
        )
    }

    render() {

        const {isOneChecked, isTwoChecked} = this.state

        const dist = ['toto', 'tata']


        return (
            dist.map(e => <Checkbox
                    onClick={this.isChecked()}
                    label={e}
                    checked={isOneChecked}
                />
            )
        )
    }

}