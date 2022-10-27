import React from "react";
import AttrList from "../../Attributes/AttrList";
import "./NewSub2.css"



export default class NewSub2 extends React.Component{
        constructor(props){
            super(props)
            /** Props:
             * attrlist
             * selectedAttrs
             * conditionAttrs
             * handleDragStart
             * handleDragEnd
             * handleDragEnter
             */
        }
    
        render(){
            
            const attrlist = this.props.attrlist
            const selectattrlist = this.props.selectedAttrs
            const conditionatrrlist = this.props.conditionAttrs
    
            const data = [
                {title : "Attributes", items: attrlist},
                {title: "Subscribed", items:selectattrlist},
                {title: "Conditions", items:conditionatrrlist}
            ]
    
            const elems = data.map((grp, grpIdx) => 
                <AttrList 
                    key={grp.title} 
                    entlist = {grp.items} 
                    title={grp.title} 
                    grpIdx={grpIdx}
                    handleDragStart = {this.props.handleDragStart}
                    handleDragEnter = {null}
                    handleDragEnd = {this.props.handleDragEnd}
                />)
    
            return(
                <div className="newSubPage2">
                    
                    {elems}
                </div>
            )
        }
    
}
