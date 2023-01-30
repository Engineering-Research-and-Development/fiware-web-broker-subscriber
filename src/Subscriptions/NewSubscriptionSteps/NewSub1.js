import React from "react"
import DragList from "../../DragItems/DragList";
import { ListSearchBar } from "../../Reusable Components/ListSearchBar";
import "./NewSub1.css"


export default class NewSub1 extends React.Component{
    /**
     * Props:
     * @param {*Object} entlist List of availabale entities from the current service
     * @param {*Object} selectedEnts List of selected entities from the entlist
     * @param {Function} handleDragStart?
     * @param {Function} handleDragEnd?
     * @param {Function} handleDragEnter?
     */
    constructor(props){
        super(props)
        this.state = {
            searched : "",
            search_modes : ['Name', 'Type'],
            search_mode : 'Name'
        }
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.filterEntities = this.filterEntities.bind(this)
    }

    /**
     * 
     * @param {Event} e onChange event
     * Function that change both stored search mode and searched item from searchbar
     */
    handleSearchChange(e){
        const name = e.target.name
        const value = e.target.value
        this.setState({
            [name] : value
        })
    }

    /**
     * 
     * @param {*Object} list input list of items
     * @returns {*Object} output filtered list from search criteria
     * Make lowecase both id and type, comparing with the selected one (case-insensitive seach)
     */
    filterEntities(list){
        const mode = this.state.search_mode

        if (mode=="Name") return list.filter(item => item.id.toLowerCase().includes(this.state.searched.toLowerCase()))
        if (mode=="Type") return list.filter(item => item.type.toLowerCase().includes(this.state.searched.toLowerCase()))
    }

    /**
     * 
     * @returns {JSX.Element}
     * Build a dictionary of items (data).
     * Then iterate on that dictionary to build a list of elements for each item in dictionary
     * based on its content
     */
    render(){
        const entlist = this.props.entlist
        const entlistfiltered = this.filterEntities(this.props.entlist)
        const selectentlist = this.props.selectedEnts

        const data = [
            {title : "Entities", items: entlist},
            {title: "Subscribed", items:selectentlist}
        ]

        const elems = data.map((grp, grpIdx) => 
            <DragList 
                key={grp.title} 
                itemList = {grp.items} 
                filterList = {!grpIdx ? entlistfiltered : null }
                title={grp.title} 
                grpIdx={grpIdx}
                handleDragStart = {this.props.handleDragStart}
                handleDragEnter = {this.props.handleDragEnter}
                handleDragEnd = {this.props.handleDragEnd}
                visMode = "vertical"
                modifiableChildren = {false}
                searched = {this.state.searched}
                search_mode = {this.state.search_mode}
                search_modes = {this.state.search_modes}
                handleSearchChange = {this.handleSearchChange}
                handleSelection = {null}
            />)

        return(
            <div className="newSubPage1">
                {elems}
            </div>
        )
    }

}