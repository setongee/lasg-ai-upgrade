import React, {useEffect, useState} from 'react'
import { NavArrowRight } from 'iconoir-react';
import { useNavigate, Link } from 'react-router';
import vector1 from '../../assets/navBar/gov.svg'
import { motion } from "framer-motion"
import Container from '../container/container';

export default function NestedView({ navData }) {

  let navigate = useNavigate();

  const [list, setList] = useState({});


  

useEffect(() => {


}, [navData]);

const addClass = (e) => {

    const parent = e.target.parentElement;
    const parentDocument = parent.querySelector('.parentLink')

}

const removeClass = (e) => {

    const parent = e.target.parentElement;
    const parentDocument = parent.querySelector('.parentLink')
}

  return (
    
    <div className="nests" style={{backgroundColor : navData.theme}} onMouseOut={ e => removeClass(e) } onMouseOver={ e => addClass(e) }>

        <div className="vectorPhoto">
        
            <img src={vector1} alt="heading title part" /> 

        </div>

        {/* Heading Area */}

        <Container >

        <div 
        className="nest_heading thick"

        > {navData.nests.heading} </div>
        
        <div className="nest_links">

            {
                navData.isNest ? navData.nests.links.map((res, index) => (
                        
                    <div 

                    className="linker" 
                    key = {index}
                    onClick={ () => {
                        if(res.external){
                            window.open(res.url)
                        }else{
                            navigate(res.url)
                        }
                    } }
                    
                    >

                        <div className="linkUp">

                            <div className="link thick underline">{res.name}</div>
                            <p> {res.desc} </p>

                        </div>

                        <NavArrowRight color='#131414' />

                    </div>
                    
                )) : null
            }

        </div>

        </Container>

    </div>

  )
}
