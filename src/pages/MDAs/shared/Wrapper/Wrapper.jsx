import React from 'react';
import './wrapper.css';

export default function Wrapper(props) {
  return (
    <div id={props.id} className={`wrapper ${props.customClass}`} style={props.style}>
      {props.children}
    </div>
  );
}
