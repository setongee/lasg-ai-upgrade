import React from 'react'
import { ArrowUpRight } from 'iconoir-react'
import {motion} from 'framer-motion'

export default function Officials( { officials, uid } ) {


  return (
    
    <div className="officialsPage">

        <div className="photosPoint" onClick = { ()=> {

            !officials.isIcon ? window.location.href = `/government/elected_officials/${uid}/view` : window.open(officials.url)

        } } >

            <div className="photoHolder">

                <div className="imageCarrier"> 

                    <img src= {officials.image} /> 

                    <motion.div 

                        className="trigger_anchor"> 
                        <motion.p whileHover={{
                            scale: 1.1,
                            transition: { duration: .1 },
                        }}
                        whileTap={{ scale: 0.9 }}> 
                            View Profile  
                            <div className="icon"><ArrowUpRight/></div> 
                        </motion.p> 
                    
                    </motion.div>

                </div>

                <div className="nameCarrier">

                    <div className="position"> {officials.position} </div>
                    <div className="fullname thick"> {officials.fullname} </div>

                </div>

            </div>
            
        </div>
        
    </div>

  )

}
