import React from "react";
import { Link } from "react-router-dom";
import "./ListSearchBar.css"


export default class ListSearchBarWithButton extends React.Component{
    /** Props:
     * search_modes
     * search_mode
     * searched
     * handleSearchChange
     */
    constructor(props){
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(e){
        this.props.handleSearchChange(e)
    }


    render(){
        const searched = this.props.searched
        const selected = this.props.search_mode
        const modes = this.props.search_modes

        const listModes = modes.map(mode => <option key={mode} value={mode}>{mode}</option>)
        
        return(
            <div className="searchBar">
                <input className="inputAreas" name="searched" type="text" placeholder={`Insert a ${selected} ...`} value={searched} onChange={this.handleInputChange}/>
                <select className="inputAreas" name="search_mode" value={selected} onChange={this.handleInputChange}>
                    {listModes}
                </select> 
                <Link className="linkStyle" to="/subscriptions/new"><button className="addBtn">New</button></Link>
            </div>
            
            
        )
    }

}


export class ListSearchBar extends React.Component{
    /** Props:
     * search_modes
     * search_mode
     * searched
     * handleSearchChange
     */
    constructor(props){
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(e){
        this.props.handleSearchChange(e)
    }


    render(){
        const searched = this.props.searched
        const selected = this.props.search_mode
        const modes = this.props.search_modes
        const listModes = modes.map(mode => <option key={mode} value={mode}>{mode}</option>)

        //console.log(selected, searched)

        return(
            <div className="searchBar">
                <input className="inputAreas" name="searched" type="text" placeholder={`Insert a ${selected} ...`} value={searched} onChange={this.handleInputChange}/>
                <select className="inputAreas" name="search_mode" value={selected} onChange={this.handleInputChange}>
                    {listModes}
                </select> 
            </div>
            
            
        )
    }

}