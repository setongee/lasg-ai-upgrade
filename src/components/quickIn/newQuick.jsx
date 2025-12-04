import React, {useEffect, useState} from 'react'
import './newQuick.scss'
import Container from '../container/container'

import lasrra from '../../assets/newQuick/lasrra.png'
import ilera from '../../assets/newQuick/ileraeko.png'
import lagride from '../../assets/newQuick/lagride.png'

import lassra_sm from '../../assets/newQuick/lasrra_sm.png'
import ilera_sm from '../../assets/newQuick/ileraeko_sm.png'
import lagride_sm from '../../assets/newQuick/lagride_sm.png'

import Controls from '../control/controls'
import { NavArrowLeft, NavArrowRight } from 'iconoir-react'

export default function NewQuick() {

const scrollRight = (type) => {

    const rt = document.getElementById('quick__holder');
    if(type === 'right'){
        rt.scrollLeft += 500
    }else{
        rt.scrollLeft -= 500
    }
}

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
    
    const width = window.innerWidth;
    
    if(width < 1000) setIsMobile(true)

}, [isMobile]);


  return (

    <div className="newQuick">

        <div className="quick__controls flex">

            <div className="arrow__nav abs1" onClick={ () => scrollRight('left') }> 
                <div className="abs"><NavArrowLeft strokeWidth={0.7} /></div> 
            </div>

            <div className="arrow__nav abs1" onClick={ () => scrollRight('right') }> 
                <div className="abs"><NavArrowRight strokeWidth={0.7}/></div> 
            </div>

        </div>

        <Container>

            {
                !isMobile ? 

                (
                    <div className="quick__holder desktop" id='quick__holder'>
                
                        <div onClick={ () => window.open('https://www.lagosresidents.gov.ng/') } className="quickId"> <img src={lasrra} alt="lasrra" /> </div>
                        <div onClick={ () => window.open('https://ileraeko.com/')} className="quickId"> <img src={ilera} alt="ilera eko" /> </div>
                        <div  onClick={ () => window.open('https://lagosride.com/')}  className="quickId"> <img src={lagride} alt="lagos ride" /> </div>

                    </div>
                ) :

                <div className="quick__holder" id='quick__holder'>
                
                    <div onClick={ () => window.open('https://www.lagosresidents.gov.ng/') } className="mobile"> <img src={lassra_sm} alt="lasrra" /> </div>
                    <div onClick={ () => window.open('https://ileraeko.com/')} className="mobile"> <img src={ilera_sm} alt="ilera eko" /> </div>
                    <div  onClick={ () => window.open('https://lagosride.com/')}  className="mobile"> <img src={lagride_sm} alt="lagos ride" /> </div>

                </div>
            }

        </Container>

    </div>

  )

}
