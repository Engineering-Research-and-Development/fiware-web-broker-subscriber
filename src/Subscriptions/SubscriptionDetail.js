import React from "react";
import "./SubscriptionDetail.css"


export default class SubscriptionDetail extends React.Component{
    constructor(props){
        super(props)
        this.formatDate = this.formatDate.bind(this)
        this.disabledBtnClick = this.disabledBtnClick.bind(this)
    }

    formatDate(string){
        const date = new Date(string)
        const ret = date.toLocaleString()
        return ret
    }

    disabledBtnClick(e){
        alert("Feature Not Implemented")
    }

    render(){
        const sub = this.props.sub

        if (!sub) return

        const listEntities = sub.subject.entities.map((ent) => <h3 key={ent.id}>{ent.id}</h3>)
        const condition = sub.subject.condition
        const listConditions = condition.attrs.map(function (attr) {
            const element=
                <div key={attr} className="conditionRow">
                    <div className="conditionName">
                        <h4>{attr}</h4>
                    </div>
                    { condition.expression ?
                    <div className="conditionValues">
                        <p>{condition.expression.q.include(attr) ? condition.expression.q.replace(attr, "") : null}</p>
                        <p>{condition.expression.mq.include(attr) ? condition.expression.mq.replace(attr, "") : null}</p>
                        <p>{condition.expression.georel.include(attr) ? condition.expression.georel.replace(attr, "") : null}</p>
                        <p>{condition.expression.geometry.include(attr) ? condition.expression.geometry.replace(attr, "") : null}</p>
                        <p>{condition.expression.coords.include(attr) ? condition.expression.coords.replace(attr, "") : null}</p>
                    </div>
                    : null}
                </div>
            return element
        })
        
        const listSubAttr = sub.notification.attrs.map((attr) => <h4 key={attr}>{attr}</h4>)
        const failure_elem = <h4>Last Failure Reason: <p>{sub.notification.lastFailureReason}</p></h4>

        return(
            <div className="subDetail">
                <div className="subInfo">
                    <h2>Details:</h2>
                    <div className="generalInfo">
                        <h4>Id: <p>{sub.id}</p></h4>
                        <h4>Description: <p>{sub.description}</p></h4>
                        <h4>Expires: <p>{sub.expires ? this.formatDate(sub.expires) : "Never"}</p></h4>
                        <h4>Times Sent: <p>{sub.notification.timesSent ? sub.notification.timesSent : "0"}</p></h4>
                        <h4>Status: <p>{sub.status ? sub.status : "Unkown"}</p></h4>
                        <h4>URL: <p>{sub.notification.http.url}</p></h4>
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
                    <button className="deleteBtn" disabled={false} onClick={this.disabledBtnClick}> Delete </button>
                </div>
            </div>
        )
    }
}