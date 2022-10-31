import React from "react";
import { ItemListHeader } from "../Reusable Components/ItemsListHeader";
import "./DragList.css"
import DragItem from "./DragItem";

export default class DragList extends React.Component{
    constructor(props){
        // props: itemList, filterList, title, handleDragStart, handleDragEnd, handleDragEnter, handleClick, visMode {vertical / horizontal}, modifiableChildren {true,false}, handleSelection, selected
        // for header: searched, search_mode, search_modes, handleSearchChange
        super(props)
        this.myHandleDragEnter = this.myHandleDragEnter.bind(this)
    }

    myHandleDragEnter(e, params){
        if (!this.props.handleDragEnter) return
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
        
                        
        if (!this.props.itemList || this.props.itemList.length < 1) return (
            <div className={`drag-tab ${this.props.visMode}`}>
                {grpIdx == 0 ? header : <ItemListHeader title={this.props.title}/>}
                <div className={`drag-box ${this.props.visMode}`} onDragEnter={(e) => this.myHandleDragEnter(e, {grpIdx, entIdx: 0})}>
                    
                </div>
            </div>
        )
        
        const filterList = this.props.filterList

        const elems = this.props.itemList.map((ent, entIdx) => 
                filterList && ! filterList.includes(ent) ? null :
                <DragItem 
                    key={ent.id} 
                    ent={ent} 
                    grpIdx={grpIdx}
                    entIdx={entIdx}
                    handleDragStart = {this.props.handleDragStart}
                    handleDragEnter = {this.props.handleDragEnter}
                    handleDragEnd = {this.props.handleDragEnd}
                    visMode = {this.props.visMode}
                    modifiable = {this.props.modifiableChildren}
                    handleSelection = {this.props.handleSelection} //From Above
                    selected = {this.props.selected}
                /> 
        )
        
        return(
            <div className={`drag-tab ${this.props.visMode}`}>
                {grpIdx == 0 ? header : <ItemListHeader title={this.props.title}/>}
                <div className={`drag-box ${this.props.visMode}`}>
                    {elems}
                </div>
            </div>
            
        )
    }
}

