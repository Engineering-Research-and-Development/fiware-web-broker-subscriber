import React from "react";
import "./NewSub3.css"

export default class NewSub3 extends React.Component{
    constructor(props){
        super(props)
        /** Props
         * subDetails
         * handleDetailsChange
         */
        this.handleDetailsChange = this.handleDetailsChange.bind(this)
    }

    handleDetailsChange(e){

        this.props.handleDetailsChange(e)
    }


    render(){
        const dets = this.props.subDetails
        console.log(dets)

        
        return(
            <div className="subPage3">
                <SectionElement title="General Info"/>
                <SubElement type="text" extendedName="URL" handleDetailsChange={this.handleDetailsChange} propertyName={"url"} propertyVal={dets.url}/>
                <SubElement type="date" extendedName="Expiration Date" handleDetailsChange={this.handleDetailsChange} propertyName={"expires"} propertyVal={dets.expires}/>
            </div>
        )
    }
}


function SubElement(props){
    //handleDetailsChange, propertyName, propertyVal, extendedName, inputType
    return(
        <div className="subElement">
            <p>{props.extendedName}</p>
            <input type={props.type} onChange={props.handleDetailsChange} name={props.propertyName} value={props.propertyVal}></input>
            <h4>{props.propertyVal}</h4>
        </div>
    )
}

function SectionElement(props){
    //sectionTitle
    return(
        <h1>{props.title}</h1>
    )
}