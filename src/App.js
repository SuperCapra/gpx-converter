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
let width = 600
let height = width

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
            <SvgShower width={width} height={height} path={gpxInfo.path} handleBack={() => this.changeState({current: 'LoadGpx'})}/>
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
        this.normalizeCoordinates(gpxInfo.coordinates)
        gpxInfo['path'] = this.getPath(this.normalizeCoordinates(gpxInfo.coordinates))
        console.log('gpxInfo:', gpxInfo)
        isLoading = false
        this.changeState({current: 'ShowingResult'})
      }
      reader.readAsText(file);
    }
  }

  normalizeCoordinates(coordinates) {
    if(!coordinates || (coordinates && !coordinates.length)) return undefined
    let normalizedCoordinates = []
    let minX = Math.min(...coordinates.map(x => x[0]))
    let minY = Math.min(...coordinates.map(x => x[1]))
    let maxX = Math.max(...coordinates.map(x => x[0]))
    let maxY = Math.max(...coordinates.map(x => x[1]))
    console.log('Math.min X:', minX)
    console.log('Math.min Y:', minY)
    console.log('Math.max X:', maxX)
    console.log('Math.max Y:', maxY)
    let gapX = maxX - minX
    let gapY = maxY - minY
    let mapCenterX = (maxX + minX) / 2
    let mapCenterY = (maxY + minY) / 2
    let zoomFactor = Math.min(width / gapX, height / gapY) * 0.95
    for(let coordinate of coordinates) {
      normalizedCoordinates.push([(coordinate[0] - mapCenterX) * zoomFactor + width / 2, - (coordinate[1] - mapCenterY) * zoomFactor + height / 2])
    }
    console.log('Math.min X:', Math.min(...normalizedCoordinates.map(x => x[0])))
    console.log('Math.min Y:', Math.min(...normalizedCoordinates.map(x => x[1])))
    console.log('Math.max X:', Math.max(...normalizedCoordinates.map(x => x[0])))
    console.log('Math.max Y:', Math.max(...normalizedCoordinates.map(x => x[1])))
    return normalizedCoordinates
  }

  getPath(coordinates) {
    if(!coordinates || (coordinates && !coordinates.length)) return undefined;

    // Start the path at the first coordinate
    let pathData = 'M ' + coordinates[0][0] + ',' + coordinates[0][1];

    // Loop through the coordinates and create lines to each point
    for (let i = 1; i < coordinates.length; i++) {
      pathData += 'L ' + coordinates[i][0] + ',' + coordinates[i][1];
    }

    return pathData;
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
