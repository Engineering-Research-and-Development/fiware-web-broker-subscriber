import React from "react";
import "./Entity.css"

export default class Entity extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        const ent = this.props.ent

        if (!ent) return null

        return(
            <div draggable={true} className="drag-elem">
                <h3>{ent.id}</h3>
                <h4>{ent.type}</h4>
            </div>
        )
    }

}