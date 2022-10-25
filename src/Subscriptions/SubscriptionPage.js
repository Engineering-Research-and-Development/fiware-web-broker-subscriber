import React from "react";
import SubscriptionDetail from "./SubscriptionDetail";
import SubscriptionList from "./SubscriptionList";
import "./SubscriptionPage.css";


export default class SubscriptionPage extends React.Component{

    constructor(props){
        super(props)
        /** Props:
         * baseurl
         * service
         * onServiceSelection
         */
        this.state = {
            sublist : [],
            selected: null,
            
        }

        this.fetchSubs = this.fetchSubs.bind(this)
        this.handleSelectedSubscriptionChange = this.handleSelectedSubscriptionChange.bind(this)
        this.refreshAll = this.refreshAll.bind(this)
    }


    componentDidMount(){
        this.fetchSubs()
        this.refreshTimer = setInterval(() => this.refreshAll(), 2000)
    }

    componentWillUnmount(){
        this.setState({
            searched: "",
            search_mode: 'description',
        })
        clearInterval(this.refreshTimer)
    }

    handleSelectedSubscriptionChange(id){
        const subs = this.state.sublist
        const selected = subs.filter( sub=> sub.id === id)[0]
        this.setState({
            selected : selected
        }) 
        console.log(selected)

    }

    refreshAll(){
        this.fetchSubs()
        const subs = this.state.sublist
        const prev_selected = this.state.selected
        if (prev_selected){
            const selected_refresh = subs.filter( sub=> sub.id === prev_selected.id)[0]
            this.setState({
                selected : selected_refresh
        }) 
        }
    }

    async fetchSubs(){
        try{
            const url = "http://" + this.props.baseurl + "subscriptions/"
            const headers =  {
                method: 'GET',
                headers: {
                    'Fiware-Service': this.props.service.fiwareService,
                    'Fiware-ServicePath' : this.props.service.fiwareServicePath,
                }
            }
            const data = await fetch(url, headers)
            const items = await data.json()
            
            this.setState({sublist : items})
        } catch (err){
            console.log(err)
        }
    }


    render(){
        const subs = this.state.sublist
        const selected = this.state.selected
        return(
            <div className="subPage">
                <SubscriptionList sublist={subs} handleSelectedSubscriptionChange={this.handleSelectedSubscriptionChange} />
                <SubscriptionDetail sub={selected}/>
            </div>
        )
    }


}