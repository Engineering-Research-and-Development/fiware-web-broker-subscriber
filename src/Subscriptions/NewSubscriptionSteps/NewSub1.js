import React from "react"
import EntityList from "../../Entities/EntityList";
import "./NewSub1.css"


export default class NewSub1 extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * entlist
         * selectentlist
         * setList (function) ?
         * handleDragStart
         * handleDragEnd
         * handleDragEnter
         */
    }

    render(){
        const entlist = this.props.entlist
        const selectentlist = this.props.selectentlist

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
            />)

        return(
            <div className="newSubPage1">
                {elems}
            </div>
        )
    }

}