import React from 'react'
import './container.css'

export default function Container(props) {
  return (
    <div className={`container ${props.customClass}`} style = {props.style}>
        {props.children}
    </div>
  )
}