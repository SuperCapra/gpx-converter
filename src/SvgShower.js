import './App.css';
import React, { useRef, useState } from 'react';
import {ReactComponent as ArrowDown} from './arrowDownSimplified.svg'
import brandingPalette from './brandingPalette';

function SvgShower(props) {

    let {data, path, width, height, handleBack} = props
    const svgRef = useRef(null)
    const [routePath,setRoutePath] = useState(data.routePath)
    const [altitudePath,setAltitudePath] = useState(data.altitudePath)
    const [type,setType] = useState('route')

    const downloadSVG = () => {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svgElement);
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
        console.log('data.altitudePath:', data.altitudePath)
        console.log('data.routePath:', data.routePath)
        console.log('path:', path)
        console.log('type', type)
        setType(type)
        console.log('path:', path)
    }
  
    return(
        <div className="scaled-to-height">
            <div className="back-button">
                <div className="horizontal-elements" onClick={() => handleBack()}>
                    <ArrowDown className="back-image"/>
                    <p className="p-back">BACK</p>
                </div>
                <div className="button-primary-shorter justify-center-column" onClick={() => changePath('route')}>
                    <p className="p-login p-size">ROUTE</p>
                </div>
                <div className="button-primary-shorter justify-center-column" onClick={() => changePath('altitude')}>
                    <p className="p-login p-size">ALTITUDE</p>
                </div>
                <div className="button-primary-shorter justify-center-column" onClick={downloadSVG}>
                    <p className="p-login p-size">GET SVG</p>
                </div>
            </div>
            <div className="bordered-div margin-div">
                {type === 'route' && <svg ref={svgRef} width={width} height={height}>
                    <path d={routePath} stroke={brandingPalette.primary} strokeWidth="2" fill="none"/>
                </svg>}
                {type === 'altitude' && <svg ref={svgRef} width={width} height={height}>
                    <path d={altitudePath} stroke={brandingPalette.primary} strokeWidth="2" fill="none"/>
                </svg>}
            </div>
        </div>
    )
}

export default SvgShower;