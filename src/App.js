import React from 'react';
import './App.css';
import Loader from './Loader.js'
import GPXParser from 'gpxparser';
import he from 'he';

let gpxInfo = {}
let isLoading = false
let state = 'LoadGpx'
let stateHistory = ['LoadGpx']
let states = ['LoadGpx','Converting','ShowingResult']

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
      current : state,
      stageHistory : stateHistory,
    }
    this.processGPX = this.processGPX.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState(value) {
    if(value.current) {
      state = value.current
      if(value.current === states[0]) {
        stateHistory = [states[0]]
      } else if(stateHistory[stateHistory.length - 1] !== value.current) {
        stateHistory.push(value.current)
      }
    }
    this.setState({
      current : state,
      stateHistory : stateHistory
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
        return (
          <div>ECCOLO!</div>
        )
      } else if(this.state.current === 'LoadGpx') {
        return (
          <div className="translate-y">
            <div className="margin-or">
              <p className="p-or p-login-or-size">CONVERT TO SVG</p>
            </div>
            <div className="button-login justify-center-column" onClick={() => this.loadGPX()}>
              <p className="p-login p-login-or-size">LOAD A GPX</p>
              <input id="gpxInput" type="file" accept=".gpx" style={{display: 'none'}} onChange={this.processGPX} />
            </div>
          </div>
        )
      }
    }
  }

  loadGPX() {
    const gpxInput = document.getElementById('gpxInput')
    if(gpxInput) gpxInput.click()
  }

  processGPX(event) {
    if(event && event.target && event.target.files && event.target.files.length) {
      isLoading = true
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        let gpxFile = e.target.result
        const gpx = new GPXParser()
        gpx.parse(gpxFile)
        console.log('gpx.metadata.time: ', gpx.metadata.time)
        console.log('gpx:', gpx)
        console.log('unix time stamp in seconds', Math.floor(gpx.tracks[0].points[0].time)/1000)
        const tracks = gpx.tracks.map(track => ({
          altitudeStream: [...track.points.map(point => (point.ele))],
          coordinates: track.points && track.points.length ? track.points.map(point => ([
            point.lon,
            point.lat
          ])) : undefined,
          timingStreamSeconds: track.points && track.points.length ? [...track.points.map(point => (Math.floor(point.time) / 1000))] : undefined,
          name: track.name ? he.decode(track.name) : undefined,
        }))
        gpxInfo = tracks[0]
        console.log('gpxInfo:', gpxInfo)
        isLoading = false
        this.changeState({current: 'ShowingResult'})
      }
      reader.readAsText(file);
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
