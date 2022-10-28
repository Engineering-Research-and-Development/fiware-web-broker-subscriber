import React from "react";
import Entity from "./Entity";
import { ItemListHeader } from "../Reusable Components/ItemsListHeader";
import "./EntityList.css"

export default class EntityList extends React.Component{
    constructor(props){
        // props: key, entlist, title, handleDragStart, handleDragEnd, handleDragEnter
        // for header: searched, search_mode, search_modes, handleSearchChange
        super(props)
        this.myHandleDragEnter = this.myHandleDragEnter.bind(this)
    }

    myHandleDragEnter(e, params){
        this.props.handleDragEnter(e, params)
    }
    
    render(){
        const grpIdx = this.props.grpIdx
        const header = <ItemListHeader
                            searched = {this.props.searched}
                            search_mode = {this.props.search_mode}
                            search_modes = {this.props.search_modes}
                            withSearchbar = {true}
                            handleSearchChange = {this.props.handleSearchChange}
                            title = {this.props.title}
                        />
        

        if (!this.props.entlist || this.props.entlist.length < 1) return (
            <div className="drag-tab">
                {grpIdx == 0 ? header : <ItemListHeader title={this.props.title}/>}
                <div className="drag-box" onDragEnter={(e) => this.myHandleDragEnter(e, {grpIdx, entIdx: 0})}>
                    
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
            <div className="drag-tab">
                {grpIdx == 0 ? header : <ItemListHeader title={this.props.title}/>}
                <div className="drag-box" >
                    {elems}
                </div>
            </div>
            
        )
    }
}

