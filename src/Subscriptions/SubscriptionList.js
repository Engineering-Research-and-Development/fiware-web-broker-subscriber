import React from "react";
import ListSearchBarWithButton from "../Reusable Components/ListSearchBar";
import "./SubscriptionList.css"

export default class SubscriptionList extends React.Component{

    constructor(props){
        super(props)
        /* PROPS
            sublist : [],
        }
        this.handleSelectedSubscriptionChange = this.handleSelectedSubscriptionChange.bind(this)
        */
       this.state = {
            search_modes: ['description', 'entity name'],
            search_mode: 'entity name',
            searched: ""
       }
       this.handleBtnClick = this.handleBtnClick.bind(this)
       this.filterSubs = this.filterSubs.bind(this)
       this.handleSearchChange = this.handleSearchChange.bind(this)
    }



    handleBtnClick(id){
        this.props.handleSelectedSubscriptionChange(id)
    }

    filterSubs(){
        const subs = this.props.sublist
        const searched = this.state.searched
        const mode = this.state.search_mode
        if(!subs) return subs
        if (subs.length <= 0) return subs
        if (mode === "entity name") return  subs.filter(function (sub) {

            const entities = sub.subject.entities.filter(ent => ent.id.includes(searched))
            return entities.length > 0 ? true : false
        }
        )

        if (mode === "description") return subs.filter(sub => sub.description.includes(searched))
        
    }

    handleSearchChange(e){
        const name = e.target.name
        const value = e.target.value
        this.setState({[name] : value})
    }

    render(){
        //const subs = this.props.sublist
        let subs = this.filterSubs()
        //console.log(subs)
        const search_modes = this.state.search_modes
        const search_mode = this.state.search_mode
        const searched = this.state.searched
        if (!subs){
            return null
        }
        if (this.props.sublist.length < 1) return (
                <div className="subTable">
                    <div className="subHeader">
                        <ListSearchBarWithButton
                            search_modes = {search_modes}
                            search_mode = {search_mode}
                            searched = {searched}
                            handleSearchChange = {this.handleSearchChange}
                            changeService = {this.changeService}
                        />
                    </div>
                    <h2>No Subscriptions Available for this service</h2>
                </div>
                
            )
        return(
            <div className="subTable">
                <div className="subHeader">
                    <ListSearchBarWithButton
                        search_modes = {search_modes}
                        search_mode = {search_mode}
                        searched = {searched}
                        handleSearchChange = {this.handleSearchChange}
                        changeService = {this.changeService}
                    />
                    
                </div>
                <div className="subList">
                    <SubBody subs={subs} handleSubSelection={this.handleBtnClick}/>
                </div>
            </div>
        )
    }

}



class SubBody extends React.Component{

    constructor(props){
        super(props)
        /** Props:
         * subs
         * handleSubSelection
         */
        this.handleClickBtn = this.handleClickBtn.bind(this)
    }

    handleClickBtn(id, e){
        this.props.handleSubSelection(id)
    }

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

