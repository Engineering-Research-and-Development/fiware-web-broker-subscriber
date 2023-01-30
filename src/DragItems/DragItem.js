import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "./DragItem.css"

export default class DragItem extends React.Component{

    /**
     * 
     * @param {Object} ent Item itself
     * @param {int} grpIdx group index related to the item's list
     * @param {int} entIdx index related to this item in the list
     * @param {Object} selected? Selected entity
     * @param {string} visMode Visualization mode for item: horizontal / vertical
     * @param {boolean} modifiable Boolean to set the item modifiable
     * @param {Function} handleDragStart?
     * @param {Function} handleDragEnd?
     * @param {Function} handleDragEnter?
     * @param {Function} handleSelection? Function that triggers when an item is clicked
     */
    constructor(props){
        super(props)
        this.state = {
            dragging: false
        }

        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDragEnter = this.handleDragEnter.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.decideClass = this.decideClass.bind(this)
        this.handleIconClick = this.handleIconClick.bind(this)
    }

    /**
     * Function to implement: modify attribute conditions
     */
    handleIconClick(){
        alert("Feature not implemented")
    }

    /**
     * 
     * @param {Event} e onClick event that trigger selection 
     * @param {string} name Name of the selected item
     * @returns null if there is no handleSelection property
     * 
     * Function that call parent's handleSelection if property is set
     */
    handleSelection(e, name){
        if (!this.props.handleSelection) return
        this.props.handleSelection(e, name)
    }

    /**
     * 
     * @param {DragEvent} e onDragStart event that triggers
     * @param {int, int} params group index and item index of the dragged item
     * @returns null if no handleDragStart property is set
     * Function that manage a dragStart event. The timeout is set for graphical purposes.
     * Sets also the current dragged item to "dragging"
     */
    handleDragStart(e, params){
        if (!this.props.handleDragStart) return
        this.props.handleDragStart(e, params)
        setTimeout(() =>{
            this.setState({dragging:true})
        }, 0)
    }

    /**
     * 
     * @param {DragEvent} e onDragEnd event that triggers
     * @param {int, int} params group index and item index of the dragged item
     * @returns null if no handleDragEnd property is set
     * Function that manage a dragEnd event. 
     * Resets also the current "dragging" property
     */
    handleDragEnd(e, params){
        if (!this.props.handleDragEnd) return
        //this.props.handleDragStart(e, params)
        this.setState({dragging:false})
        this.props.handleDragEnd(e, params)
    }


    /**
     * 
     * @param {DragEvent} e onDragEnter event that triggers
     * @param {int, int} params group index and item index of the dragged item
     * @returns null if no handleDragEnter property is set or if the item is not dragged
     * Function that manage a dragEnter event
     */
    handleDragEnter(e, params){
        if (!this.props.handleDragEnter) return
  
        if (this.state.dragging) return
        this.props.handleDragEnter(e, params)
    }

    /**
     * 
     * @returns {string} name of the style class to show
     * Function to build class Name from drag-elem, by adding dragging and selected if
     * proper conditions are met
     */
    decideClass(){
        let className = `drag-elem ${this.props.visMode}`
        if(this.state.dragging) return className + " dragging"
        if(this.props.selected == this.props.ent.id) return className + " selected"
        return className
    }

    /**
     * 
     * @returns {JSX.Element}
     * Renders a box with the item of a DragList, setting the style dynamically
     * If item is modifiable, then adds also a clickable icon
     */
    render(){
        const ent = this.props.ent
        if (!ent) return null

        const grpIdx = this.props.grpIdx
        const entIdx = this.props.entIdx
        const className = this.decideClass()

        return(
            <div 
                draggable={this.props.handleDragStart ? true : false}
                selectable={this.props.handleSelection? "true" : "false"}
                /* className= {this.state.dragging ? `drag-elem ${this.props.visMode} dragging` : `drag-elem ${this.props.visMode}`} */
                className = {className}
                onDragStart={(e) => this.handleDragStart(e, {grpIdx, entIdx})}
                onDragEnd={(e) => this.handleDragEnd(e, {grpIdx, entIdx})}
                onDragEnter={(e) => this.handleDragEnter(e, {grpIdx, entIdx})}
                onClick= {(e) =>  this.handleSelection(e, ent.id)}
                
            >
                <h3 onDragEnter={null}>{ent.id}</h3>
                <h4 onDragEnter={null}>{ent.type}</h4>
                {this.props.modifiable ? <FontAwesomeIcon onClick={this.handleIconClick} icon={faGear} className="highlight"/> : null}
            </div>
        )
    }

}