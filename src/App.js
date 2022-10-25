import './App.css';
import Nav from './Nav/nav';
import Home from './Home/home';
import Entity from './Entities/Entities';
import SubscriptionPage from './Subscriptions/SubscriptionPage';
import ItemDetail from './ShopItemDetail/detail';
import UrlForm from './UrlForm/UrlForm';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
  } from'react-router-dom'
import NewSubscriptionPage from './Subscriptions/NewSubscription';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      brokerurl:"",
      submitted: false,
      modes:['/v2/', '/ngsi-ld/v1/'],
      mode: '/v2/',
      btn_disabled: false,
      services: [],
      selected_service: 0,
      selected_link: "Home"
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

  handleLinkSelection(link){
    this.setState({selected_link : link})
  }

  //Disconnect from a context broker, resetting state to initial state
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
    } else {
      return(
        <Router>
          <div className="App">
            <Nav clickDisconnect={this.handleDisconnect} selected={this.state.selected_link} setLink={this.handleLinkSelection}/>
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
                
                {/*In questo modo faccio routing dinamico! Parametro:id*/}
                <Route path="/shop/:id" element={<ItemDetail/>}/> {/*In questo modo faccio routing dinamico! Parametro:id*/}
              </Routes>
            </div>   
          </div>
        </Router>
      )
    }
  };
}


function HeaderElement(props){
  return(
    <div className='app-header'>
      <img align="left" src='https://upload.wikimedia.org/wikipedia/commons/9/98/Engineering_logo.png' alt="Logo" width="120px" height="auto"/>
      <div className='appName'>
        <h1 >FIWARE Orion Context Broker Subscription Tool</h1>
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
