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
        <div className="scaled-to-height">
            <div className="back-button" onClick={() => handleBack()}>
                <div className="horizontal-elements">
                    <ArrowDown className="back-image"/>
                    <p className="p-back">BACK</p>
                </div>
                <div className="button-primary-shorter justify-center-column" onClick={downloadSVG}>
                    <p className="p-login p-size">GET SVG</p>
                </div>
            </div>
            <div className="bordered-div margin-div">
                <svg ref={svgRef} className="dimention-svg">
                    <path d={props.path}/>
                </svg>
            </div>
        </div>
    )
}

export default SvgShower;