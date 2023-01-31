import React from "react";
import { ItemListHeader } from "../Reusable Components/ItemsListHeader";
import "./DragList.css"
import DragItem from "./DragItem";

export default class DragList extends React.Component{
    /**
     * 
     * @param {int} grpIdx group index related to this list
     * @param {*Object} itemList List of all items 
     * @param {*Object} filterList? List of pre-filtered items from a searchbar
     * @param {string} placeholder? Placeholder for empty lists
     * @param {string} visMode Visualization mode for list: horizontal / vertical
     * @param {boolean} modifiableChildren Boolean to set an edit cog inside children of list
     * @param {* string} search_modes? List of of selectable modes
     * @param {Object} selected? Selected entity
     * @param {Function} handleDragStart?
     * @param {Function} handleDragEnd?
     * @param {Function} handleDragEnter?
     * @param {Function} handleClick?  TODO: DOCUMENT THIS ONE -> Click on cog?
     * @param {Function} handleSelection? Function that triggers when an item is clicked
     * 
     * HEADER PARAMETERS
     * @param {string} title Title to set in the List Header
     * @param {string} searched? String containing the searched element
     * @param {string} search_mode? Search mode (i.e: type, name, etc...)
     * @param {Function} handleSearchChange? Function to handle Searchbar input change
     * 
     * Reusable complex component that contains a list of draggable elements with different functionalities.
     * It is possible to:
     * Dynamically set both an horizontal or vertical view mode
     * Set the possibility to modify some item attributes
     * Set a sublist of filtered items to show instead of the whole list, using a searchbar
     * Set the possibility to select an Item from the whole list
     */
    constructor(props){
        super(props)
        this.myHandleDragEnter = this.myHandleDragEnter.bind(this)
    }

    /**
     * 
     * @param {React.DragEvent} e dragEnter event
     * @param {int, int} params groupIndex and itemIndex = 0
     * @returns null
     * If it has a handleDragEnter property, then call it and delegate dragEnter to parent component
     * Otherwise, do nothing
     */
    myHandleDragEnter(e, params){
        if (!this.props.handleDragEnter) return
        this.props.handleDragEnter(e, params)
    }
    
    /**
     * 
     * @returns {JSX.Element}
     * Returns the list element. It renders:
     * A list Header with searchbar
     */
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
        
        /**
         * Return an empty list with a placeholder if itemlist for that list is not present or if it contains less than 1 element
         * This empty box contains a custom DragEnter that allow the first element placing
         */                 
        if (!this.props.itemList || this.props.itemList.length < 1) return (
            <div className={`drag-tab ${this.props.visMode}`}>
                {grpIdx == 0 ? header : <ItemListHeader title={this.props.title}/>}
                <div className={`drag-box ${this.props.visMode}`} onDragEnter={(e) => this.myHandleDragEnter(e, {grpIdx, entIdx: 0})}>
                    <h3 style={{color:"gray"}}>{this.props.placeholder}</h3>
                </div>
            </div>
        )
        
        const filterList = this.props.filterList

        /**
         * If some filter is applied and the item is not in the filter, then maps the item to null, otherwise return the item
         * If no filter is applied, search on item list
         */
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
        
        // If items in itemList are more than 1, return a normal list of elements
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

