import './App.css';
import React, { useRef } from 'react';
import {ReactComponent as ArrowDown} from './arrowDownSimplified.svg'

function SvgShower(props) {

    const {path, handleBack} = props
    const svgRef = useRef(null);

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
  
    return(
        <div>
            <div className="back-button" onClick={() => handleBack()}>
                <ArrowDown className="back-image"/>
                <p className="p-back">BACK</p>
            </div>
            <svg ref={svgRef} width="1000px" height="1000px">
                <path d={props.path}/>
            </svg>
            <div className="button-primary justify-center-column" onClick={downloadSVG}>
                <p className="p-login p-size">GET SVG</p>
            </div>
        </div>
    )
}

export default SvgShower;