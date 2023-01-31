import React from "react";
import SubscriptionDetail from "./SubscriptionDetail";
import SubscriptionList from "./SubscriptionList";
import "./SubscriptionPage.css";
import CBService from "../Models/CBService.ts";


export default class SubscriptionPage extends React.Component{

    /**
     * 
     * @param {string} baseurl The complete root URL of the context broker, with version
     * @param {CBService} service The selected service from Home component
     */
    constructor(props){
        super(props)
    
        this.state = {
            sublist : [],
            selected: null,
            
        }

        this.fetchSubs = this.fetchSubs.bind(this)
        this.handleSelectedSubscriptionChange = this.handleSelectedSubscriptionChange.bind(this)
        this.refreshAll = this.refreshAll.bind(this)
        this.deleteSub = this.deleteSub.bind(this)
    }


    /**
     * 
     * @param {string} id subscription id 
     * @param {Event} e onClick event that triggers the deletion
     * Function that call the deleteById API from CB to delete a subscription
     */
    async deleteSub(id, e){
        const url = "http://" + this.props.baseurl + "subscriptions/" + id
    
        try{
            const headers =  {
                method: 'DELETE',
                headers: {
                    'Fiware-Service': this.props.service.fiwareService,
                    'Fiware-ServicePath' : this.props.service.fiwareServicePath, 
                }
            }
            const data = await fetch(url, headers)
            
            if (!data.ok) throw data.status + data.statusText

            const sublist = this.state.sublist
            const newSubList = sublist.filter(sub => sub.id !== id)
            this.setState(
                {
                    sublist : newSubList,
                    selected : null
                }
            )
            alert("Subscription Successfully Deleted")

        } catch (err){
            alert("Something went wrong during subscription deletion:", err)
        }
    }

    /**
     * Function that refresh subscriptions every 2 seconds, calling
     * the refreshAll() function
     */
    componentDidMount(){
        this.fetchSubs()
        this.refreshTimer = setInterval(() => this.refreshAll(), 2000)
    }

    /**
     * Function to clear the timer set on the componentDidMount function
     * when component is de-rendered
     */
    componentWillUnmount(){
        this.setState({
            searched: "",
            search_mode: 'description',
        })
        clearInterval(this.refreshTimer)
    }

    /**
     * 
     * @param {string} id subscription id
     * This function saves the currently selected subscription
     * to show further details
     */
    handleSelectedSubscriptionChange(id){
        const subs = this.state.sublist
        const selected = subs.filter( sub=> sub.id === id)[0]
        this.setState({
            selected : selected
        }) 
    }

    /**
     * Restores the currently selected entity status to show
     * changes in its statistics
     */
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

    /**
     * Function that calls the getAll api for subscriptions from CB
     * in the currently selected service
     */
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


    /**
     * 
     * @returns {JSX.Element} 
     * Renders the whole subscription page with a table of subscriptions with a searchbar
     * and an optional field containing statistics for a selected subscription.
     * It is also possible, from this field, to delete the subscription.
     * TODO: add a method also to modify current subscriptions
     */
    render(){
        const subs = this.state.sublist
        const selected = this.state.selected
        const mode = this.props.baseurl.includes('/v2/') ? "v2" : "ld"
        return(
            <div className="subPage">
                <SubscriptionList sublist={subs} handleSelectedSubscriptionChange={this.handleSelectedSubscriptionChange} />
                <SubscriptionDetail sub={selected} mode={mode} deleteSub = {this.deleteSub}/>
            </div>
        )
    }


}