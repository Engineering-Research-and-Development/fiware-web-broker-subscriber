import React from "react";
import "./DragItem.css"

export default class DragItem extends React.Component{

    constructor(props){
        super(props)
        /**Props:
         * ent
         * entIdx
         * grpIdx
         * handleDragStart
         * handleDragEnd
         * handleDragEnter
         * visMode = {horizontal vertical}
         * modifiable = {true false}
         * handleSelection
         * selected
         */
        this.state = {
            dragging: false
        }

        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDragEnter = this.handleDragEnter.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.decideClass = this.decideClass.bind(this)
    }

    handleSelection(e, name){
        if (!this.props.handleSelection) return
        this.props.handleSelection(e, name)
    }

    handleDragStart(e, params){
        if (!this.props.handleDragStart) return
        this.props.handleDragStart(e, params)
        setTimeout(() =>{
            this.setState({dragging:true})
        }, 0)
    }

    handleDragEnd(e, params){
        if (!this.props.handleDragEnd) return
        //this.props.handleDragStart(e, params)
        this.setState({dragging:false})
        this.props.handleDragEnd(e, params)
    }

    handleDragEnter(e, params){
        if (!this.props.handleDragEnter) return
  
        if (this.state.dragging) return
        this.props.handleDragEnter(e, params)
    }

    decideClass(){
        let className = `drag-elem ${this.props.visMode}`
        if(this.state.dragging) return className + " dragging"
        if(this.props.selected == this.props.ent.id) return className + " selected"
        return className
    }

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
            </div>
        )
    }

}