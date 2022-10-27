import React from "react";
import "./AttrList.css"
import { ItemsListHeader } from "../Reusable Components/ItemsListHeader";
import Attribute from "./Attribute";

export default class AttrList extends React.Component{
    constructor(props){
        // props: key, entlist, title, handleDragStart, handleDragEnd, handleDragEnter
        super(props)
        this.myHandleDragEnter = this.myHandleDragEnter.bind(this)
    }

    myHandleDragEnter(e, params){

        this.props.handleDragEnter(e, params)
        
    }
    
    render(){
        const grpIdx = this.props.grpIdx
        if (!this.props.entlist || this.props.entlist.length < 1) return (
            <div>
                <ItemsListHeader title={this.props.title}/>
                <div className="drag-box-horizontal" onDragEnter={(e) => this.myHandleDragEnter(e, {grpIdx, entIdx: 0})}>
                    
                </div>
            </div>
        )
       
        const elems = this.props.entlist.map((ent, entIdx) => 
                <Attribute 
                    key={ent.uniqueid} 
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
                <ItemsListHeader title={this.props.title}/>
                <div className="drag-box-horizontal" >
                    {elems}
                </div>
            </div>
            
        )
    }
}

