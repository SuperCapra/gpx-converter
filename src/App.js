import React from 'react';
import './App.css';
import Loader from './Loader.js'
import SvgShower from './SvgShower.js'
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
          <div>
            <SvgShower path="M 0,0 12.51,9.506 36.266,27.556 19.41,44.234 30.894,51.093 24.332,62.079 -1.33,46.752 16.787,28.828 4.768,19.695 -22.838,-1.281 l 3.863,-11.493 39.063,-0.047 11.232,-0.014 -6.884,-14.355 11.539,-5.534 15.663,32.662 -31.535,0.038 z" handleBack={() => this.changeState({current: 'LoadGpx'})}/>
          </div>
        )
      } else if(this.state.current === 'LoadGpx') {
        return (
          <div className="translate-y">
            <div className="margin-20">
              <p className="p-color-text-primary p-size">CONVERT TO SVG</p>
            </div>
            <div className="button-primary justify-center-column" onClick={() => this.loadGPX()}>
              <p className="p-login p-size">LOAD A GPX</p>
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
