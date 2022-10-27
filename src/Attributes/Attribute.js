import React from "react";
import "./Attribute.css"



export default class Attribute extends React.Component{

    constructor(props){
        super(props)
        /**Props:
         * ent
         * ent_idx
         * grp_idx
         * handleDragStart
         * handleDragEnter
         * handleDragEnd
         */
        this.state = {
            dragging: false
        }

        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDragEnter = this.handleDragEnter.bind(this)
    }

    handleDragStart(e, params){
        this.props.handleDragStart(e, params)
        setTimeout(() =>{
            this.setState({dragging:true})
        }, 0)
    }

    handleDragEnd(e, params){
        //this.props.handleDragStart(e, params)
        this.setState({dragging:false})
        this.props.handleDragEnd(e, params)
    }

    handleDragEnter(e, params){
        
        if (this.state.dragging) return
        this.props.handleDragEnter(e, params)
    }

    render(){
        const ent = this.props.ent
        if (!ent) return null

        const grpIdx = this.props.grpIdx
        const entIdx = this.props.entIdx

        return(
            <div 
                draggable={true} 
                className= {this.state.dragging ? "drag-elem-attr dragging" : "drag-elem-attr"}
                onDragStart={(e) => this.handleDragStart(e, {grpIdx, entIdx})}
                onDragEnd={(e) => this.handleDragEnd(e, {grpIdx, entIdx})}
                onDragEnter={(e) => this.handleDragEnter(e, {grpIdx, entIdx})}
                
            >
                <h3 onDragEnter={null}>{ent.id}</h3>
            </div>
        )
    }

}