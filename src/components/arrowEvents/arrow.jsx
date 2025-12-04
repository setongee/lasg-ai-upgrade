import React from 'react'

import { ArrowUpRight} from 'iconoir-react';

export default function Arrow({color}) {
  return (
    <div className="prima">
        <div className="iconAnim"> 
            <ArrowUpRight className='arr first' color = {color} /> 
            <ArrowUpRight className='arr last' color = {color} /> 
        </div> 
    </div>
  )
}
