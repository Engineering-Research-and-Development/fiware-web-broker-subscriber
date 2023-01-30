import './App.css';
import Nav from './Nav/nav';
import Home from './Home/home';
import Entity from './Entities/Entities';
import SubscriptionPage from './Subscriptions/SubscriptionPage';
import UrlForm from './UrlForm/UrlForm';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
  } from'react-router-dom'
import NewSubscriptionPage from './Subscriptions/NewSubscription';


class App extends React.Component {
  /**
   * 
   * This component is the heart of the application.
   * It contains both a router to connect every main application page and
   * it saves the state of the application, included the currently connected broker,
   * mode, services, etc.
   * TODO: switch this one to sessionStorage o localStorage
   * 
   */

  constructor(props){
    super(props)
    this.state = {
      brokerurl:"",
      submitted: false,
      modes:['/v2/', '/ngsi-ld/v1/'],
      mode: '/v2/',
      btn_disabled: false,
      services: [], // List of Context Broker Services retrieved after connection
      selected_service: 0, // Index of the currently selected service
      selected_link: "Home" // Current page link of the app.
    }
    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleURLSubmit = this.handleURLSubmit.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.handleServiceLoading = this.handleServiceLoading.bind(this)
    this.handleServiceSelection = this.handleServiceSelection.bind(this)
    this.handleLinkSelection = this.handleLinkSelection.bind(this)
  }

  //Saving service selection for further calls
  handleServiceSelection(serv){
    this.setState({selected_service: serv})
  }

  //Add services when connecting to context broker
  handleServiceLoading(services){
    this.setState({
      services : services
    })
  }

  /**
   * 
   * @param {String} link 
   * This function set currently selected link.
   * When a link is selected, the main page shown is updated
   */
  handleLinkSelection(link){
    this.setState({selected_link : link})
  }

  /**
   * @param {Event} e onClick event from Disconnect Button
   * Disconnect from a context broker, resetting state to initial state
  */
  handleDisconnect(e){
    this.setState({
      brokerurl:"",
      submitted: false,
      modes:['/v2/', '/ngsi-ld/v1/'],
      mode: '/v2/',
      btn_disabled: false,
      services: [],
      selected_service: 0,
      selected_link: "Home"
    })
  }

  //Setting mode + brokerurl state depending on the input
  handleURLChange(e){
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value})
  }

  //Connect to URL, setting buttons to disabled when loading
  async handleURLSubmit(e){
    const url = this.state.brokerurl
    const mode = this.state.mode
    this.setState({btn_disabled: true})

    if (url.length <= 0){
      alert("Please, insert a valid address in form of IP:port")
      this.setState({btn_disabled: false})
      return
    } 
    try{
      const response = await fetch(`http://${url}${mode}`)
      if (response.ok){
        this.setState({submitted:true})
      }
    } catch {
      alert(`Impossible to enstabish a connection to Orion at: ${url}`)
    }
    this.setState({btn_disabled: false})

  }

  

  render() 
  {
    const submitted = this.state.submitted
    const url = this.state.brokerurl
    const mode = this.state.mode

    if (!submitted){
      return(
        <Router>
          <div className='App'>
            <HeaderElement />
            <div className='unConnectedSpace'>
              <div>
              <h2>Connect to the context broker</h2>
              </div>
            
              <UrlForm 
                broker={this.state.brokerurl}
                mode={this.state.mode}
                modes={this.state.modes}
                btn_disabled = {this.state.btn_disabled}
                handleURLChange={this.handleURLChange} 
                handleURLSubmit={this.handleURLSubmit}
              />
              
            </div>
          </div>
        </Router>
      )
    } 
    else {
      return(
        <Router>
          <div className="App">
            <Nav selected={this.state.selected_link} clickDisconnect={this.handleDisconnect} setLink={this.handleLinkSelection}/>
            <div style={{paddingTop:"90px"}}>
              <Routes>
                <Route path= "/" 
                  element={<Home 
                    cburl={url} 
                    version={mode} 
                    onServiceDetection={this.handleServiceLoading}
                    onServiceSelection={this.handleServiceSelection}
                    services = {this.state.services}
                    selected_service = {this.state.selected_service}
                  />} 
                />
                <Route path="/entities" element={<Entity />} />

                <Route path="/subscriptions" 
                  element={<SubscriptionPage 
                    baseurl = {url+mode}
                    service = {this.state.services[this.state.selected_service]}
                    
                  />} 
                />
                <Route path="/subscriptions/new" 
                  element={<NewSubscriptionPage
                    baseurl = {url+mode}
                    service = {this.state.services[this.state.selected_service]}
                  />}
                /> 
                
                {/*Reminder: in this way I can do dynamic routing -> Parameter:id*
                <Route path="/shop/:id" element={<ItemDetail/>}/>*/}
              </Routes>
            </div>   
          </div>
        </Router>
      )
    }
  };
  
}

/**
 * Returns the APP header when not connected to URL
 * 
 * @returns {JSX.Element}
 */
function HeaderElement(props){
  return(
    <div className='app-header'>
      <img align="left" src='https://upload.wikimedia.org/wikipedia/commons/9/98/Engineering_logo.png' alt="Logo" width="120px" height="auto"/>
      <div className='appName'>
        <h1 >FIWARE Context Brokers Subscription Tool</h1>
      </div>
    </div>
  )
}

export default App;

// To install react router dom, cd folder, then npm i react-router-dom
// Switch è stato sostituito da Routes
// Le Routes si definiscono così: from (e.g. <Route path=”/” component={Home} becomes <Route path=”/” element={Home} />
// Di base, Switch è stato sostituito da Routes
// non è più necessario usare gli exact path, sono di default
