import React from "react";
import Entity from "./Entity";
import "./EntityList.css"

export default class EntityList extends React.Component{
    constructor(props){
        // props: title, data, handleDragStart, handleDragEnd, handleDragEnter
        super(props)
        this.myHandleDragEnter = this.myHandleDragEnter.bind(this)
    }

    myHandleDragEnter(e, params){
        //e.preventDefault()
        //if (this.state.dragging) return
        //this.props.handleDragEnter(e, params)
        
    }
    
    render(){
        const grpIdx = this.props.grpIdx

        if (!this.props.entlist) return (
            <div>
                <EntityListHeader title={this.props.title}/>
                <div className="drag-box" onDragEnter={(e) => this.myHandleDragEnter(e, {grpIdx})}>
                    {null}
                </div>
            </div>
        )
       
        const elems = this.props.entlist.map((ent, entIdx) => 
                
                <Entity 
                    key={ent.id} 
                    ent={ent} 
                    grpIdx={grpIdx}
                    entIdx={entIdx}
                    handleDragStart = {this.props.handleDragStart}
                    handleDragEnter = {this.props.handleDragEnter}
                    handleDragEnd = {this.props.handleDragEnd}
                />
            )

        return(
            <div>
                <EntityListHeader title={this.props.title}/>
                <div className="drag-box" onDragEnter={(e) => this.myHandleDragEnter(e, {grpIdx})}>
                    {elems}
                </div>
            </div>
            
        )
    }
}



export class EntityListHeader extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * title
         */
    }

    render(){
        return(
            <div>
                <h2>{this.props.title}</h2>
            </div>
            
        )
    }
}