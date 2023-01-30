import { isContentEditable } from "@testing-library/user-event/dist/utils";
import React from "react";
import { ItemListHeader } from "../../Reusable Components/ItemsListHeader";
import "./NewSub4.css"



export default class NewSub4 extends React.Component{
    /**
     * 
     * @param {string} stringifiedPayload Stringified JSON from subscription payload
     * @param {Function} changeStringifiedPayload Delegates Payload change to parent component (NewSubscription)
     */
    constructor(props){
        super(props)
        this.changeStringifiedPayload = this.changeStringifiedPayload.bind(this)
        
    }

    changeStringifiedPayload(e){
        this.props.changeStringifiedPayload(e)
    }

    /**
     * 
     * @returns {JSX.Element} A Textarea filled with payload JSON
     */
    render(){
        const json = this.props.stringifiedPayload
        return(
            <div className="subPage4">
                <ItemListHeader title={"Payload"} />
                <textarea name="stringifiedPayload" value={json} onChange={this.changeStringifiedPayload}></textarea>
            </div>
            /* <div className="subPage4" contentEditable = "true">
                {json}
            </div> */
        )
    }

}

// NOT IMPLEMENTED YET: function to highlight syntax errors
function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}