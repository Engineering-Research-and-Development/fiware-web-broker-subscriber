import React from "react";
import { ItemListHeader } from "../Reusable Components/ItemsListHeader";
import "./SubscriptionList.css"

export default class SubscriptionList extends React.Component{

    /**
     * 
     * @param {*Object} sublist list of subscription objects
     * @param {Function} handleSelectedSubscriptionChange Function that delegates storage of currently selected subscription
     * 
     * This component builds a list of subscriptions
     */
    constructor(props){
        super(props)
  
       this.state = {
            search_modes: ['description', 'entity name'],
            search_mode: 'entity name',
            searched: ""
       }
       this.handleBtnClick = this.handleBtnClick.bind(this)
       this.filterSubs = this.filterSubs.bind(this)
       this.handleSearchChange = this.handleSearchChange.bind(this)
       
    }


    /**
     * 
     * @param {string} id subscription id
     * Function that delegates storage of currently selected subscription
     */
    handleBtnClick(id){
        this.props.handleSelectedSubscriptionChange(id)
    }

    /**
     * 
     * @returns {*Objects}
     * Function that implements filtering logic for the subscription list.
     * It returns the original list if no subs are present.
     * It returns a filtered list of subs if the search criteria are met
     */
    filterSubs(){
        const subs = this.props.sublist
        const searched = this.state.searched
        const mode = this.state.search_mode
        if(!subs) return subs
        if (subs.length <= 0) return subs
        if (mode === "entity name") return subs.filter(function (sub) {

            const entities = sub.subject.entities.filter(ent => ent.id.toLowerCase().includes(searched.toLowerCase()))
            return entities.length > 0 ? true : false
        })

        if (mode === "description") return subs.filter(sub => sub.description.toLowerCase().includes(searched.toLowerCase()))
        
    }

    /**
     * 
     * @param {Event} e onClick event that triggers subscription selection
     * Implement storage of both search mode and searched item in component's state 
     */
    handleSearchChange(e){
        const name = e.target.name
        const value = e.target.value
        this.setState({[name] : value})
    }

    /**
     * 
     * @returns {JSX.Element}
     * This function renders the list of subscriptions made of multiple
     * "SubBody" components and a Header with searchbar + add button
     */
    render(){
        let subs = this.filterSubs()
        const search_modes = this.state.search_modes
        const search_mode = this.state.search_mode
        const searched = this.state.searched
        //TODO Improve this null
        if (!subs) return null
        
        return(
            <div className="subTable">
                <ItemListHeader 
                    search_mode = {search_mode}
                    search_modes = {search_modes}
                    searched = {searched}
                    handleSearchChange = {this.handleSearchChange}
                    withSearchbarButton = {"/subscriptions/new"}
                    withSearchbar = {true}
                />
                <div className="subList">
                    {this.props.sublist.length > 1 ? <SubBody subs={subs} handleSubSelection={this.handleBtnClick}/> : <h2>No Subscriptions Available for this service</h2> }
                </div>
            </div>
        )
    }

}



class SubBody extends React.Component{
    /**
     * 
     * @param {*Object} subs subscription list from list component
     * @param {Function} handleSubSelection function that delegates selected sub storage to parent component SubscriptionList 
     */

    constructor(props){
        super(props)
        this.handleClickBtn = this.handleClickBtn.bind(this)
    }

    /**
     * 
     * @param {string} id subscription id
     * @param {Event} e onClick event that triggers the function
     * Delegates sub storage to parent
     */
    handleClickBtn(id, e){
        this.props.handleSubSelection(id)
    }

    /**
     * 
     * @returns {JSX.Element}
     * This component renders a row of the subscription ID
     */
    render(){
        const subs = this.props.subs
        
        const listItems = subs.map(sub =>  
            <li className="listItem" key ={sub.id}>
                <div className="listItem infoArea">
                    <h5 >{sub.subject.entities.length > 1 ? sub.subject.entities[0].id+"+..." : sub.subject.entities[0].id}</h5>
                    <h6>{sub.description}</h6>
                </div>
                <div className="listItem divButton">
                    <button className="mybtn" onClick={(e) => this.handleClickBtn(sub.id, e)}> Inspect </button> 
                </div>
            </li>
            )
        return listItems
   
    }
    
    
}

