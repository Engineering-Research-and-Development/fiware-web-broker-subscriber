import React from "react"
import "./ItemsListHeader.css"
import { ListSearchBar } from "./ListSearchBar"

export class ItemsListHeader extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * title
         */
    }

    render(){
        return(
            <div className="listHeader">
                <h2>{this.props.title}</h2>
            </div>
            
        )
    }
}


export class ItemListHeaderWithSearchBar extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * title
         * searched
         * search_mode
         * search_modes
         * handleSearchChange
         */
    }

    render(){
        return(
            <div className="listHeader">
                <h2>{this.props.title}</h2>
                <ListSearchBar 
                    searched = {this.props.searched}
                    search_mode = {this.props.search_mode}
                    search_modes = {this.props.search_modes}
                    handleSearchChange = {this.props.handleSearchChange}
                />
            </div>
            
        )
    }
}


