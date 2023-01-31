import React from "react"
import "./ItemsListHeader.css"
import ListSearchBar from "./ListSearchBar"


export class ItemListHeader extends React.Component{
    /** Props:
     * @param {string} title Title of the List
     * @param {string} searched String containing the searched element
     * @param {string} search_mode Search mode (i.e: type, name, etc...)
     * @param {* string} search_modes List of of selectable modes
     * @param {boolean} withSearchbar? Parameter to set a searchbar inside the component
     * @param {boolean} withSearchbarButton? Parameter to set, deciding if the searchbar has a button
     * @param {Function} handleSearchChange Function that delegates search input change
     */
    constructor(props){
        super(props)
    }

    /**
     * 
     * @returns {JSX.Element}
     * This function returns a List Header with optional searchbar.
     */
    render(){
        const title = this.props.title
        const searchBar = <ListSearchBar 
                                searched = {this.props.searched}
                                search_mode = {this.props.search_mode}
                                search_modes = {this.props.search_modes}
                                handleSearchChange = {this.props.handleSearchChange}
                                withNewButton = {this.props.withSearchbarButton}
                            />

        return(
            <div className="listHeader">
                {title? <h2>{this.props.title}</h2> : null}
                {this.props.withSearchbar ? searchBar : null}
            </div>
            
        )
    }
}


