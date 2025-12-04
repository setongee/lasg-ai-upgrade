import React from 'react'
import './controls.scss'

import { NavArrowLeft, NavArrowRight } from 'iconoir-react';

export default function Controls( { target, style } ) {

const scrollRight = (type) => {

    const rt = document.getElementById(target);
    if(type === 'right'){
        rt.scrollLeft += 270
    }else{
        rt.scrollLeft -= 270
    }
}

  return (

    <div className="controls flex">

        <div className="arrow__nav abs1" onClick={ () => scrollRight('left') }> 
            <div className="abs"><NavArrowLeft strokeWidth={0.7} /></div> 
        </div>

        <div className="arrow__nav abs1" onClick={ () => scrollRight('right') }> 
            <div className="abs"><NavArrowRight strokeWidth={0.7}/></div> 
        </div>

    </div>

  )

}
