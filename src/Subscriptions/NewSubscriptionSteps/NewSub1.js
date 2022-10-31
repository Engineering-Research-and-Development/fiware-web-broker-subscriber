import React from "react"
import DragList from "../../DragItems/DragList";
import { ListSearchBar } from "../../Reusable Components/ListSearchBar";
import "./NewSub1.css"


export default class NewSub1 extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * entlist
         * selectedEnts
         * setList (function) ?
         * handleDragStart
         * handleDragEnd
         * handleDragEnter
         */
        this.state = {
            searched : "",
            search_modes : ['Name', 'Type'],
            search_mode : 'Name'
        }
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.filterEntities = this.filterEntities.bind(this)
    }

    handleSearchChange(e){
        const name = e.target.name
        const value = e.target.value
        this.setState({
            [name] : value
        })
    }

    filterEntities(list){
        const mode = this.state.search_mode

        if (mode=="Name") return list.filter(item => item.id.toLowerCase().includes(this.state.searched.toLowerCase()))
        if (mode=="Type") return list.filter(item => item.type.toLowerCase().includes(this.state.searched.toLowerCase()))
    }

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