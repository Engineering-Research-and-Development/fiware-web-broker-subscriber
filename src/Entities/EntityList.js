import React from "react";
import Entity from "./Entity";
import "./EntityList.css"

export default class EntityList extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        if (!this.props.entlist) return (

            <div className="drag-box">
                {null}
            </div>
           
        )
        
        const elems = this.props.entlist.map(ent => 
                <Entity key={ent.id} ent={ent} />
            )
        return(

            <div className="drag-box">
                {elems}
            </div>
        )
    }
}