import React from "react";
import "./NewSubscription.css"
import {json, Link, Navigate} from "react-router-dom";
import NewSub1 from "./NewSubscriptionSteps/NewSub1";
import NewSub2 from "./NewSubscriptionSteps/NewSub2";
import NewSub3 from "./NewSubscriptionSteps/NewSub3";
import NewSub4 from "./NewSubscriptionSteps/NewSub4";

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
            subDetails: {},
            payload: {},
            stringifiedPayload: "",
            elementDragging: {},
            
        }

        this.fetchEntities = this.fetchEntities.bind(this)
        this.renderSwitch = this.renderSwitch.bind(this)
        this.evaluateNext = this.evaluateNext.bind(this)
        this.incrementStage = this.incrementStage.bind(this)
        this.decrementStage = this.decrementStage.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnterEnts = this.handleDragEnterEnts.bind(this)
        this.handleDragEnterAttrs = this.handleDragEnterAttrs.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.setAttrList = this.setAttrList.bind(this)
        this.handleDetailsChange = this.handleDetailsChange.bind(this)
        this.createPayload = this.createPayload.bind(this)
        this.changeStringifiedPayload = this.changeStringifiedPayload.bind(this)
        this.handleNewSubscription = this.handleNewSubscription.bind(this)
    }
    

     async handleNewSubscription(e){
        const mode = this.props.baseurl.includes("/v2/") ? "v2" : "ld"
        const contentType = mode == "v2" ? 'application/json' : 'application/ld+json'
        const body = this.state.stringifiedPayload
        console.log(body.length)

        try{
            const url = "http://" + this.props.baseurl + "subscriptions/"
            const headers =  {
                method: 'POST',
                headers: {
                    'Fiware-Service': this.props.service.fiwareService,
                    'Fiware-ServicePath' : this.props.service.fiwareServicePath,
                    'Content-Type': contentType,
                },
                body: body
            }
            const data = await fetch(url, headers)
            
            if (!data.ok)  throw data.status + data.statusText

            this.setState({stage : 5})
            alert("Subscription Created")

        } catch (err){
            alert("Something went wrong during subscription:", err, "Please, double-check the subscrption payload to subscribe")
        }

    }

    changeStringifiedPayload(e){
        const value = e.target.value

        this.setState({
            stringifiedPayload : value,
        }, () => this.evaluateNext())
        

    }

    createPayload(){
        const selectedEnts = this.state.selectedEnts
        const selectedAttrs = this.state.selectedAttrs
        const conditionAttrs = this.state.conditionAttrs
        const conditionDetails = this.state.conditionDetails
        const subDetails = this.state.subDetails
        const mode = this.props.baseurl.includes("v2") ? "v2" : "ld"
        const context = this.props.context // TODO -> IMPLEMENT

        

        //Add IDPATTERN and TYPEPATTERN -> Alternatives
        const entities = selectedEnts.map(function(ent) {
            const e = {id: ent.id, type: ent.type}
            return e
        })

        //in LD this become watchedAttributes, first level of subject
        const conditionAttrsNames = conditionAttrs ? conditionAttrs.map(attr => attr.id) : null
        //const conditionExpression = conditionDetails ? conditionDetails : null 
        // in LD -> all expressions in conditiondetails should be put out. Precisely, "q"
        // conditionExpression ->  {"q" : "string"} -> TODO: improve
        

        const condition = {
            ...(conditionAttrsNames && {attrs : conditionAttrsNames})
            // ... (conditionExpresion && {expression : conditionExpression}) TODO
        }

        const subject ={
            entities : entities,
            ...(Object.keys(conditionAttrsNames).length > 0  && mode == "v2" && {condition: condition}),
            ...(Object.keys(conditionAttrsNames).length > 0  && mode == "ld" && {watchedAttributes: conditionAttrsNames})
        }


        const attrs = selectedAttrs.map(attr => attr.id)
        const httpCustom = {
            url : subDetails.url,
            ...(subDetails.headers && {attrsFormat : subDetails.headers}),
            ...(subDetails.qs && {qs : subDetails.qs}),
            ...(subDetails.method && {method : subDetails.method}),
        }
        const endpoint = {
            uri : subDetails.url,
            accept: "application/ld+json"
        }


        const notification = {
            ...(subDetails.attrsFormat && mode == "v2" && {attrsFormat : subDetails.attrsFormat}),
            ...(subDetails.attrsFormat && mode == "ld" && {format : subDetails.attrsFormat}),
            ...(attrs.length > 0 && mode =="v2" && {attrs:attrs}),
            ...(attrs.length > 0 && mode =="ld" && {attributes:attrs}),
            ...(mode =="v2" && {httpCustom : httpCustom}),
            ...(subDetails.metadata && mode =="v2" && {metadata : subDetails.metadata}),
            ...(mode =="ld" && {endpoint : endpoint}),
            
        }
        
        const payload = {
            ...(mode == "ld" && {type: "Subscription"}),
            ...(subDetails.description  && {description : subDetails.description} ),
            ...(subDetails.expires  && {expires : subDetails.expires} ),
            ...(subDetails.status  && {status : subDetails.status} ),
            ...(subDetails.throttling  && {throttling : subDetails.throttling} ),
            ...(context && {'@context' : context}),
            subject : subject,
            notification : notification,
        }

        //console.log(JSON.stringify(payload))
        this.setState({
            payload : payload,
            stringifiedPayload : JSON.stringify(payload, null, 1)
        })



    }


    handleDetailsChange(e){
     
        const name = e.target.name
        const value = e.target.value
        const newdetails = {[name]: value}
        this.setState((prevState) => (
            {subDetails : {...prevState.subDetails, ...newdetails}}
         ), () => this.evaluateNext())

    }
    
    handleDragStart(e, params) {
        //console.log('Drag Starting', params)
        //console.log(e.target)
        this.setState({elementDragging:params})
    }

    handleDragEnterAttrs(e, params){
        const dragging = this.state.elementDragging
        //console.log(params)
        //dragging : the one dragged. Params: the one dragging is dragged on
        if (!this.state.elementDragging) return this.handleDragEnd()

        let newList = []
        let newName = ""
        let oldList = []
        let oldName = ""

        const map = {
            0 : {n: "attrlist" , l: this.state.attrlist},
            1 : {n: "selectedAttrs" , l: this.state.selectedAttrs},
            2 : {n: "conditionAttrs" , l: this.state.conditionAttrs}
        }

        newList= map[params.grpIdx].l
        newName = map[params.grpIdx].n
        oldList = map[dragging.grpIdx].l
        oldName = map[dragging.grpIdx].n
        
        try{
            
            if (params.grpIdx == dragging.grpIdx){
                newList.splice(params.entIdx, 0, oldList.splice(dragging.entIdx, 1)[0])
                this.setState({[newName] : newList, elementDragging : params, [oldName]:oldList})
                return
            }

            if (dragging.grpIdx == 0){
                const elem = this.state[oldName][dragging.entIdx]
                if (!this.state[newName].includes(elem)){
                    newList.splice(params.entIdx, 0, elem)
                    this.setState({[newName] : newList, elementDragging : params, [oldName]:oldList})
                }

            } else {
                if (params.grpIdx !==0){
                    if (!this.state[newName].includes(this.state[oldName][dragging.entIdx])){
                        newList.splice(params.entIdx, 0, oldList.splice(dragging.entIdx, 1)[0])
                        this.setState({[newName] : newList, elementDragging : params, [oldName]:oldList})
                    } 
                }  else {
                    const deleted = oldList.splice(dragging.entIdx, 1)
                    this.setState({elementDragging:null, [oldName]:oldList})
                }
            }

            
        } catch (e){
            console.log(e)
        }
        // 
       
        /* if (!this.state[newName].includes(this.state[oldName][dragging.entIdx])){} */

        
        


    }

    async handleDragEnterEnts(e, params){
        const dragging = this.state.elementDragging
        //console.log(params)

        let newList = []
        let newName = ""
        let oldList = []
        let oldName = ""

        const map = {
            0 : {n: "entlist" , l: this.state.entlist},
            1 : {n: "selectedEnts" , l: this.state.selectedEnts}
        }

        newList= map[params.grpIdx].l
        newName = map[params.grpIdx].n
        oldList = map[dragging.grpIdx].l
        oldName = map[dragging.grpIdx].n


        newList.splice(params.entIdx, 0, oldList.splice(dragging.entIdx, 1)[0])
        this.setState(
            {
                [newName] : newList,
                elementDragging : params,
                [oldName] : oldList,
                
            }
        )
        this.evaluateNext()
        this.setAttrList() 
    }



    handleDragEnd(e, params){
        this.setState({elementDragging:null})
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
        //if (stage > 4) return (<Navigate to="/subscriptions" replace/>) -> Navigation after evaluation
        //TODO: SubmitPayload evaluation. incrementStage not for Submit button.
        const stage = this.state.stage
        if (stage >= 4) return

        if (stage == 3){
            this.createPayload()
        }
        
        this.setState({
            stage : stage +1 
        }, () => this.evaluateNext())
        
    }


    async decrementStage(){
        const stage = this.state.stage
        if (stage <= 1) return 
        if (stage == 2) {
            this.setState({
                selectedAttrs : [],
                conditionAttrs : []
            })
        }
        this.setState({
            stage : stage - 1
        }, () => this.evaluateNext())
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
                const url = this.state.subDetails.url
                if (!url){
                    this.setState({nextOk : false})
                    return
                }
                break
                //Check for some other stuff
            case 4:
                try{
                    const payload = JSON.parse(this.state.stringifiedPayload)
                    this.setState({payload : payload})
                } catch (e){
                    //Parsing Error
                    this.setState({nextOk : false})
                    return
                }
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
                            selectedEnts = {this.state.selectedEnts}
                            selectedAttrs = {this.state.selectedAttrs}
                            conditionAttrs = {this.state.conditionAttrs}
                            handleDragStart = {this.handleDragStart}
                            handleDragEnd = {this.handleDragEnd}
                            handleDragEnter = {this.handleDragEnterAttrs}
                        />;
            case 3:
                return <NewSub3 
                            subDetails = {this.state.subDetails}
                            handleDetailsChange = {this.handleDetailsChange}
                        />;
            case 4:
                return <NewSub4
                            stringifiedPayload = {this.state.stringifiedPayload}
                            changeStringifiedPayload = {this.changeStringifiedPayload}
                        />;
            default:
                return null;
        }
      }
    
    componentDidUpdate(prevProps, prevState){
        if (this.state.selectedEnts !== prevState.selectedEnts){
            console.log("Updating")
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
            payload: {},
            stringifiedPayload : ""
        }
    }

    render(){
        const entlist = this.state.entlist
        const stage = this.state.stage

        if (stage > 4) return (<Navigate to="/subscriptions" replace/>)

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
                    handleNewSubscription = {this.handleNewSubscription}
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
         * this.handleNewSubscription
         * stage
         * nextOk
         * payloadOk
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

        const btnSubscribe = <button 
                                disabled={ this.props.nextOk? false:true} 
                                className={this.props.nextOk? "activebtn": "disabledbtn"}
                                onClick ={this.props.handleNewSubscription}
                            > Subscribe</button>
        
        return(
            <div className="newSubFooter">
                {this.props.stage == 1? btnGoBack : btnPrev}
                {this.props.stage == 4? btnSubscribe : btnNext}
            </div>
        )
    }
}

