import React,{ useState, useEffect} from 'react'
import { ArrowUpRight } from 'iconoir-react'
import {motion} from 'framer-motion'

export default function FetchedOfficials( { officials } ) {

    const [role, setrole] = useState("");
  
    useEffect(() => {
       
        if (Number(officials.phone) === 1) setrole('governor');
        if (Number(officials.phone) === 2) setrole('deputy_governor');
        if (Number(officials.phone) === 3) setrole('ssg');
        if (Number(officials.phone) === 4) setrole('hos');
        if (Number(officials.phone) === 5) setrole('cos');
        if (Number(officials.phone) === 6) setrole('dcos');
       
    }, []);

  return (
    
    <div className="officialsPage" onClick={ () => role !== "" ? window.location.href = `/government/elected_officials/${role}/view` : window.location.href = `/government/elected_officials/view/${officials.fullname}` }>

        <div className="photosPoint">

            <div className="photoHolder">

                <div className="imageCarrier"> 

                    <img src= {officials.photo} /> 

                    {
                        Number(officials.phone) > 0 ?

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

                        : null
                    }

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
