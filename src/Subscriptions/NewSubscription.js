import React from "react";
import "./NewSubscription.css"
import {json, Link, Navigate} from "react-router-dom";
import CBService from "../Models/CBService";
import NewSub1 from "./NewSubscriptionSteps/NewSub1";
import NewSub2 from "./NewSubscriptionSteps/NewSub2";
import NewSub3 from "./NewSubscriptionSteps/NewSub3";
import NewSub4 from "./NewSubscriptionSteps/NewSub4";

export default class NewSubscriptionPage extends React.Component{
    /**
     * 
     * @param {string} baseurl Root URL of the context broker comprehending mode
     * @param {CBService} service Currently selected CB service
     * 
     * Component to create a subscription using a simple drag 'n drop interface
     * This complex component renders 4 pages in different stages as its body.
     * Each stage allow the building of the payload of the new subscription
     * - Stage 1: Selection of entities
     * - Stage 2: Selection of attributes and conditions
     * - Stage 3: Subscription settings
     * - Stage 4: Payload checking and customization, subscription creation
     */
    constructor(props){
        super(props)
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
    

    /**
     * 
     * @param {Event} e onClick event
     * Function that calls the Create Subscription API from CB
     * It dynamically builds the request structure with headers and payload
     * It has error handling in case of a bad response
     * If the subscription is correctly created, the component redirect the user to the SubscriptionPage component.
     * Otherwise, it encourages a double checking before sending the request
     */
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

            this.incrementStage()
            alert("Subscription Created")

        } catch (err){
            alert("Something went wrong during subscription:", err, "Please, double-check the subscrption payload to subscribe")
        }

    }

    /**
     * 
     * @param {Event} e onChange event that triggers this function
     * This function allow the update of the stringified payload.
     * Then evaluates the payload using the evaluateNext function before allowing
     * request submission
     */
    changeStringifiedPayload(e){
        const value = e.target.value

        this.setState({
            stringifiedPayload : value,
        }, () => this.evaluateNext())
        

    }

    /**
     * Function that takes the previous's stage (1, 2, 3) values to create
     * the request payload. It creates both a JSON payload and a
     * stringified payload for stage 4.
     * This function requires lot of formatting
     * TODO: complete function saving
     * TODO: double-check and test for correctness
     */
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

        this.setState({
            payload : payload,
            stringifiedPayload : JSON.stringify(payload, null, 1)
        })
    }


    /**
     * 
     * @param {Event} e onChange event that triggers the function
     * Function that manage piece of the "details" object by adding unexisting details
     * or updating existing ones
     */
    handleDetailsChange(e){
        const name = e.target.name
        const value = e.target.value
        const newdetails = {[name]: value}
        this.setState((prevState) => (
            {subDetails : {...prevState.subDetails, ...newdetails}}
         ), () => this.evaluateNext())

    }
    
    /**
     * 
     * @param {*} e onDragStart event that triggers the function
     * @param {int, int} params Group index and Item index of the dragged element
     * Function that saves the dragging element in the component's state
     */
    handleDragStart(e, params) {
        this.setState({elementDragging:params})
    }

    /**
     * 
     * @param {*} e onDragEnter event that triggers the function
     * @param {int, int} params Group index and Item index of the element in which the dragging element is dragged on
     * @returns 
     * This function manages the dragging logic of Stage 2 which has 3 lists of elements.
     * When an element is dragged on another element, the dragging element switches with the one that triggered
     * the dragEnter event. It is possible to drag elements from the first row which is the list of attributes.
     * In this case the element is not deleted from the row, however it is not possible to drag the same element
     * twice in the other rows.
     * 
     */
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


    /**
     * 
     * @param {*} e onDragEnter event that triggers the function
     * @param {int, int} params Group index and Item index of the element in which the dragging element is dragged on
     * @returns 
     * This function manages the dragging logic of Stage 1 which has 2 lists of elements.
     * When an element is dragged on another element, the dragging element switches with the one that triggered
     * the dragEnter event.
     * Every time a new entity joins the selected entity list, the state of the stage
     * is evaluated and the list of possible selected attributes is updated
     */
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


    /**
     * 
     * @param {Event} e onDragEnd event that triggers the function
     * @param {*} params unused parametersù
     * This function resets the dragging element to null
     */
    handleDragEnd(e, params){
        this.setState({elementDragging:null})
    }


    /**
     * This function checks for selected Entities and then builds the attribute
     * list by computing the union of all entities's attributes
     */
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

    /**
     * @returns 
     * Function to manage logic when incrementing stage.
     * If stage is greater or equal to 5, do nothing
     * If stage is 3, then it creates the request payload
     * If stage is less than 4, increment by 1 and evaluate the state
     */
    async incrementStage(){
        const stage = this.state.stage
        if (stage >= 5) return

        if (stage == 3){
            this.createPayload()
        }
        
        this.setState({
            stage : stage +1 
        }, () => this.evaluateNext())
        
    }

    
  
    /**
     * @returns 
     * Function to manage logic when decrementing stage.
     * If stage is less or equal to 1, do nothing
     * If stage is 2, then it empties the selected and condition attribute lists
     * If stage is greater than 1, decrement by 1 and evaluate the state
     */
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


    /**
     * 
     * @returns
     * Function that evaluates the state of the state to decide if it
     * is possible to proceed to the next stage. It is default to true and it's switched to false if
     * an error is detected.
     * The logic is the following:
     * - Stage 1: At least one entity is selected
     * - Stage 2: Always yes (since if no attribute is selected, then all attributes are selected)
     * - Stage 3: There must be at least one valid URL to send notifications to
     * - Stage 4: The stringified payload must be correctly converted to a valid JSON
     */
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
                // TODO Check for some other stuff
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

    /**
     * Function to get all entities from the context broker from the currently
     * selected service
     */
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

    /**
     * 
     * @param {int} stage 
     * @returns {JSX.Element}
     * This function dynamically modifies the body of the page,
     * rendering different bodies for each stage.
     */
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
    
    /**
     * 
     * @param {*Object} prevProps 
     * @param {*Object} prevState 
     * Function that, on update of "selectedEnts" state, evaluates the current
     * stage state and sets the proper Attribute list
     */
    componentDidUpdate(prevProps, prevState){
        if (this.state.selectedEnts !== prevState.selectedEnts){
            console.log("Updating")
            this.evaluateNext()
            this.setAttrList()
        }
    }

    /**
     * Function that calls the fetchEntities function
     * when component mounts
     */
    async componentDidMount(){
        await this.fetchEntities()
        this.evaluateNext()

    }

    /**
     * Function that resets the state of the component
     * to default values
     */
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

    /**
     * 
     * @returns {JSX.Element}
     * This function renders the page. It has also some logic
     * for different rendering based on the number of entities from the service
     * Moreover, redirects the user to SubscriptionPage component when the subscription is
     * correctly created in CB (stage > 4).
     * TODO: bring rendering of Navigate to RenderSwitch() function?
     * 
     */
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
    }
}




function PageFooter(props) {
    /**
     * 
     * @param {boolean} nextOk Flag to evaluate activation of next button
     * @param {int} stage Stage of the body of the NewSubscription page 
     * @param {Function} incrementStage Function from parent (NewSubscription) to increment stage
     * @param {Function} decrementStage Function from parent (NewSubscription) to decrement stage
     * 
     * This component renders the NewSubscription page footer, implementing
     * the navigation logic.
     */
    
    const btnNext = <button 
                        disabled={ props.nextOk? false:true} 
                        className={props.nextOk? "activebtn": "disabledbtn"} 
                        onClick={props.incrementStage}
                    > Next {">"}</button>
    const btnPrev = <button className="activebtn" onClick={props.decrementStage}> {"<"} Previous </button>
    const btnGoBack = <Link to="/subscriptions" style={{margin: 'auto'}}> <button className="activebtn">{"<"} Back to list</button></Link>

    const btnSubscribe = <button 
                            disabled={ props.nextOk? false:true} 
                            className={props.nextOk? "activebtn": "disabledbtn"}
                            onClick ={props.handleNewSubscription}
                        > Subscribe</button>
    
    return(
        <div className="newSubFooter">
            {props.stage == 1? btnGoBack : btnPrev}
            {props.stage == 4? btnSubscribe : btnNext}
        </div>
    )
    
}

