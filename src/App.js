import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import Loader from './Loader.js'

let gpx = {}
let isLoading = false
let stage = 'LoadGpx'
let stageHistory = ['LoadGpx']
let stages = ['LoadGpx','Converting','ShowingResult']

function App() {
  return (
    <div>
      <Router />
    </div>
  );
}

class Router extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      current : stage,
      stageHistory : stageHistory,
    }
  }

  changeStage(value) {
    if(value.current) {
      stage = value.current
      if(value.current === stages[0]) {
        stageHistory = [stages[0]]
      } else if(stageHistory[stageHistory.length - 1] !== value.current) {
        stageHistory.push(value.current)
      }
    }
    this.setState({
      current : stage,
      stageHistory : stageHistory
    })
  }

  routesToStage() {
    isLoading = false
    if(isLoading || this.state.current === 'Converting') {
      return (
        <div className="translate-y">
          <Loader/>
        </div>
      )
    } else {
      if(this.state.current === 'ShowingResult') {
        // return (
        //   <div className="translate-y">
        //     <div className="button-login justify-center-column" onClick={() => {
        //       window.location.href = stravaAuthorizeUrl
        //     }}><p className="p-login p-login-or-size">LOGIN TO STRAVA</p></div>
        //     <div className="margin-or">
        //       <p className="p-or p-login-or-size">OR</p>
        //     </div>
        //     <div className="button-login justify-center-column" onClick={() => this.loadGPX()}>
        //       <p className="p-login p-login-or-size">LOAD A GPX</p>
        //       <input id="gpxInput" type="file" accept=".gpx" style={{display: 'none'}} onChange={this.processGPX} />
        //     </div>
        //   </div>
        // )
      } else if(this.state.current === 'LoadGpx') {
        return (
          <div>ECCOLO!</div>
        )
      }
    }
  }

  render() {
    return (   
      <div className="App">
        <div className="App-header">
            {this.routesToStage()}
        </div>
      </div>
    )
  }
}

export default App;
