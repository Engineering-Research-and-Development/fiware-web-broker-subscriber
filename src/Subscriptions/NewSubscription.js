import React, { useRef } from "react";
import "./NewSubscription.css"
import NewSub1 from "./NewSubscriptionSteps/NewSub1";
import { Link } from "react-router-dom";
import NewSub2 from "./NewSubscriptionSteps/NewSub2";

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
            attrlist: [],
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
        this.handleDragEnterEnts = this.handleDragEnterEnts.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.setAttrList = this.setAttrList.bind(this)
    }

    
    handleDragStart(e, params) {
        //console.log('Drag Starting', params)
        //console.log(e.target)
        this.setState({elementDragging:params})
    }

    async handleDragEnterEnts(e, params){
        const dragging = this.state.elementDragging
        //console.log(params)

        let newList = []
        let newName = ""
        let oldList = []
        let oldName = ""

        if (params.grpIdx == 0){
            newList = [... this.state.entlist]
            newName = "entlist"
            if (dragging.grpIdx == 0){
                oldList = newList
                oldName = newName
            } else if (dragging.grpIdx == 1){
                oldList = [... this.state.selectedEnts]
                oldName = "selectedEnts"
            } 
        } else if (params.grpIdx == 1){
            newList = [... this.state.selectedEnts]
            newName = "selectedEnts"
            if (dragging.grpIdx == 0){
                oldList = [... this.state.entlist]
                oldName = "entlist"
            } else if (dragging.grpIdx == 1){
                oldList = newList
                oldName = newName
            } 
        }
        /* if (!this.state[newName].includes(this.state[oldName][dragging.entIdx])){} */
        newList.splice(params.entIdx, 0, oldList.splice(dragging.entIdx, 1)[0])
        
        this.setState(
            {
                [newName] : newList,
                elementDragging : params,
                [oldName] : oldList,
                
            }
        )

        this.evaluateNext()
      
    }

    handleDragEnd(e, params){
        this.setState({elementDragging:{}})
    }

    setAttrList(){
        const entlist = this.state.selectedEnts
        const attrlist = entlist.map((ent) => {
            const entAttrs = Object.keys(ent).map((key) => {
                if (key == 'id' || key == 'type') return 
                const attr = {id: key, type : ent[key].type, value: ent[key].value, uniqueid:ent.id+key}
                return attr
            })
            return entAttrs
        }).flat(1).filter(elem => elem !== undefined )
        this.setState({attrlist:attrlist})
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
                if (entlist.length < 1){
                    this.setState({nextOk : false})
                    return
                }
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
                            handleDragEnter = {this.handleDragEnterEnts}
                            handleDragEnd = {this.handleDragEnd}
                        />;
            case 2:
                
                return <NewSub2
                            attrlist = {this.state.attrlist}
                            selectedAttrs = {this.state.selectedAttrs}
                            conditionAttrs = {this.state.conditionAttrs}
                            handleDragStart = {this.handleDragStart}
                            handleDragEnd = {this.handleDragEnd}
                        />;
            case 3:
                return <NewSub1 />;
            case 4:
                return <NewSub1 />;

            default:
                return null;
        }
      }
    
    componentDidUpdate(prevProps, prevState){
        if (this.state.selectedEnts !== prevState.selectedEnts){
            this.evaluateNext()
            this.setAttrList()
        }
    }

    async componentDidMount(){
        await this.fetchEntities()
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






