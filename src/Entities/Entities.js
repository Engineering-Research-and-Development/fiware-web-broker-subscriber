import '../App.css';
import React from 'react'



class Entity extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("About Mounted")
  }


  render(){
    return(
      <div className="About">
        <h1>Entities Page</h1>
      </div>
    )
  }

}

export default Entity;