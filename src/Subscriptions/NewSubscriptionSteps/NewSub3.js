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


        this.state = {
            attrsFormats : ["normalized", "keyValues", "values"],
            statuses : ["active", "inactive"]
        }
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
                <InputSubElement placeholder={"http://address:port/service"} type="url" extendedName="URL *" handleDetailsChange={this.handleDetailsChange} propertyName={"url"} propertyVal={dets.url}/>
                <TextareaSubElement placeholder={"Enter a Description Here. Max 1024 characters"} extendedName="Description " handleDetailsChange={this.handleDetailsChange} propertyName={"description"} propertyVal={dets.description}/>
                <InputSubElement placeholder={new Date(Date.now()).toISOString().slice(0,-5)} type="datetime-local" extendedName="Expiration Date" handleDetailsChange={this.handleDetailsChange} propertyName={"expires"} propertyVal={dets.expires? dets.expires : "Never"}/>
                <InputSubElement placeholder={"0"} type="number" extendedName="Throttling" handleDetailsChange={this.handleDetailsChange} propertyName={"throttling"} propertyVal={dets.throttling}/>
                <SelectSubElement selectOptions={this.state.attrsFormats} extendedName="Attribute Format" handleDetailsChange={this.handleDetailsChange} propertyName={"attrsFormat"} propertyVal={dets.attrsFormat}/>
                <SelectSubElement selectOptions={this.state.statuses} extendedName="Initial Status" handleDetailsChange={this.handleDetailsChange} propertyName={"status"} propertyVal={dets.status}/>
            
            </div>
        )
    }
}


function InputSubElement(props){
    //handleDetailsChange, propertyName, propertyVal, extendedName, type
    return(
        <div className="subElement">
            <p>{props.extendedName}</p>
            <input 
                placeholder={props.placeholder} 
                type={props.type} 
                onChange={props.handleDetailsChange} 
                name={props.propertyName} 
                value={props.propertyVal}
            />
            <h4>{props.propertyVal}</h4>
        </div>
    )
}

function TextareaSubElement(props){
    //handleDetailsChange, propertyName, propertyVal, extendedName
    return(
        <div className="subElement">
            <p>{props.extendedName}</p>
            <textarea 
                rows = "3"
                cols = "30"
                maxLength = "1024"
                placeholder={props.placeholder}
                type={props.type} 
                onChange={props.handleDetailsChange} 
                name={props.propertyName} 
                value={props.propertyVal} 
            />
            <h4>{props.propertyVal}</h4>
        </div>
    )
}

function SelectSubElement(props){
    //handleDetailsChange, selectOptions, propertyName, propertyVal, extendedName
    const elems = props.selectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
    return(
        <div className="subElement">
            <p>{props.extendedName}</p>
            <select
                placeholder={""}
                type={props.type} 
                onChange={props.handleDetailsChange} 
                name={props.propertyName} 
                value={props.propertyVal? props.propertyVal : ""}>
                {elems}
            </select>
            <h4>{props.propertyVal}</h4>
        </div>
    )
}

function SectionElement(props){
    //sectionTitle
    return(
        <h2>{props.title}</h2>
    )
}