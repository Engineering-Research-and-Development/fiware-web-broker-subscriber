import React from "react"
import "./ItemsListHeader.css"
import ListSearchBar from "./ListSearchBar"


export class ItemListHeader extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * title
         * searched
         * search_mode
         * search_modes
         * withSearchbar
         * withSearchbarButton
         * handleSearchChange
         */
    }

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


