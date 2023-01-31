import React from "react";
import { ItemListHeader } from "../Reusable Components/ItemsListHeader";
import "./SubscriptionDetail.css"

// TODO: Expand as LD 
export default class SubscriptionDetail extends React.Component{
    /**
     * 
     * @param {Object} sub Subscription object
     * @param {string} mode version of the currently connected CB ['v2', 'ld']
     * @param {Function} deleteSub function from parent SubscriptionList that deletes an entity
     */
    constructor(props){
        super(props)
        this.formatDate = this.formatDate.bind(this)
        this.disabledBtnClick = this.disabledBtnClick.bind(this)
    }

    
    /**
     * 
     * @param {string} string timestamp string
     * @returns {string}
     * Returns a formatted date string from the timestamp string
     */
    formatDate(string){
        const date = new Date(string)
        const ret = date.toLocaleString()
        return ret
    }

    /**
     * 
     * @param {Event} e onClick event
     * This function is predisposed to modify an entity
     */
    disabledBtnClick(e){
        alert("Feature Not Implemented")
    }

    /**
     * 
     * @returns {JSX.Element}
     * Returns the subscription detail field.
     * Here there is lot of formatting due to the complex structure of a subscription
     * TODO: complete the subscription details with LD, conditions, excluded Attributes etc.+
     * TODO: Double check if it is correct, deep testing
     */
    render(){
        const sub = this.props.sub
        const mode = this.props.mode

        if (!sub) return

        //TODO: Manage idpattern and typepattern
        const listEntities = sub.subject.entities.map((ent) => <h3 key={ent.id}>{ent.id}</h3>)

        if (mode == "v2"){
            //TODO: Manage watchedAttribute for LD -> mode == v2? : sub.subject.condition : sub.subject.watchedAttrs (list of attributes)
            var condition = sub.subject.condition
            //TODO: MANAGE CONDITIONS
            var listConditions = condition.attrs.map(function (attr) {
                const element=
                    <div key={attr} className="conditionRow">
                        <div className="conditionName">
                            <h4>{attr}</h4>
                        </div>
                        { condition.expression ?
                        <div className="conditionValues">
                            <p>{condition.expression.q.include(attr) ? condition.expression.q.replace(attr, "").split(";")[0] : null}</p>
                            <p>{condition.expression.mq.include(attr) ? condition.expression.mq.replace(attr, "").split(";")[0] : null}</p>
                            <p>{condition.expression.georel.include(attr) ? condition.expression.georel.replace(attr, "").split(";")[0] : null}</p>
                            <p>{condition.expression.geometry.include(attr) ? condition.expression.geometry.replace(attr, "").split(";")[0] : null}</p>
                            <p>{condition.expression.coords.include(attr) ? condition.expression.coords.replace(attr, "").split(";")[0] : null}</p>
                        </div>
                        : null}
                    </div>
                return element})
        }else if (mode == "ld"){
            var condition = sub.subject.watchedAttributes
            var listConditions = condition.map(function (attr) {
                const element=
                    <div key={attr} className="conditionRow">
                        <div className="conditionName">
                            <h4>{attr}</h4>
                        </div>
                        { sub.q ?
                        <div className="conditionValues">
                            <p>{sub.q.include(attr) ? sub.q.replace(attr, "").split(";")[0].split("/")[-1] : null}</p>
                        </div>
                        : null}
                    </div>
                return element})
        }

        
        //TODO: Manage ExcludeAttrs case.
        if( mode == "v2"){
            var listSubAttr = sub.notification.attrs.map((attr) => <h4 key={attr}>{attr}</h4>)
        } else if (mode == "ld"){
            var listSubAttr = sub.notification.attributes.map((attr) => <h4 key={attr}>{attr}</h4>)
        }
        


        const failure_elem = <h4>Last Failure Reason: <p>{sub.notification.lastFailureReason}</p></h4>

        if (mode == "v2"){
            var notificationurl = sub.notification.http ? sub.notification.http.url : sub.notification.httpCustom.url
        } else if (mode == "ld"){
            var notificationurl = sub.notification.endpoint.uri
        }
         
        return(
            <div className="subDetail">
                <ItemListHeader title="Details"/>
                <div className="subInfo">
                    <h2>General Info:</h2>
                    <div className="generalInfo">
                        <h4>Id: <p>{sub.id}</p></h4>
                        <h4>Description: <p>{sub.description ? sub.description : "None"}</p></h4>
                        <h4>Expires: <p>{sub.expires ? this.formatDate(sub.expires) : "Never"}</p></h4>
                        <h4>Times Sent: <p>{sub.notification.timesSent ? sub.notification.timesSent : "0"}</p></h4>
                        <h4>Status: <p>{sub.status ? sub.status : "Unkown"}</p></h4>
                        <h4>URL: <p>{notificationurl}</p></h4>
                        <h4>Last HTTP Code: <p>{sub.notification.lastSuccessCode ? sub.notification.lastSuccessCode : "Unkown"}</p></h4>
                        {sub.notification.lastSuccessCode !== 200 ? failure_elem : null}
                        <h4>Only Changed attrs: <p>{String(sub.notification.onlyChangedAttrs)}</p></h4>
                        <h4>Sub Throttle: <p>{sub.throttling ? sub.throttling : "0"}</p></h4>
                    </div>

                    <h2>Entities:</h2>
                    <div className="entitiesInfo">
                        {listEntities}
                    </div>

                    <h2>Conditions:</h2>
                    <div className="conditionsInfo">
                        {listConditions.length > 0 ? listConditions : <div  className="conditionRow"><h4>{"All Attributes Monitored"}</h4></div>}
                    </div>

                    <h2>Subscribed to:</h2>
                    <div className="subAttributesInfo">
                        {listSubAttr.length > 0? listSubAttr : <h4>{"All Attributes"}</h4>}
                    </div>
                   
                </div>
                
                <div className="btnfooter">
                    <button className="modifyBtn" disabled={false} onClick={this.disabledBtnClick}> Modify</button>
                    <button className="deleteBtn" disabled={false} onClick={(e) => this.props.deleteSub(sub.id, e)}> Delete </button>
                </div>
            </div>
        )
    }
}