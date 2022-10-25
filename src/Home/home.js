import React from "react";
import "./home.css"


class Home extends React.Component{
    constructor(props){
        super(props)
        this.returnMetrics = this.returnMetrics.bind(this)
        this.changeService = this.changeService.bind(this)
        this.setServices = this.setServices.bind(this)
        
    }

    //Setting App state to save services
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

    changeService(e){
        this.props.onServiceSelection(e.target.value)
    }

    componentDidMount(){
        this.returnMetrics()
        this.timerID = setInterval(
            () => this.returnMetrics(),
            2000
        )
        ///this.returnMetrics()
    }

    componentWillUnmount(){
        clearInterval(this.timerID)
    }
    

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

    render(){
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

