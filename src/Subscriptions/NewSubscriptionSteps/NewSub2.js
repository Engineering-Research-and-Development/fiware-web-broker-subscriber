import React from "react";
import DragList from "../../DragItems/DragList";
import "./NewSub2.css"



export default class NewSub2 extends React.Component{
        constructor(props){
            super(props)
            /** Props:
             * selectedEnts
             * attrlist 
             * selectedAttrs
             * conditionAttrs
             * handleDragStart
             * handleDragEnd
             * handleDragEnter
             */
             this.state = {
                searched_attrs : "",
                searched_ents : "",
                search_modes : ['Name', 'Type'],
                search_mode : 'Name',
                selected_ent: null
            }
            this.handleSearchEntityChange = this.handleSearchEntityChange.bind(this)
            this.handleSearchAttributeChange = this.handleSearchAttributeChange.bind(this)
            this.filterEntities = this.filterEntities.bind(this)
            this.filterAttributes = this.filterAttributes.bind(this)
            this.handleSelection = this.handleSelection.bind(this)
            this.resetSelection = this.resetSelection.bind(this)
        }

        resetSelection(){
            this.setState({selected_ent : null})
        }
    
        handleSelection(e, name){
            if (this.state.selected_ent == name) return this.resetSelection()
            this.setState({selected_ent : name})
        }


        handleSearchEntityChange(e){
            const name = e.target.name
            const value = e.target.value

            if (name == "searched") return this.setState({searched_ents : value})

            this.setState({[name] : value})
        }

        handleSearchAttributeChange(e){
            const name = e.target.name
            const value = e.target.value

            if (name == "searched") return this.setState({searched_attrs : value})

            this.setState({[name] : value})
        }
    
        filterEntities(list){
            const mode = this.state.search_mode
    
            if (mode=="Name") return list.filter(item => item.id.toLowerCase().includes(this.state.searched_ents.toLowerCase()))
            if (mode=="Type") return list.filter(item => item.type.toLowerCase().includes(this.state.searched_ents.toLowerCase()))
        }

        filterAttributes(list){
            const mode = this.state.search_mode

            const selected_ent = this.state.selected_ent
            if (selected_ent){
                const ent = this.props.selectedEnts.filter(ent => ent.id == selected_ent)[0]
                const entAttrs = Object.keys(ent).map((key) => {
                    if (key == 'id' || key == 'type') return 
                    const attr = key
                    return attr
                })

                if (mode=="Name") return list.filter(item => item.id.toLowerCase().includes(this.state.searched_attrs.toLowerCase())).filter(item => entAttrs.includes(item.id))
                if (mode=="Type") return list.filter(item => item.type.toLowerCase().includes(this.state.searched_attrs.toLowerCase())).filter(item => entAttrs.includes(item.id))
            }
                
            
            if (mode=="Name") return list.filter(item => item.id.toLowerCase().includes(this.state.searched_attrs.toLowerCase()))
            if (mode=="Type") return list.filter(item => item.type.toLowerCase().includes(this.state.searched_attrs.toLowerCase()))

            
        }

        


        render(){
            
            const attrlist = this.props.attrlist
            const selectattrlist = this.props.selectedAttrs
            const conditionatrrlist = this.props.conditionAttrs
            const selectedEnts = this.filterEntities(this.props.selectedEnts)

            const filterattrlist = this.filterAttributes(this.props.attrlist)
            
    
            const data = [
                {title : "Attributes", items: attrlist},
                {title: "Subscribed", items:selectattrlist},
                {title: "Conditions", items:conditionatrrlist}
            ]
    
            const elems = data.map((grp, grpIdx) => 
                <DragList 
                    key={grp.title} 
                    itemList = {grp.items}
                    filterList = {!grpIdx ? filterattrlist : null }
                    title={grp.title}
                    placeholder="All attributes set"
                    grpIdx={grpIdx}
                    handleDragStart = {this.props.handleDragStart}
                    handleDragEnter = {this.props.handleDragEnter}
                    handleDragEnd = {this.props.handleDragEnd}
                    handleSearchChange = {this.handleSearchAttributeChange}
                    visMode = "horizontal"
                    modifiableChildren = {grpIdx == 2? true : false}
                    searched = {this.state.searched}
                    search_mode = {this.state.search_mode}
                    search_modes = {this.state.search_modes}
                    handleSelection = {null}
                />)
            
            const selectedEntsList = 
            <DragList
                itemList = {selectedEnts} 
                title={"Selected Entities"} 
                grpIdx={0}
                handleDragStart = {null}
                handleDragEnter = {null}
                handleDragEnd = {null}
                handleSearchChange = {this.handleSearchEntityChange}
                visMode = "vertical"
                modifiableChildren = {false}
                searched = {this.state.searched}
                search_mode = {this.state.search_mode}
                search_modes = {this.state.search_modes}
                handleSelection = {this.handleSelection}
                selected = {this.state.selected_ent}
            />

            return(
                <div className="newSubPage2" >
                    <div className="entityList" >
                        {selectedEntsList}
                        {/* {this.state.selected_ent ? <h3 onClick = {this.resetSelection}> {`Selected: ${this.state.selected_ent}`}</h3> : null} */}
                    </div>
                    <div className="attrList" >
                        
                        {elems}
                    </div>
                    
                </div>
            )
        }
    
}
