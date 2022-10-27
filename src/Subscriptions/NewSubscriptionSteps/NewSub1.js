import React from "react"
import EntityList from "../../Entities/EntityList";
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
            search_modes : ['Entity Name'],
            search_mode : 'Entity Name'
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

        if (mode=="Entity Name") return list.filter(item => item.id.includes(this.state.searched))
    }

    render(){
        const entlist = this.filterEntities(this.props.entlist)
        const selectentlist = this.props.selectedEnts

        const data = [
            {title : "Entities", items: entlist},
            {title: "Subscribed", items:selectentlist}
        ]

        const elems = data.map((grp, grpIdx) => 
            <EntityList 
                key={grp.title} 
                entlist = {grp.items} 
                title={grp.title} 
                grpIdx={grpIdx}
                handleDragStart = {this.props.handleDragStart}
                handleDragEnter = {this.props.handleDragEnter}
                handleDragEnd = {this.props.handleDragEnd}
                searched = {this.state.searched}
                search_mode = {this.state.search_mode}
                search_modes = {this.state.search_modes}
                handleSearchChange = {this.handleSearchChange}
            />)

        return(
            <div className="newSubPage1">
                
                {elems}
            </div>
        )
    }

}