import React from "react";
import "./NewSubscription.css"
import EntityList from "../Entities/EntityList";
import { Link } from "react-router-dom";

export default class NewSubscriptionPage extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * baseurl (contains mode), service : {fiwareService, fiwareServicePath}
         */
        this.state = {
            stage : 1,
            nextOk: false,
            entlist : [],
            selectedEnts : [],
            selectedAttrs: [],
            conditionAttrs: [],
            conditionDetails: [],
            subDetails: [],
            payload: {}
        }

        this.fetchEntities = this.fetchEntities.bind(this)
        this.renderSwitch = this.renderSwitch.bind(this)
    }

    componentDidMount(){
        this.fetchEntities()
    }

    componentWillUnmount(){
        this.state = {
            stage : 1,
            nextOk: false,
            entlist : [],
            selectedEnts : [],
            selectedAttrs: [],
            conditionAttrs: [],
            conditionDetails: [],
            subDetails: [],
            payload: {}
        }
    }

    async fetchEntities(){
        try{
            const url = "http://" + this.props.baseurl + "entities/"
            const headers =  {
                method: 'GET',
                headers: {
                    'Fiware-Service': this.props.service.fiwareService,
                    'Fiware-ServicePath' : this.props.service.fiwareServicePath,
                }
            }
            const data = await fetch(url, headers)
            const items = await data.json()
            
            this.setState({entlist : items})
        } catch (err){
            console.log(err)
        }
    }

    renderSwitch(stage) {
        switch(stage) {
            case 1:
                return <NewSub1 
                            entlist = {this.state.entlist}
                            selectedEnts = {this.state.selectedEnts}
                        />;
            case 2:
                return <NewSub1 />;
            case 3:
                return <NewSub1 />;
            case 4:
                return <NewSub1 />;

            default:
                return null;
        }
      }

    render(){
        const entlist = this.state.entlist
        const stage = this.state.stage
        if (entlist.lenght < 1){
            return(<h1>No entities available at {this.props.baseurl + this.props.service.fiwareService + this.props.service.fiwareServicePath}</h1>)
        }
        
        const pageBody = this.renderSwitch(stage)
        return(
            <div className="newSubPage">
                {pageBody}
                <PageFooter stage={this.state.stage} nextOk={this.state.nextOk}/>
            </div>
        )
        
        //return(<button onClick={this.openPage}>Click</button>)
    }
}



class NewSub1 extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * entlist
         * selectentlist
         * setList (function) ?
         * 
         */
    }

    render(){
        const entlist = this.props.entlist
        const selectentlist = this.props.selectentlist

        return(
            <div className="newSubPage1">
                <div>
                    <EntityListHeader title={"Entities"}/>
                    <EntityList entlist = {entlist} />
                </div>
                <div>
                <EntityListHeader title={"Subscribed"}/>
                    <EntityList entlist = {selectentlist} />
                </div>
                
            </div>
        )
    }

}




class PageFooter extends React.Component{
    constructor(props){
        super(props)
        /**Props:
         * incrementStage (function) -> next_btn
         * decrementStage (function) -> prev_btn
         * stage
         * nextOk
         */
        this.state = {
            nextOk : false
        }
    }

    /**TODO: Implement logic for button management
     * Stage 1 -> previous button brings back to Subs
     * Each stage -> Next button become able only if "page is validated"
     *      Stage 1 -> At least one entity is set
     *      Stage 2 -> None
     *      Stage 3 -> Check some required info to add 
     *      Stage 4 -> Create JSON payload and make it modifiable. If JSON Parsning, so next
     * State 4 -> Next button now transforms into "Subscribe and sends the entity."
     */

    render(){
        const btnNext = <button disabled={ this.state.nextOk? true:false} className={this.state.nextOk? "activebtn": "disabledbtn"}>Next {">"}</button>
        const btnPrev = <button className="activebtn">{"<"} Previous</button>
        const btnGoBack = <Link to="/subscriptions" style={{margin: 'auto'}}> <button className="activebtn">{"<"} Back to list</button></Link>
        const btnSubscribe = <button disabled={ this.state.nextOk? true:false} className={this.state.nextOk? "activebtn": "disabledbtn"}>{"<"} Previous</button>
        
        return(
            <div className="newSubFooter">
                {this.props.stage == 1? btnGoBack : btnPrev}
                {this.props.stage == 4? btnSubscribe : btnNext}
            </div>
        )
    }
}


class EntityListHeader extends React.Component{
    constructor(props){
        super(props)
        /** Props:
         * title
         */
    }

    render(){
        return(
            <div>
                <h2>{this.props.title}</h2>
            </div>
            
        )
    }
}

