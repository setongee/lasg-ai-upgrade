import React, {useEffect, useState} from 'react'
import{motion} from 'framer-motion'
import './span.scss'

export default function SpanMotion({text}) {

    const [textIndex, setTextIndex] = useState(0);
    const textContent = ['Simplifying', 'Optimizing', 'Automating']

    const nextText = () => {

        if ( textIndex !== ( textContent.length - 1 ) ) {
    
            setTextIndex( textIndex + 1 );

    
        } else{

            setTextIndex(0)

        }
    
    }

    useEffect(() => {

        const interval = setInterval(() => {

            nextText();
            
        }, 2000);
        
        return () => clearInterval(interval);

    }, [textIndex]);
    
  
    return (

        <div className="holder"> <p key = {textContent[textIndex]} > { textContent[textIndex] } </p> </div>
  )

}
