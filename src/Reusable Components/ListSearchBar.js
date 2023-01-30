import React from "react";
import { Link } from "react-router-dom";
import "./ListSearchBar.css"


export default class ListSearchBar extends React.Component{
    /** Props:
     * @param {boolean} withNewButton Parameter to set, deciding if the searchbar has a button
     * @param {string} searched String containing the searched element
     * @param {string} search_mode Search mode (i.e: type, name, etc...)
     * @param {* string} search_modes List of of selectable modes
     * @param {Function} handleSearchChange Function that delegates search input change
     */
    constructor(props){
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    /**
     * 
     * @param {Event} e onChange event triggered by textbar change
     * Function that delegates to parent component the state saving of searched element
     */
    handleInputChange(e){
        this.props.handleSearchChange(e)
    }

    /**
     * 
     * @returns {JSX.Element} A searchbar with an optional "+" button
     */
    render() {
        const searched = this.props.searched
        const selected = this.props.search_mode
        const modes = this.props.search_modes

        const searchBtn = <Link className="linkStyle" to={this.props.withNewButton}><button className="addBtn">New</button></Link>
        const listModes = modes.map(mode => <option key={mode} value={mode}>{mode}</option>)

        //console.log(selected, searched)

        return(
            <div className="searchBar">
                <input type="search" className="inputAreas" name="searched"  placeholder={`Insert a ${selected} ...`} value={searched} onChange={this.handleInputChange}/>
                <select className="inputAreas" name="search_mode" value={selected} onChange={this.handleInputChange}>
                    {listModes}
                </select>
                {this.props.withNewButton ? searchBtn : null} 
            </div>
            
            
        )
    }

}