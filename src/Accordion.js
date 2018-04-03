import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import _ from 'lodash';
import faker from 'faker';
import MenuExampleSecondaryPointing from "./Menu";

export default class AccordionExampleStyled extends Component {
    state = {activeIndex: 0}

    handleClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({activeIndex: newIndex})
    }

    render() {
        const {activeIndex} = this.state
        const style = {width: "75vw", margin: "auto", marginTop: "50px", marginBottom: "50px"}

        return (
            <div style={style}>
                <MenuExampleSecondaryPointing/>
                <Accordion styled fluid exclusive={false}>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        <Icon name='dropdown'/>
                        What is a dog?
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <p>
                            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be
                            found as a
                            {' '}welcome guest in many households across the world.
                        </p>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                        <Icon name='dropdown'/>
                        What kinds of dogs are there?
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <p>
                            There are many breeds of dogs. Each breed varies in size and temperament. Owners often
                            select a breed of
                            {' '}dog that they find to be compatible with their own lifestyle and desires from a
                            companion.
                        </p>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        <Icon name='dropdown'/>
                        How do you acquire a dog?
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <p>
                            Three common ways for a prospective owner to acquire a dog is from pet shops, private
                            owners, or shelters.
                        </p>
                        <p>
                            A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner
                            allows you to
                            {' '}assess the pedigree and upbringing of your dog before choosing to take it home. Lastly,
                            finding your
                            {' '}dog from a shelter, helps give a good home to a dog who may not find one so readily.
                        </p>
                    </Accordion.Content>
                </Accordion>
            </div>
        )
    }
}

const panels = _.times(3, () => ({
    title: faker.lorem.sentence(),
    content: <div>{faker.lorem.paragraphs()}</div>,
}))

export const AccordionExclusive = () => (
    <Accordion defaultActiveIndex={[]} panels={panels} styled exclusive={false} fluid/>
)