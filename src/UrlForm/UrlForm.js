import React from "react"
import "./UrlForm.css"
import { Link } from "react-router-dom"

class UrlForm extends React.Component{
constructor(props){
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
}

handleChange(e){
    this.props.handleURLChange(e)
}

handleSubmit(e){
    //e.preventDefault()
    if (e.type === "keyup"){
    if (e.key === "Enter"){
        this.props.handleURLSubmit(e)
    }
    } else if (e.type === "click"){
    this.props.handleURLSubmit(e)
    }
}

render(){
    const modes = this.props.modes
    const listModes = modes.map((mode) =>
        <option key={mode} value={mode}> {mode}</option>
    )
    const btn_active = <Link to="/"><button className="connectButton" onClick={this.handleSubmit} >Connect!</button></Link>
    const btn_inactive = <button className="loadingButton" disabled={true}>Connecting...</button>
    return(
    <div className="urlForm">
        <div className="urlFields">
            <p>http://</p>
            <input className="inputAreas" name="brokerurl" id="urlinput" type="text" placeholder="Orion Context Broker IP" value={this.props.broker} onChange={this.handleChange} onKeyUp={this.handleSubmit}/>
            <select className="inputAreas" name="mode" value={this.props.mode} onChange={this.handleChange}>
                {listModes}
            </select> 
        </div>
        <div className="btnFields">
            {this.props.btn_disabled ? btn_inactive : btn_active}
        </div>
        
    </div>
    )
}
}

export default UrlForm