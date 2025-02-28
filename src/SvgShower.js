import './App.css';
import React, { useRef, useState } from 'react';
import {ReactComponent as ArrowDown} from './arrowDownSimplified.svg'
import brandingPalette from './brandingPalette';

function SvgShower(props) {
    let {data, path, width, height, handleBack} = props

    const styleAltitude = {
        stroke: brandingPalette.primary,
        strokeWidth: 2,
        fill: brandingPalette.primary,
        strokeLinecap: 'none',
        strokeLinejoin: 'round'
    }
    const styleRoute = {
        stroke: brandingPalette.primary,
        strokeWidth: 2,
        fill: 'none',
        strokeLinecap: 'none',
        strokeLinejoin: 'round'
    }
    const svgRef = useRef(null)
    const [routePath,setRoutePath] = useState(data.routePath)
    const [altitudePath,setAltitudePath] = useState(data.altitudePath)
    const [type,setType] = useState('route')
    const getClassesRouteButton = () => {
        if(type === 'route') return 'button-primary-shorter button-secondary-color justify-center-colum'
        else return 'button-primary-shorter justify-center-colum'
    }
    const getClassesAltitudeButton = () => {
        if(type === 'altitude') return 'button-primary-shorter button-secondary-color justify-center-colum'
        else return 'button-primary-shorter justify-center-colum'
    }
    const classesRouteButton = getClassesRouteButton()
    const classesAltitudeButton = getClassesAltitudeButton()


    const downloadSVG = () => {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const source = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + serializer.serializeToString(svgElement);
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
  
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = (props.name ? props.name : 'image') + '.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    const changePath = (type) =>  {
        setType(type)
    }
  
    return(
        <div className="scaled-to-height">
            <div className="back-button">
                <div className="horizontal-elements" onClick={() => handleBack()}>
                    <ArrowDown className="back-image"/>
                    <p className="p-back">BACK</p>
                </div>
                <div className={classesRouteButton} onClick={() => changePath('route')}>
                    <p className="p-login p-size">ROUTE</p>
                </div>
                <div className={classesAltitudeButton} onClick={() => changePath('altitude')}>
                    <p className="p-login p-size">ALTITUDE</p>
                </div>
                <div className="button-primary-shorter button-primary-color justify-center-column" onClick={downloadSVG}>
                    <p className="p-login p-size">GET SVG</p>
                </div>
            </div>
            <div className="bordered-div margin-div">
                {type === 'route' && <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
                    <path d={routePath} style={styleRoute}/>
                </svg>}
                {type === 'altitude' && <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
                    <path d={altitudePath} style={styleAltitude}/>
                </svg>}
            </div>
        </div>
    )
}

export default SvgShower;