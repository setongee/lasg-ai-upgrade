import { ArrowRight } from 'iconoir-react';
import React from 'react'
import { useNavigate } from 'react-router'
import './tab.scss'

export default function TabTitle({title, url}) {

  let navigateTo = useNavigate();

  return (

    <div className="tabTitleZone uppercase thick">

        <div className="sectionTitle"> {title} </div>
        <div className="viewAllPoint" onClick = { () => navigateTo(url) } >View All <ArrowRight width={18} strokeWidth={2} /> </div>

    </div>

  )
}
