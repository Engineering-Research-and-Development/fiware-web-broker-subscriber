import './nav.css'
import React from 'react'
import {Link} from 'react-router-dom'

//Reminder: useState hook holds the API's state and useEffect starts the fetch call when component is mpunted 

class Nav extends React.Component{
  /**
   * 
   * @param {string} selected selected link to highlight in the navbar
   * @param {Function} clickDisconnect function that disconnect from the current context broker
   * @param {Function} setLink function to switch currently selected link
   */
  constructor(props){
    super(props)
    this.clickDisconnect = this.clickDisconnect.bind(this)
    this.handleLinkSelection = this.handleLinkSelection.bind(this)

  }

  /**
   * 
   * @param {Event} e // onClick event
   * Delegates disconnection to Parent component (App)
   */
  clickDisconnect(e){
    this.props.clickDisconnect(e)
  }

  /**
   * 
   * @param {Event} e  // linkClick event
   * Delegates link click to parent component (App)
   * In Navbar, currently selected link is highlighted with a different style
   */
  handleLinkSelection(e){
    //e.preventDefault()
    this.props.setLink(e.target.innerHTML)
    
  }

  /**
   * Returns the navbar element shown when connected to a context broker.
   * This element contains 3 instances of MyLink class and a button, linked to root, to disconnect from CB
   * All those links are in a list element
   * @returns {JSX.Element}
   */
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
  /**
   * 
   * @param {Function} linkClick Function to switch selected link
   * @param {string} selected String of the InnerHTML of the selected link 
   * @param {string} inner InnerHTML of the rendered link
   */

  constructor(props){
    super(props)
    this.evaluateLinkClass = this.evaluateLinkClass.bind(this)
    this.LinkUnderline = this.LinkUnderline.bind(this)
  }

  /**
   * 
   * @returns {string} className among "linkStyle current" and linkStyle
   * this className decides the Link style (highlighted or not)
   * The evaluation is based on a comparison between the innerHTML of the link and the selected one's
   */
  evaluateLinkClass(){
    const className = this.props.inner===this.props.sel ? "linkStyle current" : "linkStyle"
    return className
  }

  /**
   * 
   * @param {Event} e onClick event that delegates to parent (Nav) link selection
   */
  LinkUnderline(e){
    this.props.linkClick(e)
  }

  /**
   * Return a link element inside a list
   * @returns {JSX.Element}
   */
  render(){
    return( 
      <li><Link onClick={this.LinkUnderline} className={this.evaluateLinkClass()} to={this.props.to}>{this.props.inner}</Link></li>
    )
    
  }
}

export default Nav;

