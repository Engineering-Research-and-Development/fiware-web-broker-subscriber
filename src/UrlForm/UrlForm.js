import React from "react"
import "./UrlForm.css"
import { Link } from "react-router-dom"

class UrlForm extends React.Component {

    /**
     * This component renders a form to fill with CB url and version.
     * The connect button allow the connection to CB. It is enabled when no connection is occurring.
     * 
     * @param {string} broker  Broker URL
     * @param {string} mode Mode to choose among modes, currently selected mode
     * @param {*string} modes [/v2/ , /ngsi-ld/v1]. Array of modes to select
     * @param {boolean} btn_disabled Boolean that controls connect button usability
     * @param {Function} handleURLChange Method to update both broker URL and its mode (version)
     * @param {Function} handleURLSubmit Method to submit the form and connect to the Context Broker
     */
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    /**
     * Delegates URL and mode changes to parent component
     */
    handleChange(e) {
        this.props.handleURLChange(e)
    }

    /**
     * Activates both on Enter click and Mouse click
     * Delegates broker connection to parent component
     */
    handleSubmit(e) {
        if (e.type === "keyup"){
            if (e.key === "Enter"){
                this.props.handleURLSubmit(e)
            }
        } 
        else if (e.type === "click"){
            this.props.handleURLSubmit(e)
        }
    }

    /**
     * Return the form to fill.
     * The form contains a field for URL and a select list of version to check
     * Finally, a button that is active only if any connection to CB is occurring.
     * 
     * @returns {JSX.Element} 
     */
    render() {
        const modes = this.props.modes
        const listModes = modes.map((mode) =>
            <option key={mode} value={mode}> {mode}</option>
        )
        const btn_active = <Link to="/"><button className="connectButton" onClick={this.handleSubmit} >Connect!</button></Link>
        const btn_inactive = <button className="loadingButton" disabled={true}>Connecting...</button>
        
        return (
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