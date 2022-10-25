import React from "react"
import EntityList, { EntityListHeader } from "../../Entities/EntityList";
import "./NewSub1.css"


export default class NewSub1 extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * entlist
         * selectentlist
         * setList (function) ?
         * 
         */
    }

    render(){
        const entlist = this.props.entlist
        const selectentlist = this.props.selectentlist

        return(
            <div className="newSubPage1">
                <div>
                    <EntityListHeader title={"Entities"}/>
                    <EntityList entlist = {entlist} />
                </div>
                <div>
                <EntityListHeader title={"Subscribed"}/>
                    <EntityList entlist = {selectentlist} />
                </div>
                
            </div>
        )
    }

}