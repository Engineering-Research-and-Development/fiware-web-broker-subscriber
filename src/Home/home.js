import React from "react";
import "./home.css"
import CBService from "../Models/CBService.ts";

class Home extends React.Component {
    /**
     * Component that shows all available services in CB and their stats
     * 
     * @param {string} cburl
     * @param {string} version
     * @param {* CBService} services
     * @param {CBService} selected_service
     * @param {Function} onServiceDetection // Function to delegate state saving of detected services to parent component (App)
     * @param {Function} onServiceSelection // Function to delegate service selection to parent component (App)
     */
    constructor(props){
        super(props)
        this.returnMetrics = this.returnMetrics.bind(this)
        this.changeService = this.changeService.bind(this)
        this.setServices = this.setServices.bind(this)
        
    }

    /**
     * 
     * @param {Object} servs // response from fetch API
     * 
     * Function to iterate the API response and search for services in Context Broker
     * It sets the "CBService" object with fiwareService, fiwareServicePath and service stats
     * Flattens the list, then delegates to parent component (App) the list storing
     */
    setServices(servs){
        const servlist = Object.keys(servs.services).map(function (key){
            const serv = servs.services[key]
            const subservlist = Object.keys(serv.subservs).map(function(key2){
                const subserv = serv.subservs[key2]
                return {
                    fiwareService : key === "default-service" ? '' : `${key}`,
                    fiwareServicePath : key2 === "root-subserv" ? '/' : `/${key2}`,
                    stats:subserv}
            })
            return subservlist
        })
        this.props.onServiceDetection(servlist.flat(1))
    }

    /**
     * 
     * @param {Event} e // onChange event to select from a radiobutton
     * Function that delegates to parent component (App) currently selected service storing
     */
    changeService(e){
        this.props.onServiceSelection(e.target.value)
    }

    /**
     * Function to update every 2 seconds service stats, calling the
     * ReturnMetrics function
     */
    componentDidMount(){
        this.returnMetrics()
        this.timerID = setInterval(
            () => this.returnMetrics(),
            2000
        )
    }

    /**
     * Function that clear the timer
     */
    componentWillUnmount(){
        clearInterval(this.timerID)
    }
    
    /**
     * Function that fetch all service data from the context broker.
     * It is called every 2 second in this component. If data are received
     * then it builds the service list and calls for updates
     */
    async returnMetrics(){
        const url = `http://${this.props.cburl}/admin/metrics`
        let services
        try{
            const response = await fetch(url)
            if (response.ok){
                services = await response.json()
                this.setServices(services)
            }
        } catch (err){
            alert("Impossible to receive data")
            console.log(err)
        }
    }

    /**
     * 
     * @returns {JSX.Element}
     * Returns a table with service names to select.
     * When a service is selected, then it is possible to see its stats in another table
     */
    render() {
        const completeurl = `${this.props.cburl}${this.props.version}`
        const listServices = this.props.services.map((serv, idx) => 
            <tr key={serv.fiwareService+serv.fiwareServicePath}>
                <td><h5>"{serv.fiwareService}"</h5></td>
                <td><h5>{serv.fiwareServicePath}</h5></td>
                <td><input className="buttons" type="radio" value={idx} name="selectService" checked={idx == this.props.selected_service ? true : false} onChange={this.changeService}/></td>
            </tr>
        )
        const toDisplay = this.props.services[this.props.selected_service]
        
        return(
            <div>
                <h1>Welcome to {completeurl}</h1>
                <hr></hr>
                <div className="serviceBody">
                    <table className="listService">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>ServicePath</th>
                                <th>Selected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listServices}
                        </tbody>
                    </table>
                    {toDisplay ? <ServiceStats service={toDisplay} /> : null}
                </div>
            </div>
        )
    }

}

/**
 * 
 * @param {CBService} service // Selected service
 * @returns {JSX.Element} // Table of service stats
 */
function ServiceStats(props){
    const servstats = props.service.stats
    const statList = Object.keys(servstats).map(function(key){
        return (
            <div className="statsRow"  key = {key}>
                <h5>{key}: </h5>
                <label>{servstats[key]}</label>
            </div>
            
        )
    })
    return(
        <div className="stats">
            <h3>Displaying statistics for: ({props.service.fiwareService}{props.service.fiwareServicePath}):</h3>
            {statList}
        </div>
    )
}

export default Home

