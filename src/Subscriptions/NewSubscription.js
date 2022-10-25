import React, { useRef } from "react";
import "./NewSubscription.css"
import NewSub1 from "./NewSubscriptionSteps/NewSub1";
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
            payload: {},
            elementDragging: {}
        }

        this.fetchEntities = this.fetchEntities.bind(this)
        this.renderSwitch = this.renderSwitch.bind(this)
        this.evaluateNext = this.evaluateNext.bind(this)
        this.incrementStage = this.incrementStage.bind(this)
        this.decrementStage = this.decrementStage.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnter = this.handleDragEnter.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
    }

    
    handleDragStart(e, params) {
        //console.log('Drag Starting', params)
        //console.log(e.target)
        this.setState({elementDragging:params})
    }

    handleDragEnter(e, params){
        const dragging = this.state.elementDragging
        //console.log(params)
        if (dragging != params){
            console.log("Dragging", dragging, "over", params)
        }

        let newList = []
        let name = ""
        if (params.grpIdx == 0){
            newList = [... this.state.entlist]
            name = "entlist"
        } else if (params.grpIdx == 1){
            newList = [... this.state.selectedEnts]
            name = "selectedEnts"
        }
        newList.splice(params.entIdx, 0, newList.splice(dragging.entIdx, 1)[0])
        //console.log(params.entIdx, dragging.entIdx)
        //console.log(newList.splice(params.endIdx, 0, newList.splice(dragging.entIdx, 1)[0]))
        this.setState((prevState) => (
            {
                [name] : newList,
                elementDragging : params,
                ...prevState.items
            }
        ))
      
    }

    handleDragEnd(e, params){
        this.setState({elementDragging:{}})
    }

    async incrementStage(){
        const stage = this.state.stage
        await this.setState({
            stage : stage +1 
        })
        this.evaluateNext()
        
    }

    async decrementStage(){
        const stage = this.state.stage
        await this.setState({
            stage : stage - 1
        })
        this.evaluateNext()
    }

    evaluateNext(){
        const stage = this.state.stage
        switch(stage) {
            case 1:
                const entlist = this.state.selectedEnts
                if (entlist.length < 1) return
                break
            case 2:
                break
                //Always active
            case 3:
                break
                //Check for some other stuff
            case 4:
                break
                //Logic to evaluate JSON Payload.
            default:
                break
        }
        this.setState({nextOk : true})
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
                            handleDragStart = {this.handleDragStart}
                            handleDragEnter = {this.handleDragEnter}
                            handleDragEnd = {this.handleDragEnd}
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

      async componentDidMount(){
        this.fetchEntities()
        this.evaluateNext()

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
                <PageFooter
                    stage={this.state.stage}
                    nextOk={this.state.nextOk}
                    incrementStage = {this.incrementStage}
                    decrementStage = {this.decrementStage}
                />
            </div>
        )
        
        //return(<button onClick={this.openPage}>Click</button>)
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
        
    }


    render(){
        const btnNext = <button 
                            disabled={ this.props.nextOk? false:true} 
                            className={this.props.nextOk? "activebtn": "disabledbtn"} 
                            onClick={this.props.incrementStage}
                        > Next {">"}</button>
        const btnPrev = <button className="activebtn" onClick={this.props.decrementStage}> {"<"} Previous </button>
        const btnGoBack = <Link to="/subscriptions" style={{margin: 'auto'}}> <button className="activebtn">{"<"} Back to list</button></Link>
        const btnSubscribe = <button disabled={ this.props.nextOk? false:true} className={this.props.nextOk? "activebtn": "disabledbtn"}>Subscribe</button>
        
        return(
            <div className="newSubFooter">
                {this.props.stage == 1? btnGoBack : btnPrev}
                {this.props.stage == 4? btnSubscribe : btnNext}
            </div>
        )
    }
}






