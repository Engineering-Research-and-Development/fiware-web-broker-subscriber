import './nav.css'
import React from 'react'
import {Link} from 'react-router-dom'

//useState mantiene lo stato dell'API e useEffect fa partire la fetch call quando il componente si monta 

class Nav extends React.Component{
  constructor(props){
    super(props)
    this.clickDisconnect = this.clickDisconnect.bind(this)
    this.handleLinkSelection = this.handleLinkSelection.bind(this)

  }

  clickDisconnect(e){
    this.props.clickDisconnect(e)
  }

  handleLinkSelection(e){
    //e.preventDefault()
    this.props.setLink(e.target.innerHTML)
    
  }

  render(){
    const selected = this.props.selected
    return (
       <header style={{position:'fixed', width:"100%", top:"0px"}}>
        <nav>
            <img align="left" src='https://upload.wikimedia.org/wikipedia/commons/9/98/Engineering_logo.png' alt="Logo" width="120 px" height="auto"/>
            <ul id="navlinklist" className="navLinks" >
                <MyLink  linkClick={this.handleLinkSelection} sel={selected} inner={"Home"} to="/"/>
                <MyLink  linkClick={this.handleLinkSelection} sel={selected} inner={"Entities"} to="/entities"/>
                <MyLink linkClick={this.handleLinkSelection} sel={selected} inner={"Subscriptions"} to="/subscriptions"/>
                <Link to="/"><button className="disconnectButton" type="submit" onClick={this.clickDisconnect}>Disconnect</button></Link>
            </ul>
        </nav>
      </header>
    );
  }
  
}


class MyLink extends React.Component{
  //props: selected, inner
  constructor(props){
    super(props)
    this.evaluateLinkClass = this.evaluateLinkClass.bind(this)
    this.LinkUnderline = this.LinkUnderline.bind(this)
  }

  evaluateLinkClass(){
    
    const classname = this.props.inner===this.props.sel ? "linkStyle current" : "linkStyle"
    return classname
  }

  LinkUnderline(e){
    this.props.linkClick(e)
  }

  render(){
    return( 
      <li><Link onClick={this.LinkUnderline} className={this.evaluateLinkClass()} to={this.props.to}>{this.props.inner}</Link></li>
    )
    
  }
}

export default Nav;

