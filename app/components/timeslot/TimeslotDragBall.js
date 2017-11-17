import React, { Component } from 'react';
import {splitHeight} from './TimeslotDrag';

const styles = {
    dragBall: {
        borderRadius: '100%',
        background: 'black',
        position: 'absolute',
        left: '50%',
    }
};

export class TimeslotDragBall extends Component {
    constructor(props) {
        super(props);
        Object.assign(styles.dragBall, {width: splitHeight * 0.2});
        Object.assign(styles.dragBall, {height: splitHeight * 0.2});
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.state = {origY: 0}
    }

    handleDragStart(event) {
        this.setState({origY: event.clientY});
    }
    handleDrag(event) {
        if (event.clientY === 0) return;
        this.props.onChange(event.clientY - this.state.origY);
        this.setState({origY: event.clientY});
    }

    handleTouchStart(event) {
        this.setState({origY: event.targetTouches.item(0).clientY});
    }
    handleTouchMove(event) {
        if (event.targetTouches.item(0).clientY === 0) return;
        this.props.onChange(parseInt(event.targetTouches.item(0).clientY - this.state.origY));
        this.setState({origY: event.targetTouches.item(0).clientY});
    }

    render() {
        var position = {};
        if (this.props.position == "bottom") position = {bottom: -splitHeight * 0.1};
        else if (this.props.position == "top") position = {top: -splitHeight * 0.1};
        return (
            <div draggable="true" 
                    onDrag={this.handleDrag} 
                    onDragStart={this.handleDragStart}
                    onDragEnd={this.props.onManipulationEnd}
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove} 
                    onTouchEnd={this.props.onManipulationEnd}
                    style={Object.assign(position, styles.dragBall)}>
            </div>
        );    
    }
}